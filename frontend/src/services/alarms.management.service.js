import environment from "../constants/enviroment";
import apiService from "./api.service";

export default class AlarmsManagementService {
    static endpoints = {
        activate: "api/bo/building/activeAlarms",
        deactivate: "api/bo/building/desactiveAlarms",
    };

    /**
     * Activate a list of alarms
     * @param {*} auth user logged information
     * @param {*} uuidList list of alarms uuids
     * @returns
     */
    static async activateAlarms(user, uuidList) {
        return await apiService.post(
            environment.baseUrl + this.endpoints.activate,
            { uuids: uuidList },
            {
                headers: {
                    Authorization: `${user.tokenType} ${user.token}`,
                },
            }
        );
    }

    /**
     * Deactivate a list of alarms
     * @param {*} auth user logged information
     * @param {*} uuidList list of alarms uuids
     * @returns
     */
    static async deactivateAlarms(auth, uuidList) {
        return await apiService.post(
            environment.baseUrl + this.endpoints.deactivate,
            { uuids: uuidList },
            {
                headers: { Authorization: `${auth.tokenType} ${auth.token}` },
            }
        );
    }
}
