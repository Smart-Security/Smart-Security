import React, { useState, useEffect } from 'react';
import './login_form.component.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import strings from '../../../../constants/strings';


export default function LoginForm(props) {
    
    // form fields variables
    const [ email, setEmail] = useState("")
    const [ password, setPassword] = useState("")

    // builds the base strucure to the 
    const validationReturn = (result, message) => {
        return { result: result, message: message }
    }

    // state variables to control if the fields are valid or not
    const [ passwordValidationResult, setPasswordValidationResult] = useState(validationReturn(false, ""))
    const [ emailValidationResult, setEmailValidationResult] = useState(validationReturn(false, ""))
    
    useEffect(() => {
        /**
         * Validates the email fields has a valid input.
         */
        const isEmailValid = () => {

            const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

            if (email.length === 0 || !emailPattern.test(email))
                return validationReturn(false, strings.login.invalidEmail)

            return validationReturn(true, "");
        }

        // update the email error state
        setEmailValidationResult(isEmailValid())
    }, [email])
    
    useEffect(() => {
        const isPasswordsValid = () => {
            const passwordValid = password.length > 0;
            return  validationReturn(passwordValid, passwordValid ? "" : strings.login.invalidPassword);
        }

        // update the email error state
        setPasswordValidationResult(isPasswordsValid());
    }, [password])

    const onFormSubmit = (event) => {
        event.preventDefault(); // prevent for default redirection
        props.onFormSubmit(email, password)
    }

    const isFormNotValid = !emailValidationResult.result || !passwordValidationResult.result

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { width: '40ch' },
            }}
            autoComplete="off"
            onSubmit={onFormSubmit}>
                <div className="login-form-container">
                    <TextField
                        required
                        label="Email address"
                        inputProps={{ inputMode: 'email' }}
                        onChange={(newValue) => setEmail(newValue.target.value)}
                        error={!emailValidationResult.result}
                        helperText={emailValidationResult.message}
                        autoComplete="username"
                    />
                    <TextField
                        required
                        label="Password"
                        type="password"
                        onChange={(newValue) => setPassword(newValue.target.value)}
                        autoComplete="current-password"
                        error={!passwordValidationResult.result}
                        helperText={passwordValidationResult.message}
                    />

                    <Button disabled={isFormNotValid} type="submit" className="sign-in-btn" variant="contained" onClick={() => props.onFormSubmit(email, password)}>{ strings.login.signin }</Button>
                </div>
        </Box>);
}