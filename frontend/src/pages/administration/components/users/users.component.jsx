/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import strings from "./../../../../constants/strings";
import "./users.component.css";
import { DataGrid } from "@mui/x-data-grid";
import Fab from "@mui/material/Fab";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTheme } from "@mui/material/styles";
import Zoom from "@mui/material/Zoom";
import UserManagementService from "./../../../../services/users.management.service.js";
import { useAuth } from "./../../../../hooks/use-auth.hook";
import { ROLETYPE } from "../../../../models/role-type.model";
import { DIVISION_TYPE } from "./../../../../models/divisions-type.model";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import UserDetail from "./components/user-detail/user-detail.component";
import { UserFormMode } from "./components/add-user-form/add-user-form.component";
import Snackbar from "@mui/material/Snackbar";
import snackbarService from "./../../../../services/snackbar.service";
import Alert from "./../../../../components/alert.component";
import { useNavigate } from "react-router-dom";
import { KNOWHTTPSTATUS } from "./../../../../services/api.service";
import UserActionsMenu from "./components/user-actions-menu/user-actions-menu.component";
import UserDeleteConfirmation from "./components/user-delete-confirmation/user-delete-confirmation.component";
import StringService from "../../../../services/strings.service";
import UserForm from "./components/add-user-form/add-user-form.component";

export default function Users(props) {
    // state to manage snackbar state
    const [snackbar, setSnackbar] = useState(
        snackbarService._getInitialState()
    );

    /**
     * State to control the user details dialog
     */
    const [userDetailsDialogState, setUserDetailsDialogState] = useState({
        open: false,
        user: null,
    });

    /**
     * State to control the user delete dialog
     */
    const [userDeleteDialogState, setUserDeleteDialogState] = useState({
        open: false,
        user: null,
    });

    /**
     * Load the users data.
     */
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
     * Shows a configuration dialog for user deletion
     * @param {*} user user to be deleted
     */
    const handleUserDeleteDialogOpen = (user) => {
        setUserDeleteDialogState({
            open: true,
            user: user,
        });
    };

    /**
     * On user details dialog close
     */
    const handleDeleteClose = () => {
        setUserDeleteDialogState({
            ...userDeleteDialogState,
            open: false,
        });
    };

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

    /**
     *
     * @param {*} user
     */
    const onUserDelete = async (user) => {
        try {
            await UserManagementService.deleteUser(auth.user, user.uuid);
            snackbarService.showSuccess(
                StringService.format(
                    strings.adminstration.users.actions.deleteSuccess,
                    user.name
                ),
                setSnackbar
            );
            handleDeleteClose(); // close user deletion confirmation dialog
            fetchData();
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
                const onDetails = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    handleUserDetailsOpen(params.row); // open the user details dialog
                };

                const onDelete = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    handleUserDeleteDialogOpen(params.row); // open the user details dialog
                };

                const onEdit = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    handleUserFormOpen(UserFormMode.EDIT_MODE, params.row); // open the user details dialog
                };

                const isSecurityGuard = params.row.role === ROLETYPE.ADMIN;

                return (
                    <UserActionsMenu
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDetails={onDetails}
                        disableEdit={isSecurityGuard}
                        disableDelete={isSecurityGuard}
                    />
                );
            },
        },
    ];

    const auth = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const [pageState, setPageState] = useState({
        isLoading: false,
        data: [],
        total: 0,
        page: 0,
        pageSize: 10,
    });

    useEffect(() => {
        fetchData();
    }, [pageState.page, pageState.pageSize]);

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const [userFormDialog, setUserFormDialog] = React.useState({
        open: false,
        mode: UserFormMode.ADD_MODE,
        user: null,
    });

    const handleUserFormOpen = (mode, user) => {
        setUserFormDialog({ open: true, mode: mode, user: user });
    };

    const handleUserFormClose = () => {
        setUserFormDialog({ ...userFormDialog, open: false });
    };

    const handleUserFormSubmit = (user) => {
        setUserFormDialog({ ...userFormDialog, open: false });

        console.log(user);

        snackbarService.showSuccess(
            userFormDialog.mode === UserFormMode.ADD_MODE
                ? StringService.format(
                      strings.adminstration.users.form.result.addSuccess,
                      user.name
                  )
                : StringService.format(
                      strings.adminstration.users.form.result.editSuccess,
                      user.name
                  ),
            setSnackbar
        );
        fetchData();
    };

    const handleUserFormError = (errorMessage) => {
        snackbarService.showError(errorMessage, setSnackbar);
    };

    /**
     * Event on snackbar close event
     * @param {*} event
     * @param {*} reason
     * @returns void
     */
    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;

        snackbarService.hide(snackbar, setSnackbar);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackbarClose}></IconButton>
        </React.Fragment>
    );

    return (
        <div className="users-container">
            <h1 className="content-title">
                {strings.adminstration.users.title}
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
                    className="add-fab-button"
                    style={{ color: theme.palette.text.primary }}
                    onClick={() => handleUserFormOpen(UserFormMode.ADD_MODE)}>
                    <PersonAddIcon
                        sx={{ mr: 1 }}
                        style={{ color: theme.palette.text.primary }}
                    />
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
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                action={action}>
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <Dialog
                open={userDeleteDialogState.open}
                onClose={handleUserDetailsClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <UserDeleteConfirmation
                    user={userDeleteDialogState.user}
                    onDelete={() => onUserDelete(userDeleteDialogState.user)}
                    onCancel={handleDeleteClose}
                />
            </Dialog>
            <Dialog
                open={userFormDialog.open}
                onClose={handleUserFormClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <UserForm
                    mode={userFormDialog.mode}
                    user={userFormDialog.user}
                    onSubmit={(user) => handleUserFormSubmit(user)}
                    onError={(errorMessage) =>
                        handleUserFormError(errorMessage)
                    }
                />
            </Dialog>
        </div>
    );
}
