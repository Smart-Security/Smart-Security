import strings from './../constants/strings';

/**
 * For
 */
const HTTPSTATUSCODESMESSAGE = {
    401 : strings.unauthorized,
    403 : strings.forbiden,
    404 : strings.notFound,
    500 : strings.server,
    generic : strings.generic,
}

/**
 * Handle the error response status, and trow an exception with more context.
 * @param {AxiosError} error 
 */
export function handleHTTPRequestErrorStatus(error) {
    const errorMessage = HTTPSTATUSCODESMESSAGE[error.status]
    const message = !errorMessage ? HTTPSTATUSCODESMESSAGE.generic : errorMessage;
    throw new Error(message);
}