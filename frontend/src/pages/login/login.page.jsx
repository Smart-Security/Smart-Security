
import React, { useState, useEffect } from 'react';
import './login.page.css'
import LoginForm from './components/login_form/login_form.component'
import Snackbar from '@mui/material/Snackbar';
import Alert from './../../components/alert.component'
import { useAuth } from './../../hooks/use-auth.hook'
import UserService from './../../services/user.service';
import snackbarService from './../../services/snackbar.sercvice';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from "react-router-dom";
import { ROLETYPE } from "./../../models/user.model"

export default function LoginPage(props) {

    const [ snackbar, setSnackbar ] = useState(snackbarService._getInitialState())
    const auth = useAuth();
    const navigate = useNavigate();

    /**
     * Redirect to another page according to the user role
     * @param {ROLETYPE} role 
     */
    const redirectByRole = (role) => {
        switch (role) {
            case ROLETYPE.ADMIN:
                navigate("/administration")
                break;
            case ROLETYPE.EMPLOYEE:
                navigate("/goto")
            break;
            default:
                navigate("/")
                break;
        }
    }

    // if the user is authenticated, then redirect him to his page 
    useEffect(() => {
        if (auth.isLogged())
            redirectByRole(auth.user.role)
    })  

    /**
     * When login form is submited and the fields are valid.
     */
    const onFormSubmit = async (email, password) => {
        try {
            const response = await UserService.login(email, password);
            await auth.login(response.data)
            redirectByRole(auth.user.role);
        } catch (e) {
            // show snackbar with error message
            snackbarService.showError(e.message, setSnackbar)
        }
    }   

    /**
     * Event on snackbar close event
     * @param {*} event 
     * @param {*} reason 
     * @returns void
        */
    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;
        
        snackbarService.hide(snackbar, setSnackbar)
    };  

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}>
            </IconButton>
        </React.Fragment>
    );

    return <div className="login">
        <LoginForm onFormSubmit={(email, password) => onFormSubmit(email, password)}/>
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
}