import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../../../hooks/use-auth.hook";
import UserManagementService from "../../../../../../services/users.management.service";
import strings from "../../../../../../constants/strings";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

export default function AddUser(props) {
  const auth = useAuth();
  const [building, setBuilding] = useState(null);

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
  return <h1>Ola mundo</h1>;
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
