/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import strings from "./../../../../constants/strings";
import "./users.component.css";
import { DataGrid } from "@mui/x-data-grid";
import Fab from "@mui/material/Fab";
import NavigationIcon from "@mui/icons-material/Navigation";
import { useTheme } from "@mui/material/styles";
import Zoom from "@mui/material/Zoom";
import UserManagementService from "./../../../../services/users.management.service.js";
import { useAuth } from "./../../../../hooks/use-auth.hook";
import { ROLETYPE } from "../../../../models/role-type.model";
import { DIVISION_TYPE } from "./../../../../models/divisions-type.model";
import IconButton from "@mui/material/IconButton";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import Dialog from "@mui/material/Dialog";
import UserDetail from "./components/user-detail/user-detail.component";

export default function Users(props) {
    /**
     * State to control the user details dialog
     */
    const [userDetailsDialogState, setUserDetailsDialogState] = useState({
        open: false,
        user: null,
    });

    /**
     * On user details dialog
     * @param {*} user
     */
    const handleUserDetailsOpen = (user) => {
        setUserDetailsDialogState({
            open: true,
            user: user,
        });
    };

    /**
     * On user details dialog close
     */
    const handleUserDetailsClose = () => {
        setUserDetailsDialogState({
            ...userDetailsDialogState,
            open: false,
        });
    };

    // Datagrid columns configuration
    const columns = [
        {
            field: "name",
            headerName: strings.adminstration.users.list.name,
            flex: 1,
        },
        {
            field: "email",
            headerName: strings.adminstration.users.list.email,
            flex: 1,
        },
        {
            field: "role",
            headerName: strings.adminstration.users.list.role,
            flex: 1,
            valueGetter: (params) =>
                params.row.role === ROLETYPE.ADMIN
                    ? strings.roles.admin
                    : strings.roles.user,
        },
        {
            field: "divisions",
            headerName: strings.adminstration.users.list.access,
            flex: 1,
            valueGetter: (params) =>
                params.row.divisions
                    .filter(
                        (division) =>
                            division.type !== DIVISION_TYPE.common_area
                    )
                    .map((division) => {
                        return division.name;
                    })
                    .join(", "),
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

    const auth = useAuth();
    const theme = useTheme();

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

                const response = await UserManagementService.listUsers(
                    auth.user,
                    pageState.page,
                    pageState.pageSize
                );
                const total = response.data.maxUsers;
                const users = await response.data.users;

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

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    return (
        <div className="users-container">
            <h1 className="content-title">
                {strings.adminstration.users.title}
            </h1>
            <div className="users-data-table-container">
                <DataGrid
                    autoHeight
                    checkboxSelection
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
                    isRowSelectable={(params) =>
                        params.row.role !== ROLETYPE.ADMIN
                    }
                />
            </div>
            <Zoom
                in={true}
                timeout={transitionDuration}
                style={{
                    transitionDelay: `${transitionDuration.exit}ms`,
                }}
                unmountOnExit>
                <Fab
                    color="primary"
                    variant="extended"
                    className="add-fab-button">
                    <NavigationIcon sx={{ mr: 1 }} />
                    {strings.adminstration.users.add}
                </Fab>
            </Zoom>
            <Dialog
                open={userDetailsDialogState.open}
                onClose={handleUserDetailsClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <UserDetail user={userDetailsDialogState.user} />
            </Dialog>
        </div>
    );
}
