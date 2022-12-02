/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../../../hooks/use-auth.hook";
import UserManagementService from "../../../../../../services/users.management.service";
import strings from "../../../../../../constants/strings";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import moment from "moment";
import MultipleSelectChip from "./multiple-selection-chip.component";
import { KNOWHTTPSTATUS } from "./../../../../../../services/api.service";
import AddUser from "./../../../../../../models/add-user.model";
import EditUser from "./../../../../../../models/edit-user.model";
import { Skeleton } from "@mui/material";
import "./add-user-form.component.css";

export const UserFormMode = {
    EDIT_MODE: 1,
    ADD_MODE: 2,
};

export default function AddUserForm(props) {
    const auth = useAuth();

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
        if (props.mode === UserFormMode.EDIT_MODE) {
            fillInputsOnEdit(props.user);
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
     * when password changes validate it and update the password error state
     */
    useEffect(() => {
        // Validate if the passsword is not empty
        const isPasswordsValid = () => {
            const passwordValid = password.length > 0;
            return validationReturn(
                props.mode === UserFormMode.EDIT_MODE || passwordValid,
                props.mode === UserFormMode.EDIT_MODE || passwordValid
                    ? ""
                    : strings.login.invalidPassword
            );
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
        if (props?.mode === UserFormMode.EDIT_MODE) {
            return !nameValidationResult.result;
        }
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
    const onFormSubmit = async () => {
        try {
            if (props?.mode === UserFormMode.EDIT_MODE) {
                // Edits the user using the email, name, birthdate and the divisions selected uuids
                const user = new EditUser(
                    email,
                    name,
                    birthdate,
                    password,
                    //Get the selected divisions uuid's
                    divisionsSelected.map((division) => division.uuid)
                );

                await UserManagementService.editUser(
                    auth.user,
                    new EditUser(
                        user,
                        name,
                        birthdate,
                        password,
                        divisionsSelected
                    ),
                    props.user.uuid
                );
            } else {
                // Create the user using the email, name, birthdate, password and the divisions selected uuids
                const user = new AddUser(
                    email,
                    name,
                    birthdate,
                    password,
                    //Get the selected divisions uuid's
                    divisionsSelected.map((division) => division.uuid)
                );

                await UserManagementService.addUser(auth.user, user);
            }
        } catch (e) {
            // if status code is unauthorized the user credentials are wrong
            if (e?.response?.status === KNOWHTTPSTATUS.unauthorized)
                e.message = strings.login.invalidCredentials;

            console.log(e);
        }
    };

    return (
        <Box className="form-user-container">
            <div className="user-form-container">
                <TextField
                    required
                    label={strings.adminstration.users.name}
                    value={name}
                    onChange={(newValue) => setName(newValue.target.value)}
                    error={!nameValidationResult.result}
                    helperText={nameValidationResult.message}
                />
                <TextField
                    required={props.mode === UserFormMode.ADD_MODE}
                    label={strings.login.password}
                    type="password"
                    onChange={(newValue) => setPassword(newValue.target.value)}
                    error={!passwordValidationResult.result}
                    helperText={passwordValidationResult.message}
                    autocomplete="current-password"
                />
            </div>

            <TextField
                required
                label={strings.login.email}
                inputProps={{ inputMode: "email" }}
                value={email}
                disabled={props?.mode === UserFormMode.EDIT_MODE}
                onChange={(newValue) => setEmail(newValue.target.value)}
                error={!emailValidationResult.result}
                helperText={emailValidationResult.message}
            />

            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DesktopDatePicker
                    label={strings.adminstration.users.birthdate}
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
                <Skeleton
                    variant="rounded"
                    height={60}
                    sx={{ m: 1, width: 300 }}
                />
            )}
            <Button
                disabled={isFormNotValid()}
                type="submit"
                variant="contained"
                onClick={() => onFormSubmit()}>
                {strings.adminstration.users.submit}
            </Button>
        </Box>
    );
}

export function AddUserDialog(props) {
    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{strings.adminstration.users.adduser}</DialogTitle>
            <AddUserForm mode={props.mode} user={props.user} />
        </Dialog>
    );
}
