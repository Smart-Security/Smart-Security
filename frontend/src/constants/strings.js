const strings = {
    companyName: "Smart Security",
    floor: "Floor",
    divisions: "Divisions",
    groundFloor: "Ground Floor",
    leaveBuilding: "Leave Building",
    logout: "Logout",
    divisionTypes: {
        office: "Office",
        commonArea: "Common Area",
    },
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
                stateEntry: "State on Entry",
                stateLeave: "State on Leave",
                details: "Details",
                record: "Record",
                alarmStates: {
                    deactive: "Deactived",
                    active: "Actived",
                    keepActive: "Kept Active",
                    keepDeactive: "Kept Deactive",
                    deactivatedBySecurityGuard: "Deactivated by Security Guard",
                    activatedBySecurityGuard: "Activated by Security Guard",
                },
            },
        },
        alarms: {
            title: "Alarms",
            list: {
                alarmStatus: "Alarm Status",
                name: "Division Name",
                floor: "Floor",
                divisionType: "Division Type",
            },
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
