const strings = {
    companyName: "Smart Security",
    // monitorization: "Monitorization",
    // user: "User",
    floor: "Floor",
    divisions: "Divisions",
    groundFloor: "Ground Floor",
    leaveBuilding: "Leave Building",
    logout: "Logout",
    roles: {
        admin: "Security Guard",
        user: "Employee",
    },
    login: {
        title: "Login",
        email: "Email address",
        emailPlaceolder: "example@mail.com",
        password: "Password",
        passwordPlaceholder: "Password",
        signin: "Sign In",
        invalidEmail: "Invalid email address",
        invalidPassword: "Invalid password",
        invalidCredentials: "Invalid email or password",
    },
    goto: {
        title: "Go To",
    },
    adminstration: {
        managenment: "Managenment",
        users: {
            title: "Users",
            role: "Role",
            adduser: "Add User",
            add: "Add",
            list: {
                name: "Name",
                email: "Email",
                role: "Role",
                access: "Access",
                details: "Details",
                birthDate: "Birth Date",
            },
            submit: "Submit",
            insertName: "Insert Name",
            selectDivisions: "Select divisions",
        },
        monitorization: {
            title: "Monitorization",
            list: {
                name: "Name",
                email: "Email",
                entryAt: "Entry At",
                leaveAt: "Leave At",
                access: "Access",
            },
        },
        alarms: {
            title: "Alarms",
        },
    },
    exceptions: {
        forbiden: "You have no access to this area.",
        unauthorized: "You are not authorized to access this area.",
        notFound: "Page Not Found",
        networkError:
            "Unable to reach the server. Check your network connection.",
        generic:
            "Something went wrong. Try deativate alarms manually or talk with the Security Guard",
    },
};
export default strings;
