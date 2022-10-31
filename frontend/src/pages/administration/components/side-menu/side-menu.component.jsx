import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import ListSubheader from "@mui/material/ListSubheader";
import strings from "../../../../constants/strings";

const DRAWERWIDTH = 240;

export default function SideMenu(props) {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWERWIDTH,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: DRAWERWIDTH,
                    boxSizing: "border-box",
                },
            }}>
            <Toolbar />
            <Box sx={{ overflow: "auto" }}>
                <List>
                    <ListSubheader>
                        {strings.adminstration.managenment}
                    </ListSubheader>
                    {props.menuItems.map((item) => {
                        const isSelected = item.key === props.currentSelected;
                        const selectedStyle = {
                            color: isSelected ? "primary" : "secondary",
                        };

                        return (
                            <ListItem key={item.key} disablePadding>
                                <ListItemButton
                                    onClick={() =>
                                        props.onMenuSelection(item.key)
                                    }>
                                    <ListItemIcon style={selectedStyle}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        style={selectedStyle}
                                        primary={item.name}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Drawer>
    );
}
