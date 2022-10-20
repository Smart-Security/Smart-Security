import React, { useState } from 'react';
import './login_form.component.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

export default function LoginForm(props) {
    
    const [ email, setEmail] = useState("")
    const [ password, setPassword] = useState("")

    // TODO: form validation

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
                    onChange={(newValue) => setEmail(newValue.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    onChange={(newValue) => setPassword(newValue.target.value)}
                />
                <Button className="sign-in-btn" variant="contained" onClick={() => props.onFormSubmit(email, password)}>Sign In</Button>
            </div>
        </Box>);
}