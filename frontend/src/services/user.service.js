import environment from "../constants/enviroment";
import apiService from "./api.service";

export default class UserService {

    static endpoints = {
        login: "auth/login",
        register: "auth/register",
        profile: "api/fo/users"
    };

    /**
     * User authentication
     * @param {string} email 
     * @param {string} password 
     * @returns
     */
    static async login(email, password) {
        return await apiService.post(environment.baseUrl + this.endpoints.login, {
            email: email,
            password: password,
        })
    }

    /**
     * Register a new user
     * @param {string} email 
     * @param {string} password 
     * @returns 
     */
    static async register(email, password) {
        return await apiService.post(environment.baseUrl + this.endpoints.login, {
            email: email,
            password: password,
        })
    }
    
    /**
     * Loads the user logged information
     * @param {*} token authentication token
     * @returns 
     */
    static async profileInformation(auth) {
        return await apiService.get(environment.baseUrl + this.endpoints.profile, {
            headers: { 'Authorization' : `${auth.tokenType} ${auth.token}` }
        })
    }
}