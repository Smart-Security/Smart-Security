import axios from "axios";
import strings from "../constants/strings";

export const KNOWHTTPSTATUS = {
    unauthorized: 401,
    forbiden: 403,
    unprocessableEntity: 422,
};

/**
 * For each HTTP status
 */
const HTTPSTATUSCODESMESSAGE = {
    400: strings.exceptions.generic,
    401: strings.exceptions.unauthorized,
    403: strings.exceptions.forbiden,
    404: strings.exceptions.notFound,
    422: strings.exceptions.generic,
    500: strings.exceptions.server,
    ERR_NETWORK: strings.exceptions.networkError,
    generic: strings.exceptions.generic,
};

class APIService {
    get = async (url, config) => {
        try {
            return await axios.get(url, config);
        } catch (e) {
            this.handleHTTPRequestErrorStatus(e);
        }
    };

    post = async (url, data, config) => {
        try {
            return await axios.post(url, data, config);
        } catch (e) {
            this.handleHTTPRequestErrorStatus(e);
        }
    };

    put = async (url, data, config) => {
        try {
            return await axios.put(url, data, config);
        } catch (e) {
            this.handleHTTPRequestErrorStatus(e);
        }
    };

    delete = async (url, config) => {
        try {
            return await axios.delete(url, config);
        } catch (e) {
            this.handleHTTPRequestErrorStatus(e);
        }
    };

    /**
     * Handle the error response status, and trow an exception with more context.
     * @param {AxiosError} error
     */
    handleHTTPRequestErrorStatus = (error) => {
        const errorMessage = error.response
            ? HTTPSTATUSCODESMESSAGE[error.response.status]
            : HTTPSTATUSCODESMESSAGE[error.code];
        error.message = errorMessage
            ? errorMessage
            : HTTPSTATUSCODESMESSAGE.server;
        throw error;
    };
}

// Singletone class
const apiService = new APIService();
export default apiService;
