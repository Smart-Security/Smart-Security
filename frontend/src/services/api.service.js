import axios from 'axios';
import strings from '../constants/strings';

/**
 * For each HTTP status
 */
const HTTPSTATUSCODESMESSAGE = {
    401 : strings.exceptions.unauthorized,
    403 : strings.exceptions.forbiden,
    404 : strings.exceptions.notFound,
    500 : strings.exceptions.server,
    ERR_NETWORK : strings.exceptions.networkError,
    generic : strings.exceptions.generic,
}

class APIService {
    
    get = async (url, config) => {
        try {
            await axios.get(url, config)
        } catch (e) {
            this.handleHTTPRequestErrorStatus(e)
        }
    }

    post = async (url, config) => {
        try {
            await axios.post(url, config)
        } catch (e) {
            this.handleHTTPRequestErrorStatus(e)
        }
    }
    
    delete = async (url, config) => {
        try {
            await axios.delete(url, config)
        } catch (e) {
            this.handleHTTPRequestErrorStatus(e)
        }
    }

    /**
     * Handle the error response status, and trow an exception with more context.
     * @param {AxiosError} error 
     */
    handleHTTPRequestErrorStatus = (error) => {
        const errorMessage = error.response ? HTTPSTATUSCODESMESSAGE[error.response.status] : HTTPSTATUSCODESMESSAGE[error.code]
        error.message = errorMessage ? errorMessage : HTTPSTATUSCODESMESSAGE.server;
        throw error;
    }
    
}

// Singletone class
const apiService = new APIService();
export default apiService;
