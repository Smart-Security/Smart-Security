/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./login.page.css";
import LoginForm from "./components/login_form/login_form.component";
import Snackbar from "@mui/material/Snackbar";
import Alert from "./../../components/alert.component";
import { useAuth } from "./../../hooks/use-auth.hook";
import UserService from "./../../services/user.service";
import snackbarService from "./../../services/snackbar.service";
import IconButton from "@mui/material/IconButton";
import { useLocation, useNavigate } from "react-router-dom";
import { ROLETYPE } from "./../../models/role-type.model";
import Authentication from "./../../models/authentication.model";
import strings from "../../constants/strings";
import { KNOWHTTPSTATUS } from "./../../services/api.service";
import StringService from "../../services/strings.service";
import { Typography } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";

export default function LoginPage(props) {
    const [snackbar, setSnackbar] = useState(
        snackbarService._getInitialState()
    );
    const auth = useAuth();
    const navigate = useNavigate();
    const { state } = useLocation();

    /**
     * Redirect to another page according to the user role
     * @param {ROLETYPE} user role
     */
    const redirectByRole = (role) => {
        switch (role) {
            case ROLETYPE.ADMIN:
                navigate("/administration");
                break;
            case ROLETYPE.EMPLOYEE:
                navigate("/goto");
                break;
            default:
                navigate("/");
                break;
        }
    };

    useEffect(() => {
        if (!state) return;
        const { name, room } = state;
        snackbarService.showSuccess(
            StringService.format(strings.gotoSuccess, name, room),
            setSnackbar
        );
    }, []);

    // if the user is authenticated, then redirect him to his page
    useEffect(() => {
        if (auth.isLogged()) redirectByRole(auth.user.role);
    }, [auth]);

    /**
     * When login form is submited and the fields are valid.
     */
    const onFormSubmit = async (email, password) => {
        try {
            const response = await UserService.login(
                new Authentication(email, password)
            );
            await auth.login(response.data);
            // redirectByRole(auth.user.role);
        } catch (e) {
            // if status code is unauthorized the user credentials are wrong
            if (e?.response?.status === KNOWHTTPSTATUS.unauthorized)
                e.message = strings.login.invalidCredentials;

            // show snackbar with error message
            snackbarService.showError(e.message, setSnackbar);
        }
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
        <div className="login">
            <div className="login-container">
                <div className="logo-container">
                    <SecurityIcon color="primary" sx={{ fontSize: 100 }} />
                    <Typography
                        variant="h5"
                        color="primary"
                        sx={{ fontWeight: "medium" }}>
                        {strings.companyName}
                    </Typography>
                </div>
                <h2 className="form-title">{strings.login.title}</h2>
                <LoginForm
                    onFormSubmit={(email, password) =>
                        onFormSubmit(email, password)
                    }
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
