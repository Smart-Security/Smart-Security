import React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import strings from "./../../../../../../constants/strings";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { ALARM_STATES } from "./../../../../../../models/alarm-state.model";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import "./monitorization-details.component.css";

export default function MonitorizationDetail(props) {
    const alarmsStateMap = {};
    alarmsStateMap[ALARM_STATES.activate] =
        strings.adminstration.monitorization.list.alarmStates.active;
    alarmsStateMap[ALARM_STATES.deactivate] =
        strings.adminstration.monitorization.list.alarmStates.deactive;
    alarmsStateMap[ALARM_STATES.deactivateBySecurityGuard] =
        strings.adminstration.monitorization.list.alarmStates.deactivatedBySecurityGuard;
    alarmsStateMap[ALARM_STATES.activateBySecurityGuard] =
        strings.adminstration.monitorization.list.alarmStates.activatedBySecurityGuard;
    alarmsStateMap[ALARM_STATES.keepActivate] =
        strings.adminstration.monitorization.list.alarmStates.keepActive;
    alarmsStateMap[ALARM_STATES.keepDeactivate] =
        strings.adminstration.monitorization.list.alarmStates.keepDeactive;

    const log = props.log;
    const titleStyle = { fontWeight: "bold" };

    /**
     * Format Java Date string
     * @param {*} dateString
     * @returns
     */
    const getDateFotmatted = (dateString) =>
        moment(dateString).format("DD/MM/YYYY HH:mm:ss");

    return (
        <div className="monitarization-detail-container">
            <DialogTitle id="alert-dialog-title" sx={titleStyle}>
                {strings.adminstration.monitorization.list.record}
            </DialogTitle>
            <DialogContent dividers>
                <div className="monitarization-detail-fields-container">
                    <div className="monitarization-detailed-field">
                        <Typography sx={titleStyle}>
                            {strings.adminstration.monitorization.list.name}
                        </Typography>
                        <Typography className="description">
                            {log?.user.name}
                        </Typography>
                    </div>

                    <div className="monitarization-detailed-field">
                        <Typography sx={titleStyle}>
                            {strings.adminstration.users.list.email}
                        </Typography>
                        <Typography className="description">
                            {log?.user.email}
                        </Typography>
                    </div>

                    <div className="monitarization-detailed-field">
                        <Typography sx={titleStyle}>
                            {strings.adminstration.monitorization.list.entryAt}
                        </Typography>
                        <Typography className="description">
                            {log.entryAt ? getDateFotmatted(log.entryAt) : "-"}
                        </Typography>
                    </div>

                    <div className="monitarization-detailed-field">
                        <Typography sx={titleStyle}>
                            {strings.adminstration.monitorization.list.leaveAt}
                        </Typography>
                        <Typography className="description">
                            {log.leaveAt ? getDateFotmatted(log.leaveAt) : "-"}
                        </Typography>
                    </div>

                    <div className="monitarization-detailed-field-access">
                        <Typography sx={titleStyle}>
                            {strings.adminstration.monitorization.list.access}
                        </Typography>
                        <Stack
                            direction="row"
                            divider={
                                <Divider orientation="vertical" flexItem />
                            }
                            spacing={2}>
                            <Chip
                                key={log.division.uuid}
                                label={log.division.name}
                                variant="outlined"
                            />
                        </Stack>
                    </div>
                </div>
            </DialogContent>
            <Divider orientation="horizontal" flexItem />

            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
                className="monitorization-bottom-resume"
                justifyContent="space-evenly"
                padding="16px">
                <div className="monitarization-detailed-field">
                    <Typography sx={titleStyle}>
                        {strings.adminstration.monitorization.list.stateEntry}
                    </Typography>
                    <Typography className="description">
                        {log.stateOnEntry
                            ? alarmsStateMap[log.stateOnEntry]
                            : "-"}
                    </Typography>
                </div>
                <div className="monitarization-detailed-field">
                    <Typography sx={titleStyle}>
                        {strings.adminstration.monitorization.list.stateLeave}
                    </Typography>
                    <Typography className="description">
                        {log.stateOnLeave
                            ? alarmsStateMap[log.stateOnLeave]
                            : "-"}
                    </Typography>
                </div>
            </Stack>
        </div>
    );
}
