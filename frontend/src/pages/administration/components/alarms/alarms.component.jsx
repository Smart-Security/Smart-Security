/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import UserManagementService from "./../../../../services/users.management.service.js";
import AlarmsManagementService from "./../../../../services/alarms.management.service.js";
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
import { useTheme } from "@mui/material/styles";
import { Divider, Stack } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Tooltip from "@mui/material/Tooltip";

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

    const [selectedAlarms, setSelectedAlarms] = useState([]);

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

    /**
     * Load alarms from
     */
    const fetchData = async () => {
        try {
            setPageState((old) => ({ ...old, isLoading: true }));

            const response = await UserManagementService.getBuilding(auth.user);

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

    useEffect(() => {
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

    const theme = useTheme();

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    /**
     * Action event to set on the selected alarms list.
     */
    const onAlarmsActivation = async () => {
        try {
            await AlarmsManagementService.activateAlarms(
                auth.user,
                selectedAlarms
            );
            fetchData();

            // show snackbar with success message
            snackbarService.showSuccess(
                strings.adminstration.alarms.list.activationSuccess,
                setSnackbar
            );
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

    /**
     * Action event to set off the selected alarms list.
     */
    const onAlarmsDeactivation = async () => {
        try {
            await AlarmsManagementService.deactivateAlarms(
                auth.user,
                selectedAlarms
            );
            fetchData();

            // show snackbar with success message
            snackbarService.showSuccess(
                strings.adminstration.alarms.list.deactivationSuccess,
                setSnackbar
            );
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

    return (
        <div className="alarms-container">
            <div className="title-container">
                <h1 className="content-title">
                    {strings.adminstration.alarms.title}
                </h1>

                <Zoom
                    in={selectedAlarms.length > 0}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${transitionDuration.exit}ms`,
                    }}
                    unmountOnExit>
                    <Stack
                        direction="row"
                        spacing={2}
                        className="alarm-actions-container"
                        divider={<Divider orientation="vertical" flexItem />}>
                        <Tooltip
                            title={
                                strings.adminstration.alarms.list.actions
                                    .deactivate
                            }>
                            <IconButton
                                onClick={onAlarmsDeactivation}
                                color="primary"
                                aria-label="see user details"
                                component="label"
                                style={{ color: theme.palette.error[400] }}>
                                <NotificationsOffIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title={
                                strings.adminstration.alarms.list.actions
                                    .activate
                            }>
                            <IconButton
                                onClick={onAlarmsActivation}
                                aria-label="see user details"
                                component="label"
                                style={{
                                    color: theme.palette.success[400],
                                }}>
                                <NotificationsActiveIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Zoom>
            </div>
            <div className="alarms-data-table-container">
                <DataGrid
                    autoHeight
                    checkboxSelection
                    rows={pageState.data}
                    loading={pageState.isLoading}
                    columns={columns}
                    getRowId={(row) => row.division.uuid}
                    rowsPerPageOptions={[100]}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectedAlarms(newSelectionModel);
                    }}
                    selectionModel={selectedAlarms}
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
