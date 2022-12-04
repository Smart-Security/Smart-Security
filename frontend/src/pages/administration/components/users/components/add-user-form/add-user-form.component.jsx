/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../../../hooks/use-auth.hook";
import UserManagementService from "../../../../../../services/users.management.service";
import strings from "../../../../../../constants/strings";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import moment from "moment";
import MultipleSelectChip from "./components/divisions-multi-select";
import { KNOWHTTPSTATUS } from "./../../../../../../services/api.service";
import AddUser from "./../../../../../../models/add-user.model";
import EditUser from "./../../../../../../models/edit-user.model";
import { KNOWN_APP_ERRORS } from "./../../../../../../models/known-app-errors";
import { Skeleton } from "@mui/material";
import "./add-user-form.component.css";
import { useNavigate } from "react-router-dom";
import DialogTitle from "@mui/material/DialogTitle";

export const UserFormMode = {
    EDIT_MODE: 1,
    ADD_MODE: 2,
};

export default function AddUserForm(props) {
    const auth = useAuth();
    const navigate = useNavigate();

    const mode = props.mode;
    const userToEdit = props.user;
    const onSubmitCallback = props.onSubmit;
    const onError = props.onError;

    const [building, setBuilding] = useState(null);
    const [name, setName] = useState("");
    const [birthdate, setBirthDate] = useState(moment());
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [divisionsSelected, setDivisionsSelected] = useState([]);

    // builds the base strucure to the
    const validationReturn = (result, message) => {
        return { result: result, message: message };
    };

    // state variables to control if the fields are valid or not
    const [passwordValidationResult, setPasswordValidationResult] = useState(
        validationReturn(false, "")
    );
    const [emailValidationResult, setEmailValidationResult] = useState(
        validationReturn(false, "")
    );
    const [nameValidationResult, setNameValidationResult] = useState(
        validationReturn(false, "")
    );
    const [divisionsValidationResult, setDivisionsValidationResult] = useState(
        validationReturn(false, "")
    );

    // when component loads for the first time, load the building
    useEffect(() => {
        /**
         * Request the api to provide the information of the build floor composition.
         */
        const loadBuilding = async () => {
            try {
                const response = await UserManagementService.getBuilding(
                    auth.user
                );
                setBuilding(response.data);
            } catch (e) {
                // todo show message
                console.error(e);
            }
        };

        // load building configurations
        loadBuilding();

        // if the user form was opened in edit mode then
        // should fill the form intputs
        if (mode === UserFormMode.EDIT_MODE) {
            fillInputsOnEdit(userToEdit);
        }
    }, []);

    /**
     * Fill the inputs with user data
     */
    const fillInputsOnEdit = (user) => {
        const divisionsUuids = user.divisions.filter(
            (division) => division.type !== "COMMON_AREA"
        );

        setEmail(user.email);
        setName(user.name);
        setBirthDate(moment(user?.birthDate).format("DD/MM/YYYY"));
        setDivisionsSelected(divisionsUuids);
    };

    /**
     * when email changes validate the email and update the email error state
     */
    useEffect(() => {
        /**
         * Validates the email fields has a valid input.
         */
        const isEmailValid = () => {
            const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

            if (email.length === 0 || !emailPattern.test(email))
                return validationReturn(false, strings.login.invalidEmail);

            return validationReturn(true, "");
        };

        // update the email error state
        setEmailValidationResult(isEmailValid());
    }, [email]);

    /**
     * Change the birthDate to the selected birthdate on the DesktopDatePicker
     * @param {*} newValue
     */
    const handleBirthDateChange = (newValue) => {
        setBirthDate(newValue);
    };

    /**
     * Validate password on:
     *  - Must have one lower case letter
     *  - Must have one upper case letter
     *  - Must have one special characters
     * @returns
     */
    const passwordFormatValidation = () => {
        const passwordHasWhiteSpaces = password.includes(" ");
        const lowerCasesValidation = /.*[a-z].*/;
        const upperCasesValidation = /.*[A-Z].*/;
        const digitsValidation = /.*\d.*/;
        const specialCasesValidation = /.*[@$!%*?&].*/;
        const lengthValidation = /[A-Za-z\d@$!%*?&]{6,15}/;

        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/g;

        // if the password contains empty spaces
        if (passwordHasWhiteSpaces)
            return strings.adminstration.users.form
                .invalidPasswordHasWhiteSpaces;

        // if the password does not match the predifined pattern
        if (!passwordPattern.test(password)) {
            // lower cases
            if (!lowerCasesValidation.test(password))
                return strings.adminstration.users.form
                    .invalidPasswordMustHaveLowercase;

            // upper cases
            if (!upperCasesValidation.test(password))
                return strings.adminstration.users.form
                    .invalidPasswordMustHaveUppercase;

            // digits validations
            if (!digitsValidation.test(password))
                return strings.adminstration.users.form
                    .invalidPasswordMustHaveDigits;

            // special characters validations
            if (!specialCasesValidation.test(password))
                return strings.adminstration.users.form
                    .invalidPasswordMustHaveSpecialCharacter;

            // validations
            if (!lengthValidation.test(password))
                return strings.adminstration.users.form.invalidPasswordSize;

            return strings.adminstration.users.form.invalidPassword;
        }

        return null;
    };

    /**
     * when password changes validate it and update the password error state
     */
    useEffect(() => {
        // Validate if the passsword is not empty
        const isPasswordsValid = () => {
            const passwordIsEmpty = password.length === 0;

            switch (mode) {
                case UserFormMode.ADD_MODE: {
                    // if the password is empty,
                    if (passwordIsEmpty)
                        return validationReturn(
                            false,
                            strings.adminstration.users.form.invalidPassword
                        );

                    // if password is valid
                    const validationResult = passwordFormatValidation();
                    if (validationResult != null)
                        return validationReturn(false, validationResult);

                    return validationReturn(true, "");
                }
                case UserFormMode.EDIT_MODE: {
                    // if user wants to reedit the password
                    if (!passwordIsEmpty) {
                        // validate pattern
                        const validationResult = passwordFormatValidation();
                        if (validationResult !== null)
                            return validationReturn(false, validationResult);
                    }

                    return validationReturn(true, "");
                }
                default: {
                    return validationReturn(true, "");
                }
            }
        };

        // update the email error state
        setPasswordValidationResult(isPasswordsValid());
    }, [password]);

    /**
     * when name changes validate it and update the name error state
     */
    useEffect(() => {
        // Validate if the name is not empty
        const isNameValid = () => {
            const nameValid = name.length > 0;
            return validationReturn(
                nameValid,
                nameValid ? "" : strings.adminstration.users.insertName
            );
        };

        setNameValidationResult(isNameValid());
    }, [name]);

    /**
     * when selected divisions changes validate them and update the divisions selected error state
     */
    useEffect(() => {
        const isDivisionsEmpty = () => {
            const divisionsIsNotEmpty = divisionsSelected.length > 0;
            return validationReturn(
                divisionsIsNotEmpty,
                divisionsIsNotEmpty
                    ? ""
                    : strings.adminstration.users.selectDivisions
            );
        };

        setDivisionsValidationResult(isDivisionsEmpty());
    }, [divisionsSelected]);

    // Check if edit or add form is valid (name, divisions, password and email completed)
    const isFormNotValid = () => {
        return (
            !nameValidationResult.result ||
            !emailValidationResult.result ||
            !passwordValidationResult.result ||
            !divisionsValidationResult.result
        );
    };

    /**
     * When login form is submited and the fields are valid.
     */
    const onFormSubmit = async (event) => {
        event.preventDefault(); // prevent for default redirection

        try {
            switch (mode) {
                case UserFormMode.EDIT_MODE: {
                    // Edits the user using the email, name, birthdate and the divisions selected uuids
                    const editUser = new EditUser(
                        email,
                        name,
                        moment(birthdate).format("YYYY-MM-DD"),
                        password,
                        //Get the selected divisions uuid's
                        divisionsSelected.map((division) => division.uuid)
                    );

                    await UserManagementService.editUser(
                        auth.user,
                        editUser,
                        userToEdit.uuid
                    );

                    onSubmitCallback(editUser.user);

                    break;
                }
                case UserFormMode.ADD_MODE: {
                    // Create the user using the email, name, birthdate, password and the divisions selected uuids
                    const addUser = new AddUser(
                        email,
                        name,
                        moment(birthdate).format("YYYY-MM-DD"),
                        password,
                        //Get the selected divisions uuid's
                        divisionsSelected.map((division) => division.uuid)
                    );

                    await UserManagementService.addUser(auth.user, addUser);

                    onSubmitCallback(addUser.user);

                    break;
                }
                default: {
                    break;
                }
            }
        } catch (e) {
            // if status code is unauthorized the user credentials are wrong
            switch (e?.response?.status) {
                case KNOWHTTPSTATUS.unauthorized: {
                    auth.logout();
                    navigate("/"); // redirect to login
                    break;
                }
                case KNOWHTTPSTATUS.unprocessableEntity: {
                    // email already in use error
                    if (
                        e.response?.data.errorCode ===
                        KNOWN_APP_ERRORS.emailUsed
                    )
                        onError(
                            strings.adminstration.users.form.emailAlreadyInUse
                        );
                    break;
                }
                default: {
                    onError(e.message);
                }
            }
        }
    };

    return (
        <React.Fragment>
            <DialogTitle id="alert-dialog-title">
                {mode === UserFormMode.EDIT_MODE
                    ? `${strings.adminstration.users.form.title.edit} ${userToEdit.name}`
                    : strings.adminstration.users.form.title.add}
            </DialogTitle>
            <Box
                component="form"
                autoComplete="off"
                onSubmit={onFormSubmit}
                className="form-user-container">
                <div className="user-form-container">
                    <TextField
                        required
                        label={strings.adminstration.users.form.labels.name}
                        value={name}
                        onChange={(newValue) => setName(newValue.target.value)}
                        error={!nameValidationResult.result}
                        helperText={nameValidationResult.message}
                    />
                    <TextField
                        required={mode === UserFormMode.ADD_MODE}
                        label={strings.adminstration.users.form.labels.password}
                        type="password"
                        onChange={(newValue) =>
                            setPassword(newValue.target.value)
                        }
                        error={!passwordValidationResult.result}
                        helperText={passwordValidationResult.message}
                        autoComplete="current-password"
                    />
                </div>

                <TextField
                    required
                    label={strings.adminstration.users.form.labels.email}
                    inputProps={{ inputMode: "email" }}
                    value={email}
                    disabled={mode === UserFormMode.EDIT_MODE}
                    onChange={(newValue) => setEmail(newValue.target.value)}
                    error={!emailValidationResult.result}
                    helperText={emailValidationResult.message}
                    autoComplete="username"
                />

                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DesktopDatePicker
                        label={
                            strings.adminstration.users.form.labels.birthDate
                        }
                        inputFormat="DD/MM/YYYY"
                        value={birthdate}
                        onChange={handleBirthDateChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>

                {building ? (
                    <MultipleSelectChip
                        divisions={building.floorDtos}
                        selectedDivisions={divisionsSelected}
                        error={!divisionsValidationResult.result}
                        helperText={divisionsValidationResult.message}
                        onSelectedDivisions={(selectedDivisions) =>
                            setDivisionsSelected(selectedDivisions)
                        }
                    />
                ) : (
                    <Skeleton variant="rounded" height={60} />
                )}
                <Button
                    disabled={isFormNotValid()}
                    type="submit"
                    variant="contained"
                    onClick={() => onFormSubmit()}>
                    {strings.adminstration.users.submit}
                </Button>
            </Box>
        </React.Fragment>
    );
}
