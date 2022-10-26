import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../../../hooks/use-auth.hook";
import UserManagementService from "../../../../../../services/users.management.service";
import strings from "../../../../../../constants/strings";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Button, FormControl, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import moment from "moment";
import MultipleSelectChip from "./multiple-selection-chip.component";
import { KNOWHTTPSTATUS } from "./../../../../../../services/api.service";
import AddUser from "./../../../../../../models/add-user.model";

export default function AddUserForm(props) {
  const auth = useAuth();

  const [building, setBuilding] = useState(null);
  //const [isLoading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [birthdate, setBirthDate] = useState(moment());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [divisionsSelected, setDivisionsSelected] = useState("");

  //const [snackbar, setSnackbar] = useState(snackbarService._getInitialState());

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

  /**
   * Event on snackbar close event
   * @param {*} event
   * @param {*} reason
   * @returns void
   */
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;

    //snackbarService.hide(snackbar, setSnackbar);
  };

  // when component loads for the first time, load
  useEffect(() => {
    /**
     * Request the api to provide the information of the build floor composition.
     */
    const loadBuilding = async () => {
      try {
        const response = await UserManagementService.getBuilding(auth.user);
        setBuilding(response.data);
        //setLoading(false);
      } catch (e) {
        // if (props.onError) props.onError(e)
        // todo show message
        console.error(e);
      }
    };
    loadBuilding();
  }, []);

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

  const handleBirthDateChange = (newValue) => {
    setBirthDate(newValue);
  };

  useEffect(() => {
    const isPasswordsValid = () => {
      const passwordValid = password.length > 0;
      return validationReturn(
        passwordValid,
        passwordValid ? "" : strings.login.invalidPassword
      );
    };

    // update the email error state
    setPasswordValidationResult(isPasswordsValid());
  }, [password]);

  useEffect(() => {
    const isNameValid = () => {
      const nameValid = name.length > 0;
      return validationReturn(
        nameValid,
        nameValid ? "" : strings.adminstration.users.insertName
      );
    };

    setNameValidationResult(isNameValid());
  }, [name]);

  useEffect(() => {
    const isDivisionsEmpty = () => {
      const divisionsEmpty = divisionsSelected.length > 0;
      return validationReturn(
        divisionsEmpty,
        divisionsEmpty ? "" : strings.adminstration.users.selectedDivisions
      );
    };
    setDivisionsValidationResult(isDivisionsEmpty());
  }, [divisionsSelected]);

  const isFormNotValid =
    !emailValidationResult.result || !passwordValidationResult.result;

  /**
   * When login form is submited and the fields are valid.
   */
  const onFormSubmit = async () => {
    try {
      //Get the selected divisions uuid's
      console.log(divisionsSelected);
      const user = new AddUser(
        email,
        name,
        birthdate,
        password,
        divisionsSelected.map((division) => division.uuid)
      );
      console.log(divisionsSelected);
      const response = await UserManagementService.addUser(auth.user, user);
      console.log(response.data);
    } catch (e) {
      // if status code is unauthorized the user credentials are wrong
      if (e?.response?.status === KNOWHTTPSTATUS.unauthorized)
        e.message = strings.login.invalidCredentials;

      console.log(e);
      // show snackbar with error message
      //snackbarService.showError(e.message, setSnackbar);
    }
  };

  // if (isLoading) {
  //   // set the loading icon
  // } else {
  return (
    <Box>
      <TextField
        required
        label={strings.adminstration.users.name}
        onChange={(newValue) => setName(newValue.target.value)}
        error={!nameValidationResult.result}
        helperText={nameValidationResult.message}
      />
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DesktopDatePicker
          label={strings.adminstration.users.birthdate}
          inputFormat="MM/DD/YYYY"
          value={birthdate}
          onChange={handleBirthDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <TextField
        required
        label={strings.login.email}
        inputProps={{ inputMode: "email" }}
        onChange={(newValue) => setEmail(newValue.target.value)}
        error={!emailValidationResult.result}
        helperText={emailValidationResult.message}
      />
      <TextField
        required
        label={strings.login.password}
        type="password"
        onChange={(newValue) => setPassword(newValue.target.value)}
        error={!passwordValidationResult.result}
        helperText={passwordValidationResult.message}
      />
      {building ? (
        <MultipleSelectChip
          divisions={building.floorDtos}
          onSelectedDivisions={(selectedDivisions) =>
            setDivisionsSelected(selectedDivisions)
          }
          helperText={divisionsValidationResult.message}
        />
      ) : (
        //TODO add loading indicator
        <div></div>
      )}
      <Button
        disabled={isFormNotValid}
        type="submit"
        className="sign-in-btn"
        variant="contained"
        onClick={() => onFormSubmit()}
      >
        {strings.login.signin}
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
      <AddUserForm />
    </Dialog>
  );
}
