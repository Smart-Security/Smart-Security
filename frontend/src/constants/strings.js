const strings = {
    companyName: "Smart Security",
    floor: "Floor",
    divisions: "Divisions",
    groundFloor: "Ground Floor",
    leaveBuilding: "Leave Building",
    logout: "Logout",
    gotoSuccess: "{0} alarms have been deactivated for {1}",
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
        title: "{0} where do you want to go?",
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
                details: "",
                birthDate: "Birth Date",
            },
            actions: {
                deleteConfirmation: "Are you sure you want to delete the user?",
                deleteSuccess: "User {0} was deleted successfully",
                cancel: "Cancel",
                delete: "Delete",
                edit: "Edit",
                details: "Details",
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
                actions: {
                    activate: "Activate alarms",
                    deactivate: "Deactivate alarms",
                },
                deactivationSuccess: "Alarms deactivation complete",
                activationSuccess: "Alarms activation complete",
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
