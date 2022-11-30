import environment from "../constants/enviroment";
import apiService from "./api.service";

export default class UserManagementService {
    static endpoints = {
        addUser: "api/bo/users/new",
        list: "api/bo/users",
        listDivisions: "api/bo/building",
        editUser: "api/bo/users/",
    };

    /**
     * Obtain a list of users on the system
     * @param {*} user logged user information
     * @param {int} page page that will be loaded
     * @param {int} numberOfRows rows per page
     * @param {string} orderBy results ordering "asc" or "desc"
     * @returns
     */
    static async listUsers(user, page, numberOfRows, order = "asc") {
        return await apiService.get(environment.baseUrl + this.endpoints.list, {
            params: {
                pageNo: page,
                pageSize: numberOfRows,
                ord: order,
            },
            headers: {
                Authorization: `${user.tokenType} ${user.token}`,
            },
        });
    }

    /**
     * Loads the user logged information
     * @param {Auth} user logged user
     * @param {AddUser} addUser logged user
     * @returns
     */
    static async addUser(auth, user) {
        return await apiService.post(
            environment.baseUrl + this.endpoints.addUser,
            user,
            {
                headers: { Authorization: `${auth.tokenType} ${auth.token}` },
            }
        );
    }

    /**
     * Loads the user logged information and the user to edit
     * @param {Auth} auth authentication of the user who is making the request
     * @param {EditUser} user user to be edited
     * @param {String} uuid uuid from the user that will be edited to go on the header of the request
     * @returns
     */
    static async editUser(auth, user, uuid) {
        return await apiService.put(
            environment.baseUrl + this.endpoints.editUser + uuid,
            user,
            {
                headers: { Authorization: `${auth.tokenType} ${auth.token}` },
            }
        );
    }

    /**
     * Loads the building information
     * @param {Auth} auth logged user
     * @returns
     */
    static async getBuilding(auth) {
        return await apiService.get(
            environment.baseUrl + this.endpoints.listDivisions,
            {
                headers: { Authorization: `${auth.tokenType} ${auth.token}` },
            }
        );
    }

    /**
     * Loads the building information
     * @param {Auth} auth logged user
     * @returns
     */
    static async deleteUser(auth, userUUID) {
        return await apiService.delete(
            environment.baseUrl + this.endpoints.list + "/" + userUUID,
            {
                headers: { Authorization: `${auth.tokenType} ${auth.token}` },
            }
        );
    }
}
