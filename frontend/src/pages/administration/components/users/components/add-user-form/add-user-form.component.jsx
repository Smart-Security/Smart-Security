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
import EditUser from "./../../../../../../models/edit-user.model";
import { Skeleton } from "@mui/material";

export default function AddUserForm(props) {
  const auth = useAuth();
  const editMode = "edit";

  const [building, setBuilding] = useState(null);
  const [name, setName] = useState("");
  const [birthdate, setBirthDate] = useState(moment());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [divisionsSelected, setDivisionsSelected] = useState([]);

  //props.mode = "edit";
  const modeTest = true;
  const user = {
    uuid: "a2e6b048-3cc0-4ae1-b287-0b7ed2d38f26",
    email: "hugo@gmail.com",
    name: "Hugo Jorge",
    birthDate: "2020-04-19T23:00:00.000+00:00",
    active: true,
    divisions: [
      {
        uuid: "292bc745-ec85-42ff-b927-d263172f58b1",
        type: "COMMON_AREA",
        name: "Corredor",
        on: true,
      },
      {
        uuid: "f1ff6349-57bf-4628-bc31-c70fbd2d475f",
        type: "COMMON_AREA",
        name: "LAS",
        on: true,
      },
      {
        uuid: "6fa77c66-f876-4959-8665-5407ba3fafaa",
        type: "OFFICE",
        name: "LIS",
        on: true,
      },
      {
        uuid: "d7780df3-1d0e-4182-9e6e-183655e48175",
        type: "COMMON_AREA",
        name: "Entrada",
        on: true,
      },
    ],
    role: "ROLE_USER",
  };

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
        const response = await UserManagementService.getBuilding(auth.user);
        setBuilding(response.data);
      } catch (e) {
        // todo show message
        console.error(e);
      }
    };

    // load building configurations
    loadBuilding();

    // if the form is on
    if (/* props.mode === editMode */ modeTest)
      fillInputsOnEdit(/* props.user */ user);
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
    setBirthDate(user.birthDate);
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
        passwordValid,
        passwordValid ? "" : strings.login.invalidPassword
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
        divisionsIsNotEmpty ? "" : strings.adminstration.users.selectDivisions
      );
    };

    setDivisionsValidationResult(isDivisionsEmpty());
  }, [divisionsSelected]);

  // Check if edit or add form is valid (name, divisions, password and email completed)
  const isFormNotValid = () => {
    if (/* props?.mode === editMode */ modeTest) {
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
      if (/* props?.mode === editMode */ modeTest) {
        // Edits the user using the email, name, birthdate and the divisions selected uuids
        const user = new EditUser(
          email,
          name,
          birthdate,
          //Get the selected divisions uuid's
          divisionsSelected.map((division) => division.uuid)
        );

        const response = await UserManagementService.editUser(
          auth.user,
          user,
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

        const response = await UserManagementService.addUser(auth.user, user);
      }
    } catch (e) {
      // if status code is unauthorized the user credentials are wrong
      if (e?.response?.status === KNOWHTTPSTATUS.unauthorized)
        e.message = strings.login.invalidCredentials;

      console.log(e);
    }
  };

  return (
    <Box>
      <TextField
        required
        label={strings.adminstration.users.name}
        value={name}
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
        value={email}
        disabled={/* props?.mode === editMode */ modeTest}
        onChange={(newValue) => setEmail(newValue.target.value)}
        error={!emailValidationResult.result}
        helperText={emailValidationResult.message}
      />
      {
        /* props?.mode === editMode */ modeTest ? (
          <React.Fragment></React.Fragment>
        ) : (
          <TextField
            required
            label={strings.login.password}
            type="password"
            onChange={(newValue) => setPassword(newValue.target.value)}
            error={!passwordValidationResult.result}
            helperText={passwordValidationResult.message}
          />
        )
      }

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
        <Skeleton variant="rounded" height={60} sx={{ m: 1, width: 300 }} />
      )}
      <Button
        disabled={isFormNotValid()}
        type="submit"
        className="sign-in-btn"
        variant="contained"
        onClick={() => onFormSubmit()}
      >
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
      <AddUserForm />
    </Dialog>
  );
}
