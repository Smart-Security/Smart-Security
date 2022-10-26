import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import strings from "../../../../../../constants/strings";
import { ListSubheader } from "@mui/material";

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

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

function getStyles(division, selectedDivisions, theme) {
  // console.log(division, selectedDivisions, theme.typography);

  const isDivisionNotSelected = false;
  /*selectedDivisions
      .map((selectedDivision) => selectedDivision.uuid)
      .indexOf(division.uuid) === -1;*/
  return {
    fontWeight: isDivisionNotSelected
      ? theme.typography.fontWeightRegular
      : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip(props) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const building = props.divisions;
  const [divisionSelected, setDivisionSelected] = React.useState([]);

  const handleDivisionSelected = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    setDivisionSelected(value);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">
          {strings.divisions}
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={divisionSelected}
          onChange={handleDivisionSelected}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((divison) => (
                <Chip key={divison.uuid} label={divison.name} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {building.map(
            (floor) =>
              floor.divisions
                .filter((division) => division.type !== "COMMON_AREA")
                .map((division) => (
                  <MenuItem
                    key={division.uuid}
                    value={division}
                    style={getStyles(division, divisionSelected, theme)}
                  >
                    {division.name}
                  </MenuItem>
                ))
            // {
            // return (
            //   <div key={`${strings.floor} ${floor.number}`}>
            //     <ListSubheader>
            //       {`${strings.floor} ${floor.number}`}
            //     </ListSubheader>
            //     {floor.divisions.map((division, index) => (
            //       <MenuItem
            //         key={`${floor.number} ${division.name}`}
            //         value={division}
            //         style={getStyles(division.name, divisionSelected, theme)}
            //       >
            //         {division.name}
            //       </MenuItem>
            //     ))}
            //   </div>
            // );
            // }
          )}
        </Select>
      </FormControl>
    </div>
  );
}
