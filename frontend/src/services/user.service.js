import axios from "axios";
import environment from "../constants/enviroment";

export default class UserService {

    endpoints = {
        login: "auth/login",
        register: "auth/register"
    };

    /**
     * User authentication
     * @param {*} email 
     * @param {*} password 
     * @returns 
     */
    async login(email, password) {
        return await axios.post(environment.baseUrl + this.endpoints.login, {
            email: email,
            password: password,
        });
    }

    /**
     * Register a new user
     * @param {*} email 
     * @param {*} password 
     * @returns 
     */
    async register(email, password) {
        return axios.post(environment.baseUrl + this.endpoints.login, {
            email: email,
            password: password,
        })
    }

}