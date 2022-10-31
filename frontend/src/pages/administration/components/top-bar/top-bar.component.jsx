/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import "./top-bar.component.css";
import { useAuth } from "../../../../hooks/use-auth.hook";
import UserService from "../../../../services/user.service";
import Skeleton from "@mui/material/Skeleton";
import { Tooltip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import strings from "../../../../constants/strings";
import { useTheme } from "@mui/material/styles";

export default function TopBar(props) {
    const [profile, setProfile] = useState(null);
    const auth = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    // when component loads for the first time, load
    useEffect(() => {
        /**
         * Request the api to provide the information of the current user logged.
         */
        const loadProfile = async () => {
            try {
                const response = await UserService.profileInformation(
                    auth.user
                );
                setProfile(response.data);
            } catch (e) {
                // if (props.onError) props.onError(e)
                // message will be showned on content component
            }
        };

        loadProfile();
    }, []);

    const profileLoadingIdicator = (
        <Box className="profile-information" sx={{ flexGrow: 1 }}>
            <Skeleton variant="rounded" width={32} height={32} />
            <Typography variant="h6" noWrap component="div">
                <Skeleton width={100} />
            </Typography>
            <Skeleton variant="rounded" width={32} height={32} />
        </Box>
    );

    /**
     * Sing out user logged
     */
    const onLogout = async () => {
        auth.logout();
        navigate("/"); // redirect to login
    };

    return (
        <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                {profile ? (
                    <React.Fragment>
                        <Box
                            className="profile-information"
                            sx={{ flexGrow: 1 }}>
                            <PersonIcon />
                            <Typography variant="h6" component="div">
                                {profile.name}
                            </Typography>
                        </Box>
                        <Tooltip title={strings.logout}>
                            <IconButton
                                onClick={onLogout}
                                style={{ color: theme.palette.error[400] }}>
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    </React.Fragment>
                ) : (
                    profileLoadingIdicator
                )}
            </Toolbar>
        </AppBar>
    );
}
