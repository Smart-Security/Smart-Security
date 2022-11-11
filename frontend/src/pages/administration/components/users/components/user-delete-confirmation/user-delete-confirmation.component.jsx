import React from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import strings from "../../../../../../constants/strings";
import Button from "@mui/material/Button";

export default function UserDeleteConfirmation(props) {
    return (
        <React.Fragment>
            <DialogTitle id="alert-dialog-title">
                {`${strings.adminstration.users.actions.delete} ${props.user.name}`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {strings.adminstration.users.actions.deleteConfirmation}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onCancel()}>
                    {strings.adminstration.users.actions.cancel}
                </Button>
                <Button onClick={() => props.onDelete()} autoFocus>
                    {strings.adminstration.users.actions.delete}
                </Button>
            </DialogActions>
        </React.Fragment>
    );
}
