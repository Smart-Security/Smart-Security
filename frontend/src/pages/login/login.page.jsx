
import React from 'react'
import './login.page.css'
import LoginForm from './components/login_form/login_form.component'

export default class LoginPage extends React.Component {
    render() {
        return <div className="login">
            <LoginForm />
        </div>
    }
}