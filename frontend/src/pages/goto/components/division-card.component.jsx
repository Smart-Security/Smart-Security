import React from "react";
import { Card, Divider, Skeleton } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./division-card.component.css";
import strings from "./../../../constants/strings";
import { DIVISION_TYPE } from "../../../models/divisions-type.model";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ChairIcon from "@mui/icons-material/Chair";

export default function DivisionCard(props) {
    const { division, onClick, loading } = props;

    const alarmStateClass =
        "alarm-state-container" + (division?.on ? " on" : " off");

    // map response id to a string
    const divisionTypesMap = {};
    divisionTypesMap[DIVISION_TYPE.common_area] =
        strings.divisionTypes.commonArea;
    divisionTypesMap[DIVISION_TYPE.office] = strings.divisionTypes.office;

    const loadingIndicator = (
        <Card
            className="division-card"
            sx={{ minWidth: 275 }}
            onClick={() => onClick(division)}>
            <CardContent className="division-henriu">
                <Typography
                    variant="h5"
                    component="div"
                    className="title-container">
                    <div className="division-name-container">
                        <Skeleton variant="rounded" width={24} height={24} />
                        <Skeleton variant="rounded" width={150} />
                    </div>
                    <Skeleton variant="circular" width={10} height={10} />
                </Typography>
                <Divider className="division-card-divider"></Divider>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    <Skeleton
                        variant="rounded"
                        height={24}
                        width={"50%"}></Skeleton>
                </Typography>
            </CardContent>
        </Card>
    );

    return loading ? (
        loadingIndicator
    ) : (
        <Card
            className="division-card"
            sx={{ minWidth: 275 }}
            onClick={() => onClick(division)}>
            <CardContent className="division-content">
                <Typography
                    variant="h5"
                    component="div"
                    className="title-container">
                    <div className="division-name-container">
                        {division.type === DIVISION_TYPE.office ? (
                            <MeetingRoomIcon />
                        ) : (
                            <ChairIcon />
                        )}
                        {division.name}
                    </div>
                    <div className={alarmStateClass}></div>
                </Typography>
                <Divider></Divider>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {divisionTypesMap[division.type]}
                </Typography>
            </CardContent>
        </Card>
    );
}
