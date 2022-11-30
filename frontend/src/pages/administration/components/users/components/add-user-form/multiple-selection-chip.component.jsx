import React, { useEffect } from "react";
// import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import strings from "../../../../../../constants/strings";
// import { ListSubheader } from "@mui/material";
import { FormHelperText } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

// function getStyles(division, selectedDivisions, theme) {
//   const isDivisionNotSelected = false;

//   return {
//     fontWeight: isDivisionNotSelected
//       ? theme.typography.fontWeightRegular
//       : theme.typography.fontWeightMedium,
//   };
// }

export default function MultipleSelectChip(props) {
    // const theme = useTheme();

    const building = props.divisions;
    const divisionSelected = props.selectedDivisions;
    const error = props.error;
    const helperText = props.helperText;

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
        <div>
            <FormControl
                sx={{ m: 1, width: 300 }}
                error={divisionSelected.length === 0}>
                <InputLabel id="demo-multiple-chip-label">
                    {strings.divisions}
                </InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={divisionSelected}
                    onChange={handleDivisionSelected}
                    input={
                        <OutlinedInput id="select-multiple-chip" label="Chip" />
                    }
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
                                    key={divison.uuid}
                                    label={divison.name}
                                />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}>
                    {building.map((floor) =>
                        floor.divisions
                            .filter(
                                (division) => division.type !== "COMMON_AREA"
                            )
                            .map((division) => (
                                <MenuItem
                                    key={division.uuid}
                                    value={division}
                                    // style={getStyles(division, divisionSelected, theme)}
                                >
                                    {division.name}
                                </MenuItem>
                            ))
                    )}
                    {/* {building.map((floor) => (
            <div key={`${strings.floor} ${floor.number}`}>
              <ListSubheader>
                {`${strings.floor} ${floor.number}`}
              </ListSubheader>
              {floor.divisions.map((division) => (
                <MenuItem
                  key={division.uuid}
                  value={division}
                  //style={getStyles(division.name, divisionSelected, theme)}
                >
                  {division.name}
                </MenuItem>
              ))}
            </div>
          ))} */}
                </Select>
                <FormHelperText>{error ? helperText : ""}</FormHelperText>
            </FormControl>
        </div>
    );
}
