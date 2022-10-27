import environment from "../constants/enviroment";
import apiService from "./api.service";

export default class UserManagementService {
  static endpoints = {
    addUser: "api/bo/users/new",
    list: "api/bo/users",
    listDivisions: "api/bo/building",
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
}
