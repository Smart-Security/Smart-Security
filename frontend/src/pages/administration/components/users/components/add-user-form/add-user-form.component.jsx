import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../../../hooks/use-auth.hook";
import UserManagementService from "../../../../../../services/users.management.service";
import strings from "../../../../../../constants/strings";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { FormControl, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import moment from "moment";
import MultipleSelectChip from "./multiple-selection-chip.component";

export default function AddUser(props) {
  const auth = useAuth();

  const [building, setBuilding] = useState(null);
  const [value, setValue] = useState(moment());

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // when component loads for the first time, load
  useEffect(() => {
    /**
     * Request the api to provide the information of the build floor composition.
     */
    const loadBuilding = async () => {
      try {
        const response = await UserManagementService.getBuilding(auth.user);
        setBuilding(response.data);
      } catch (e) {
        // if (props.onError) props.onError(e)
        // todo show message
        console.error(e);
      }
    };
    loadBuilding();
  }, []);

  const handleBirthDateChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <TextField required label={strings.adminstration.users.name} />
      <TextField required label={strings.adminstration.users.age} />
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DesktopDatePicker
          label={strings.adminstration.users.birthdate}
          inputFormat="MM/DD/YYYY"
          value={value}
          onChange={handleBirthDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <TextField
        required
        label={strings.login.email}
        inputProps={{ inputMode: "email" }}
        onChange={(newValue) => setEmail(newValue.target.value)}
      />
      <TextField
        required
        label={strings.login.password}
        type="password"
        onChange={(newValue) => setPassword(newValue.target.value)}
      />
      <MultipleSelectChip />
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
      <AddUser />
    </Dialog>
  );
}
