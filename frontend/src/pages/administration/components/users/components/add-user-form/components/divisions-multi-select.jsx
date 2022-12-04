import React from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import strings from "../../../../../../../constants/strings";
import { FormHelperText } from "@mui/material";
import { DIVISION_TYPE } from "../../../../../../../models/divisions-type.model";
import { useTheme } from "@mui/material/styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};

function getStyles(division, selectedDivisions, theme) {
    const isDivisionNotSelected = selectedDivisions.includes(division);

    const colorStyle = {
        color: isDivisionNotSelected
            ? theme.palette.primary[500]
            : theme.palette.text.primary,
    };

    const textStyle = {
        ...colorStyle,
        fontWeight: isDivisionNotSelected ? 600 : 400,
    };

    return textStyle;
}

export default function DivisionsMultiChip(props) {
    const selectedDivisions = props.selectedDivisions;
    const error = props.error;
    const helperText = props.helperText;

    const theme = useTheme();

    // get divions list unformized in one array
    const divisions = props?.divisions
        .map((floor) => {
            return floor.divisions.map((division) => {
                return division;
            });
        })
        .flat(1);

    // get the divisions with the same object reference to provide predefined selected divisions
    const getUniformDivisions = () => {
        return selectedDivisions.map((division) => {
            const uniformizedDivisionIndex = divisions.findIndex(
                (uniformizedDivision) => {
                    return division.uuid === uniformizedDivision.uuid;
                }
            );

            // founded
            if (uniformizedDivisionIndex !== -1)
                return divisions[uniformizedDivisionIndex];

            return null;
        });
    };
    const unformizedSelectedDivision = getUniformDivisions();

    /**
     * When a new division is selected
     */
    const handleDivisionSelected = (event) => {
        const {
            target: { value },
        } = event;
        props.onSelectedDivisions(value);
    };

    return (
        <FormControl error={unformizedSelectedDivision.length === 0}>
            <InputLabel id="demo-multiple-chip-label">
                {strings.divisions}
            </InputLabel>
            <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={unformizedSelectedDivision}
                onChange={handleDivisionSelected}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                        }}>
                        {selected.map((divison) => (
                            <Chip
                                variant="outlined"
                                key={divison}
                                label={divison.name}
                            />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}>
                {divisions
                    .filter(
                        (divison) => divison.type !== DIVISION_TYPE.common_area
                    )
                    .map((division) => (
                        <MenuItem
                            key={division}
                            value={division}
                            style={getStyles(
                                division,
                                unformizedSelectedDivision,
                                theme
                            )}>
                            {division.name}
                        </MenuItem>
                    ))}
            </Select>
            <FormHelperText>{error ? helperText : ""}</FormHelperText>
        </FormControl>
    );
}
