
import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import './administration.page.css'
import { useAuth } from './../../hooks/use-auth.hook'
import { ROLETYPE } from './../../models/user.model'

export default function AdministrationPage(props) {
    
    const auth = useAuth();       
    const navigate = useNavigate(); 

    useEffect(() => {
        // check if if the user has the required permissions, or if is authenticated
        if (auth.user.role !== ROLETYPE.ADMIN)
            navigate("/")
    })

    return <h1>Administration</h1>
}