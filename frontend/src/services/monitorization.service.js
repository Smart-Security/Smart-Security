import environment from "../constants/enviroment";
import apiService from "./api.service";

export default class MonitorizationService {
    static endpoints = {
        log: "api/bo/log",
    };

    /**
     * User authentication
     * @param {Authentication} authentication
     * @returns
     */
    static async logs(user, page, numberOfRows, order = "asc") {
        return await apiService.get(environment.baseUrl + this.endpoints.log, {
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
}
