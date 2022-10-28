import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import strings from "./../../../../../../constants/strings";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import Divider from "@mui/material/Divider";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./user-actions-menu.component.css";

export default function UserActionsMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onDelete = (event) => {
        props.onDelete(event);
    };

    const onDetails = (event) => {
        props.onDetails(event);
    };

    const onEdit = (event) => {
        props.onEdit(event);
    };

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}>
                <MoreVertIcon />
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                    onClick={onEdit}
                    className="action-menu-item"
                    disableRipple>
                    <EditIcon />
                    {strings.adminstration.users.actions.edit}
                </MenuItem>
                <MenuItem
                    onClick={onDetails}
                    className="action-menu-item"
                    disableRipple>
                    <ReadMoreIcon />
                    {strings.adminstration.users.actions.details}
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                    onClick={onDelete}
                    className="action-menu-item"
                    disableRipple>
                    <DeleteIcon />
                    {strings.adminstration.users.actions.delete}
                </MenuItem>
            </Menu>
        </div>
    );
}
