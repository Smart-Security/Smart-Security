import React from "react";
import { DIVISION_TYPE } from "./../../../../../../models/divisions-type.model";
import Chip from "@mui/material/Chip";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import "./user-detail.component.css";
import strings from "./../../../../../../constants/strings";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { ROLETYPE } from "./../../../../../../models/role-type.model";
import moment from "moment/moment";

export default function UserDetail(props) {
    const user = props.user;

    const titleStyle = { fontWeight: "bold" };

    return (
        <div className="user-detail-container">
            <DialogTitle id="alert-dialog-title" sx={titleStyle}>
                {user?.name}
            </DialogTitle>
            <DialogContent dividers>
                <div className="user-detail-fields-container">
                    <div className="user-detailed-field">
                        <Typography sx={titleStyle}>
                            {strings.adminstration.users.list.role}
                        </Typography>
                        <Typography className="description">
                            {user?.role === ROLETYPE.ADMIN
                                ? strings.roles.admin
                                : strings.roles.user}
                        </Typography>
                    </div>

                    <div className="user-detailed-field">
                        <Typography sx={titleStyle}>
                            {strings.adminstration.users.list.email}
                        </Typography>
                        <Typography className="description">
                            {user?.email}
                        </Typography>
                    </div>

                    <div className="user-detailed-field">
                        <Typography sx={titleStyle}>
                            {strings.adminstration.users.list.birthDate}
                        </Typography>
                        <Typography className="description">
                            {moment(user?.birthDate).format("DD/MM/YYYY")}
                        </Typography>
                    </div>

                    {user?.divisions.length ? (
                        <div className="user-detailed-field-access">
                            <Typography sx={titleStyle}>
                                {strings.adminstration.users.list.access}
                            </Typography>
                            <Stack
                                direction="row"
                                divider={
                                    <Divider orientation="vertical" flexItem />
                                }
                                spacing={2}>
                                {user?.divisions
                                    .filter(
                                        (division) =>
                                            division.type !==
                                            DIVISION_TYPE.common_area
                                    )
                                    .map((division) => (
                                        <Chip
                                            key={division.uuid}
                                            label={division.name}
                                            variant="outlined"
                                        />
                                    ))}
                            </Stack>
                        </div>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}
                </div>
            </DialogContent>
        </div>
    );
}
