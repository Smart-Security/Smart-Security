import strings from './../constants/strings';

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

/**
 * Handle the error response status, and trow an exception with more context.
 * @param {AxiosError} error 
 */
export default function handleHTTPRequestErrorStatus(error) {
    const errorMessage = error.response ? HTTPSTATUSCODESMESSAGE[error.response.status] : HTTPSTATUSCODESMESSAGE[error.code]
    error.message = errorMessage ? errorMessage : HTTPSTATUSCODESMESSAGE.server;
    throw error;
}