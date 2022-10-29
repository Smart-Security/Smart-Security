import React from "react";
import { Card } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./division-card.component.css";
import strings from "./../../../constants/strings";
import { DIVISION_TYPE } from "../../../models/divisions-type.model";

export default function DivisionCard(props) {
    const { division, onClick } = props;

    const alarmStateClass =
        "alarm-state-container" + (division.on ? " on" : " off");

    // map response id to a string
    const divisionTypesMap = {};
    divisionTypesMap[DIVISION_TYPE.common_area] =
        strings.divisionTypes.commonArea;
    divisionTypesMap[DIVISION_TYPE.office] = strings.divisionTypes.office;

    return (
        <Card
            className="division-card"
            sx={{ minWidth: 275 }}
            onClick={() => onClick(division)}>
            <CardContent>
                <Typography
                    variant="h5"
                    component="div"
                    className="title-container">
                    {division.name}
                    <div className={alarmStateClass}></div>
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {divisionTypesMap[division.type]}
                </Typography>
            </CardContent>
            <CardActions className="icons-container"></CardActions>
        </Card>
    );
}
