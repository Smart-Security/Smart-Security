/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import strings from "./../../../../constants/strings";
import { useAuth } from "./../../../../hooks/use-auth.hook";
import MonitorizationService from "./../../../../services/monitorization.service";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import "./monitorization.component.css";
import { ALARM_STATES } from "./../../../../models/alarm-state.model";
import IconButton from "@mui/material/IconButton";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import Dialog from "@mui/material/Dialog";
import MonitorizationDetail from "./components/monitorization-details/monitorization-details.component";
import Snackbar from "@mui/material/Snackbar";
import snackbarService from "./../../../../services/snackbar.service";
import Alert from "./../../../../components/alert.component";
import { KNOWHTTPSTATUS } from "./../../../../services/api.service";
import { useNavigate } from "react-router-dom";

export default function Monitorization(props) {
    const auth = useAuth();
    const navigate = useNavigate();

    // state to manage snackbar state
    const [snackbar, setSnackbar] = useState(
        snackbarService._getInitialState()
    );

    const alarmsStateMap = {};
    alarmsStateMap[ALARM_STATES.activate] =
        strings.adminstration.monitorization.list.alarmStates.active;
    alarmsStateMap[ALARM_STATES.deactivate] =
        strings.adminstration.monitorization.list.alarmStates.deactive;
    alarmsStateMap[ALARM_STATES.deactivateBySecurityGuard] =
        strings.adminstration.monitorization.list.alarmStates.deactivatedBySecurityGuard;
    alarmsStateMap[ALARM_STATES.activateBySecurityGuard] =
        strings.adminstration.monitorization.list.alarmStates.activatedBySecurityGuard;
    alarmsStateMap[ALARM_STATES.keepActivate] =
        strings.adminstration.monitorization.list.alarmStates.keepActive;
    alarmsStateMap[ALARM_STATES.keepDeactivate] =
        strings.adminstration.monitorization.list.alarmStates.keepDeactive;

    /**
     * State to control the user details dialog
     */
    const [logDetailsDialogState, setUserDetailsDialogState] = useState({
        open: false,
        user: null,
    });

    /**
     * On user details dialog
     * @param {*} user
     */
    const handleUserDetailsOpen = (log) => {
        setUserDetailsDialogState({
            open: true,
            log: log,
        });
    };

    /**
     * On user details dialog close
     */
    const handleUserDetailsClose = () => {
        setUserDetailsDialogState({
            ...logDetailsDialogState,
            open: false,
        });
    };

    /**
     * Format Java Date string
     * @param {*} dateString
     * @returns
     */
    const getDateFotmatted = (dateString) =>
        moment(dateString).format("DD/MM/YYYY HH:mm:ss");

    // Datagrid columns configuration
    const columns = [
        {
            field: "name",
            headerName: strings.adminstration.monitorization.list.name,
            flex: 1,
            valueGetter: (params) => params.row.user.name,
        },
        {
            field: "email",
            headerName: strings.adminstration.monitorization.list.email,
            flex: 1,
            valueGetter: (params) => params.row.user.email,
        },
        {
            field: "entryAt",
            headerName: strings.adminstration.monitorization.list.entryAt,
            flex: 1,
            valueGetter: (params) =>
                params.row.entryAt ? getDateFotmatted(params.row.entryAt) : "-",
        },
        {
            field: "leaveAt",
            headerName: strings.adminstration.monitorization.list.leaveAt,
            flex: 1,
            valueGetter: (params) =>
                params.row.leaveAt ? getDateFotmatted(params.row.leaveAt) : "-",
        },
        {
            field: "access",
            headerName: strings.adminstration.monitorization.list.access,
            flex: 1,
            valueGetter: (params) => params.row.division.name,
        },
        {
            field: "stateOnEntry",
            headerName: strings.adminstration.monitorization.list.stateEntry,
            flex: 1,
            valueGetter: (params) =>
                params.row.stateOnEntry
                    ? alarmsStateMap[params.row.stateOnEntry]
                    : "-",
        },
        {
            field: "stateOnLeave",
            headerName: strings.adminstration.monitorization.list.stateLeave,
            flex: 1,
            valueGetter: (params) =>
                params.row.stateOnLeave
                    ? alarmsStateMap[params.row.stateOnLeave]
                    : "-",
        },
        {
            field: "action",
            headerName: strings.adminstration.users.list.details,
            sortable: false,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    handleUserDetailsOpen(params.row); // open the user details dialog
                };

                return (
                    <IconButton
                        onClick={onClick}
                        color="primary"
                        aria-label="see user details"
                        component="label">
                        <ReadMoreIcon />
                    </IconButton>
                );
            },
        },
    ];

    const [pageState, setPageState] = useState({
        isLoading: false,
        data: [],
        total: 0,
        page: 0,
        pageSize: 10,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setPageState((old) => ({ ...old, isLoading: true }));

                const response = await MonitorizationService.logs(
                    auth.user,
                    pageState.page,
                    pageState.pageSize
                );
                const total = response.data.maxRegisters;
                const registry = await response.data.registers;

                setPageState((old) => ({
                    ...old,
                    isLoading: false,
                    data: registry,
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
    }, [pageState.page, pageState.pageSize]);

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
        <div className="monitorization-container">
            <h1 className="content-title">
                {strings.adminstration.monitorization.title}
            </h1>
            <div className="monitorization-data-table-container">
                <DataGrid
                    autoHeight
                    rows={pageState.data}
                    rowCount={pageState.total}
                    loading={pageState.isLoading}
                    rowsPerPageOptions={[5, 10, 30]}
                    pagination
                    page={pageState.page}
                    pageSize={pageState.pageSize}
                    paginationMode="server"
                    onPageChange={(newPage) => {
                        setPageState((old) => ({ ...old, page: newPage }));
                    }}
                    onPageSizeChange={(newPageSize) =>
                        setPageState((old) => ({
                            ...old,
                            pageSize: newPageSize,
                        }))
                    }
                    columns={columns}
                    getRowId={(row) => row.uuid}
                />
            </div>
            <Dialog
                open={logDetailsDialogState.open}
                onClose={handleUserDetailsClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <MonitorizationDetail log={logDetailsDialogState.log} />
            </Dialog>
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
