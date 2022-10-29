/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./administration.page.css";
import { useAuth } from "./../../hooks/use-auth.hook";
import { ROLETYPE } from "./../../models/role-type.model";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import strings from "../../constants/strings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SideMenu from "./components/side-menu/side-menu.component";
import Users from "./components/users/users.component";
import Monitorization from "./components/monitorization/monitorization.component";
import Alarms from "./components/alarms/alarms.component";
import Toolbar from "@mui/material/Toolbar";
import TopBar from "./components/top-bar/top-bar.component";
import Snackbar from "@mui/material/Snackbar";
import Alert from "./../../components/alert.component";
import snackbarService from "./../../services/snackbar.service";
import IconButton from "@mui/material/IconButton";

export default function AdministrationPage() {
    // keys to identify the selected view
    let contentKeys = {
        usersView: 0,
        alarmsView: 1,
        monitorizationView: 2,
    };

    const auth = useAuth();
    const navigate = useNavigate();

    // state variable to control the content view to show
    const [selectedView, setSelectedView] = useState(contentKeys.usersView);
    const [snackbar, setSnackbar] = useState(
        snackbarService._getInitialState()
    );

    useEffect(() => {
        // check if if the user has the required permissions, or if is authenticated
        if (auth.user.role !== ROLETYPE.ADMIN) navigate("/");
    }, []);

    const sideMenuItems = [
        {
            key: contentKeys.usersView,
            name: strings.adminstration.users.title,
            icon: <ManageAccountsIcon />,
        },
        {
            key: contentKeys.alarmsView,
            name: strings.adminstration.alarms.title,
            icon: <NotificationsActiveIcon />,
        },
        {
            key: contentKeys.monitorizationView,
            name: strings.adminstration.monitorization.title,
            icon: <AnalyticsIcon />,
        },
    ];

    const handleError = (err) => {
        snackbarService.showError(err.message, setSnackbar);
    };

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

    // content view
    const contentViews = {};
    contentViews[contentKeys.usersView] = <Users />;
    contentViews[contentKeys.alarmsView] = <Alarms />;
    contentViews[contentKeys.monitorizationView] = <Monitorization />;

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
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <TopBar />
            <SideMenu
                menuItems={sideMenuItems}
                onMenuSelection={setSelectedView}
                currentSelected={selectedView}
                onError={handleError}
            />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {contentViews[selectedView]}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    action={action}>
                    <Alert onClose={handleClose} severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}
