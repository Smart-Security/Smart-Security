
import React from 'react'
import './login_form.component.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import UserService from '../../../../services/user.service';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

export default class LoginForm extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            snackbar: {
                visible: false,
                severity: '',
                message: ''
            }
        }

        // 
        this.email = ""
        this.password = ""
    }

    onEmailChange = (event) => {
        this.email = event.target.value    
    }

    onPasswordChange = (event) => {
        this.password = event.target.value    
    }

    onSubmit = async () => {
        console.log(this.email, this.password);

        try {
            const userService = new UserService();
            const response = await userService.login(this.email, this.password);
            
        } catch (e) {
            this.setState({
                snackbar: {
                    severity: 'error',
                    visible: true,
                    message: e.message,
                }
            })
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        this.setState({
            snackbar: {
                visible: false,
                messgae: ""
            },
            
        })
    };

    render() {

        const action = (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={this.handleClose}>
                    UNDO
                </Button>
                <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={this.handleClose}>
                    {/* <CloseIcon fontSize="small" /> */}
                </IconButton>
            </React.Fragment>
          );

        return (
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { width: '35ch' },
                }}
                autoComplete="off">
                <div className="login-form-container">
                    <TextField
                        required
                        label="Email address"
                        inputProps={{ inputMode: 'email', pattern: emailRegex }}
                        onChange={this.onEmailChange}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        onChange={this.onPasswordChange}
                    />
                    <Button className="sign-in-btn" variant="contained" onClick={() => this.onSubmit()}>Sign In</Button>
                </div>
                <Snackbar
                    severity={this.state.snackbar.severity}
                    open={this.state.snackbar.visible}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    message={this.state.snackbar.message}
                    action={action}
                />
            </Box>);
    }

}