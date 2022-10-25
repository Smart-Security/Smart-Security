
/**
 * Every role type in the application
 */
export const ROLETYPE = {
    ADMIN: "ROLE_SECURITY_GUARD",
    EMPLOYEE: "ROLE_USER"
}

// {
//     "token": "...",
//     "tokenType": "Bearer",
//     "role": "ROLE_SECURITY_GUARD"
// }

export default class Authentication {
    
    constructor(token, tokenType, role) {
        this.token = token;
        this.tokenType = tokenType;
        this.role = role;
    }

}