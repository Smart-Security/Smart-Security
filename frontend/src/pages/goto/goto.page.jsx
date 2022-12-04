/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import UserService from "../../services/user.service";
import { useAuth } from "../../hooks/use-auth.hook";
import { Container, Box, useTheme } from "@mui/material";
import "./goto.page.css";
import strings from "../../constants/strings";
import DivisionCard from "./components/division-card.component";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import snackbarService from "./../../services/snackbar.service";
import Alert from "./../../components/alert.component";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { KNOWHTTPSTATUS } from "../../services/api.service";
import Button from "@mui/material/Button";
import StringService from "../../services/strings.service";
import Skeleton from "@mui/material/Skeleton";
import Zoom from "@mui/material/Zoom";

export default function GoToPage(props) {
    const auth = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    // state to manage snackbar state
    const [snackbar, setSnackbar] = useState(
        snackbarService._getInitialState()
    );

    /**
     * On leave building
     */
    const leaveBuilding = async () => {
        try {
            await UserService.leave(auth.user);
            auth.logout();
            navigate("/"); // redirect to login
        } catch (e) {
            // if status code is unauthorized the user credentials are wrong
            if (e?.response?.status === KNOWHTTPSTATUS.unauthorized) {
                auth.logout();
                navigate("/"); // redirect to login
            }

            // show snackbar with error message
            snackbarService.showError(e.message, setSnackbar);
        }
    };

    /**
     * Load the user profile data
     */
    const fetchProfileData = async () => {
        try {
            const response = await UserService.profileInformation(auth.user);
            setProfile(response.data);
        } catch (e) {
            // if status code is unauthorized the user credentials are wrong
            if (e?.response?.status === KNOWHTTPSTATUS.unauthorized) {
                auth.logout();
                navigate("/"); // redirect to login
            }

            // show snackbar with error message
            snackbarService.showError(e.message, setSnackbar);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const goto = async (division) => {
        try {
            await UserService.goto(auth.user, [division.uuid]);
            auth.logout();
            navigate("/", {
                state: { name: profile.name, room: division.name },
            }); // redirect to login
        } catch (e) {
            // if status code is unauthorized the user credentials are wrong
            if (e?.response?.status === KNOWHTTPSTATUS.unauthorized) {
                auth.logout();
                navigate("/"); // redirect to login
            }

            // show snackbar with error message
            snackbarService.showError(e.message, setSnackbar);
        }
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

    const title = StringService.format(strings.goto.title, profile?.name);
    const isLoading = profile == null;

    const theme = useTheme();

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    return (
        <Box className="goto-container">
            <Container maxWidth="lg" className="base-container">
                <div className="divisions-container">
                    <h1 className="go-to-title">
                        {isLoading ? <Skeleton width={200} /> : title}
                    </h1>
                    <Grid container spacing={3}>
                        {profile == null
                            ? [...Array(8)].map((e, i) => (
                                  <Grid item xs={6} key={`grid-item-${i}`}>
                                      <DivisionCard loading />
                                  </Grid>
                              ))
                            : profile?.divisions.map((division) => (
                                  <Grid item xs={6} key={division.uuid}>
                                      <DivisionCard
                                          division={division}
                                          onClick={(division) => goto(division)}
                                      />
                                  </Grid>
                              ))}
                    </Grid>
                </div>
            </Container>
            <Zoom
                in={!isLoading}
                timeout={transitionDuration}
                style={{
                    transitionDelay: `${transitionDuration.exit}ms`,
                }}
                unmountOnExit>
                <Button
                    variant="outlined"
                    color="error"
                    className="add-fab-button"
                    onClick={() => leaveBuilding()}>
                    {strings.leaveBuilding}
                </Button>
            </Zoom>
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
