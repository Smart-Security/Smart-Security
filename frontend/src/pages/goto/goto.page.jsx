/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import UserService from "../../services/user.service";
import { useAuth } from "../../hooks/use-auth.hook";
import { Container, Box } from "@mui/material";
import "./goto.page.css";
import strings from "../../constants/strings";
import DivisionCard from "./components/division-card.component";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import snackbarService from "./../../services/snackbar.service";
import Alert from "./../../components/alert.component";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Zoom from "@mui/material/Zoom";

export default function GoToPage(props) {
    const auth = useAuth();

    const [profile, setProfile] = useState(null);

    // state to manage snackbar state
    const [snackbar, setSnackbar] = useState(
        snackbarService._getInitialState()
    );

    /**
     * Load the user profile data
     */
    const fetchProfileData = async () => {
        try {
            const response = await UserService.profileInformation(auth.user);
            setProfile(response.data);
        } catch (e) {}
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    useEffect(() => {
        console.log(profile);
    }, [profile]);

    const goto = (division) => {
        try {
            const response = UserService.goto(auth.user, [division.uuid]);
            setProfile(response.data);
        } catch (e) {}
    };

    /**
     * Event on snackbar close event
     * @param {*} event
     * @param {*} reason
     * @returns void
     */
    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;

        snackbarService.hide(snackbar, setSnackbar);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}></IconButton>
        </React.Fragment>
    );

    const theme = useTheme();

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    return (
        <Box>
            <Container maxWidth="lg">
                <h1>{strings.goto.title}</h1>
                <Zoom
                    in={profile != null}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${transitionDuration.exit}ms`,
                    }}
                    unmountOnExit>
                    <Grid container spacing={2}>
                        {profile?.divisions.map((division) => (
                            <Grid item xs={4}>
                                <DivisionCard
                                    key={division.uuid}
                                    division={division}
                                    onClick={(division) => goto(division)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Zoom>
            </Container>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleClose}
                action={action}>
                <Alert onClose={handleClose} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
