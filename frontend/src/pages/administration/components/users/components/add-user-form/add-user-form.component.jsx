import React from "react";
import strings from "../../../../../../constants/strings";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

export default function AddUser(user) {
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
