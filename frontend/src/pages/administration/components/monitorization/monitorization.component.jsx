/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import strings from "./../../../../constants/strings";
import { useAuth } from "./../../../../hooks/use-auth.hook";
import MonitorizationService from "./../../../../services/monitorization.service";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import "./monitorization.component.css";
import { ALARM_STATES } from "./../../../../models/alarm-state.model";

export default function Monitorization(props) {
    const auth = useAuth();

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
    ];

    const [pageState, setPageState] = useState({
        isLoading: false,
        data: [],
        total: 0,
        page: 0,
        pageSize: 5,
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
                const users = await response.data.registers;

                setPageState((old) => ({
                    ...old,
                    isLoading: false,
                    data: users,
                    total: total,
                }));
            } catch (err) {
                // TODO tratar excecoes
            }
        };

        fetchData();
    }, [pageState.page, pageState.pageSize]);

    return (
        <div className="users-container">
            <h1 className="content-title">
                {strings.adminstration.monitorization.title}
            </h1>
            <div className="users-data-table-container">
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
        </div>
    );
}
