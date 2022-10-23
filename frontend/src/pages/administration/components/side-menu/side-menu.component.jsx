import React from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

const DRAWERWIDTH = 240;

export default function SideMenu(props) {

    return <Drawer
            variant="permanent"
            sx={{
                width: DRAWERWIDTH,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: DRAWERWIDTH, boxSizing: 'border-box' },
            }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
            <List>
                {
                    props.menuItems.map((item) => {
                        
                        const isSelected = item.key === props.currentSelected
                        const itemClassname = isSelected ? "side-menu-item active" : "side-menu-item"

                        return  (
                            <ListItem className={ itemClassname } key={item.key} disablePadding>
                                <ListItemButton color={ isSelected ? "primary" : "secondary" } onClick={() => props.onMenuSelection(item.key)} >
                                    <ListItemIcon className="side-menu-item-icon">
                                        { item.icon }
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            </ListItem>
                        )
                    }
                       
                    )
                }
            </List>
        </Box>
    </Drawer>
}