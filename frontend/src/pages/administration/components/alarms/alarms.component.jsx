/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import UserManagementService from "./../../../../services/users.management.service.js";
import { useAuth } from "./../../../../hooks/use-auth.hook";
import strings from "./../../../../constants/strings";
import "./alarms.component.css";
import Snackbar from "@mui/material/Snackbar";
import snackbarService from "./../../../../services/snackbar.service";
import Alert from "./../../../../components/alert.component";
import IconButton from "@mui/material/IconButton";
import { KNOWHTTPSTATUS } from "./../../../../services/api.service";
import { DIVISION_TYPE } from "./../../../../models/divisions-type.model";
import { useNavigate } from "react-router-dom";

export default function Alarms(props) {
    // map response id to a string
    const divisionTypesMap = {};
    divisionTypesMap[DIVISION_TYPE.common_area] =
        strings.divisionTypes.commonArea;
    divisionTypesMap[DIVISION_TYPE.office] = strings.divisionTypes.office;

    // state to manage snackbar state
    const [snackbar, setSnackbar] = useState(
        snackbarService._getInitialState()
    );

    // alrms datagrid column configuration
    const columns = [
        {
            field: "state",
            headerName: strings.adminstration.alarms.list.alarmStatus,
            sortable: true,
            align: "center",
            renderCell: (params) => {
                const alarmStateClass =
                    "alarm-state-container" +
                    (params.row.division.on ? " on" : " off");
                return (
                    <div className="alarm-container">
                        <div className={alarmStateClass}></div>
                    </div>
                );
            },
            valueGetter: (params) => params.row.division.on,
        },
        {
            field: "name",
            headerName: strings.adminstration.alarms.list.name,
            flex: 1,
            valueGetter: (params) => params.row.division.name,
        },
        {
            field: "type",
            headerName: strings.adminstration.alarms.list.divisionType,
            flex: 1,
            valueGetter: (params) => divisionTypesMap[params.row.division.type],
        },
        {
            field: "floor",
            headerName: strings.adminstration.alarms.list.floor,
            flex: 1,
            valueGetter: (params) =>
                params.row.floor === 0
                    ? strings.groundFloor
                    : `${strings.adminstration.alarms.list.floor} ${params.row.floor}`,
        },
    ];

    const auth = useAuth();
    const navigate = useNavigate();

    const [pageState, setPageState] = useState({
        isLoading: false,
        data: [],
        total: 0,
    });

    useEffect(() => {
        /**
         * Uniformize the reponse data to provide floor information on every item.
         * @param {*} responseData
         * @returns
         */
        const uniformizeRepsonse = (responseData) => {
            return responseData.floorDtos
                .map((floor) => {
                    return floor.divisions.map((division, index) => {
                        return {
                            floor: floor.number,
                            division: division,
                        };
                    });
                })
                .flat(1);
        };

        const fetchData = async () => {
            try {
                setPageState((old) => ({ ...old, isLoading: true }));

                const response = await UserManagementService.getBuilding(
                    auth.user
                );

                const data = uniformizeRepsonse(response.data);
                const total = data.length;

                setPageState((old) => ({
                    ...old,
                    isLoading: false,
                    data: data,
                    total: total,
                }));
            } catch (e) {
                // if status code is unauthorized the user credentials are wrong
                if (e?.response?.status === KNOWHTTPSTATUS.unauthorized) {
                    auth.logout();
                    navigate("/"); // redirect to login
                }

                // show snackbar with error message
                snackbarService.showError(e.message, setSnackbar);
            }
        };

        fetchData();
    }, []);

    /**
     * Event on snackbar close event
     * @param {*} event
     * @param {*} reason
     * @returns void
     */
    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;

        snackbarService.hide(snackbar, setSnackbar);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}></IconButton>
        </React.Fragment>
    );

    return (
        <div className="alarms-container">
            <h1 className="content-title">
                {strings.adminstration.alarms.title}
            </h1>
            <div className="alarms-data-table-container">
                <DataGrid
                    autoHeight
                    checkboxSelection
                    rows={pageState.data}
                    loading={pageState.isLoading}
                    columns={columns}
                    getRowId={(row) => row.division.uuid}
                    rowsPerPageOptions={[]}
                />
            </div>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleClose}
                action={action}>
                <Alert onClose={handleClose} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
