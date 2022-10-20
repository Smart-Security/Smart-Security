import axios from "axios";
import environment from "../constants/enviroment";
import handleHTTPRequestErrorStatus from "./exceptions.service";

export default class UserService {

    static endpoints = {
        login: "auth/login",
        register: "auth/register"
    };

    /**
     * User authentication
     * @param {string} email 
     * @param {string} password 
     * @returns
     */
    static async login(email, password) {
        try {
            const response = await axios.post(environment.baseUrl + this.endpoints.login, {
                email: email,
                password: password,
            });
            return response;
        } catch (e) {
            handleHTTPRequestErrorStatus(e)
        }
    }

    /**
     * Register a new user
     * @param {string} email 
     * @param {string} password 
     * @returns 
     */
    static async register(email, password) {
        return axios.post(environment.baseUrl + this.endpoints.login, {
            email: email,
            password: password,
        })
    }
}