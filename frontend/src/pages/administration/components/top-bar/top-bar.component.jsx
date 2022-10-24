/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import AppBar from '@mui/material/AppBar'
import PersonIcon from '@mui/icons-material/Person'
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import './top-bar.component.css'
import { useAuth } from '../../../../hooks/use-auth.hook';
import UserService from '../../../../services/user.service';
import Skeleton from '@mui/material/Skeleton';

export default function TopBar(props){

    const [profile, setProfile] = useState(null)
    const auth = useAuth()

    // when component loads for the first time, load 
    useEffect(() => {

        /**
         * Request the api to provide the information of the current user logged.
         */
        const loadProfile = async () => {
            try {
                const response = await UserService.profileInformation(auth.user)
                setProfile(response.data)
            } catch(e) {
                // if (props.onError) props.onError(e)
                // todo show message
                console.error(e);
            }
        }    

        loadProfile()
    }, [])

    const profileLoadingIdicator = (
        <div className="profile-information">
            <Skeleton variant="rounded" width={32} height={32} />
            <Typography variant="h6" noWrap component="div">
                <Skeleton width={100}/>
            </Typography>
        </div>
    )

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                {
                    profile ? (
                        <div className="profile-information">
                            <PersonIcon />
                            <Typography variant="h6" noWrap component="div">
                                    { profile.name }
                            </Typography>
                        </div>)
                        : profileLoadingIdicator
                }
            </Toolbar>
        </AppBar>
    )

}





