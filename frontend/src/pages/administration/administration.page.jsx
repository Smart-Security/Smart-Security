
import React from 'react'
import './administration.page.css'
import { Navigate } from 'react-router-dom'

export default class AdministrationPage extends React.Component {

    componentDidMount() {

    }

    render() {

        // Redirect if the user is not logged in
        const isLoggedIn = false;
        if (!isLoggedIn)
            return <Navigate to="/" />

        return <h1>Administration</h1>
    }
}