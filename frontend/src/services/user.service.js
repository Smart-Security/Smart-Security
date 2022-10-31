import environment from "../constants/enviroment";
import apiService from "./api.service";

export default class UserService {
    static endpoints = {
        login: "auth/login",
        register: "auth/register",
        profile: "api/fo/users",
        goto: "api/fo/users/goto",
        leave: "api/fo/users/leave",
    };

    /**
     * User authentication
     * @param {Authentication} authentication
     * @returns
     */
    static async login(authentication) {
        return await apiService.post(
            environment.baseUrl + this.endpoints.login,
            authentication
        );
    }

    /**
     * Register a new user
     * @param {string} email
     * @param {string} password
     * @returns
     */
    static async register(email, password) {
        return await apiService.post(
            environment.baseUrl + this.endpoints.login,
            {
                email: email,
                password: password,
            }
        );
    }

    /**
     * Loads the user logged information
     * @param {*} user logged user
     * @returns
     */
    static async profileInformation(user) {
        return await apiService.get(
            environment.baseUrl + this.endpoints.profile,
            {
                headers: { Authorization: `${user.tokenType} ${user.token}` },
            }
        );
    }

    /**
     * Go to a room
     * @param {*} auth logged information
     * @param {*} uuidList division the user want to go
     * @returns
     */
    static async goto(auth, uuidList) {
        return await apiService.post(
            environment.baseUrl + this.endpoints.goto,
            { uuids: uuidList },
            {
                headers: { Authorization: `${auth.tokenType} ${auth.token}` },
            }
        );
    }

    /**
     * Leave the building
     * @param {*} auth logged information
     * @returns
     */
    static async leave(auth) {
        return await apiService.get(
            environment.baseUrl + this.endpoints.leave,
            {
                headers: { Authorization: `${auth.tokenType} ${auth.token}` },
            }
        );
    }
}
