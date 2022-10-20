
/**
 * Snackbar Log level
 */
const LOGLEVEL= {
    error : "error",
    success : "success",
    info: "info",
    warning: "warning"
}

/**
 * ## SnackBar base structure:
 * 
 * const [snackbar, setSnackbar] = useState(snackbarService._getInitialState())
 * 
 * ```
 * <Snackbar
 *      open={snackbar.open}
 *      autoHideDuration={6000}
 *      onClose={handleClose}
 *      action={action}>
 *      <Alert onClose={handleClose} severity={snackbar.severity}>
 *          {snackbar.message}
 *      </Alert>
 *  </Snackbar>
 * ``` 
 */
class SnackBarService {

    /**
     * Factory that builds the basic snackbar state object.
     * @param {string} message 
     * @param {string} severity 
     * @param {boolean} open 
     * @returns 
     */
    _getObject(message, severity, open = true) {
        return {
            open : open,
            severity: severity,
            message: message,
        }
    }

    /**
     * Loads the snackbar init state
     * @returns 
     */
    _getInitialState() {
        return this._getObject("", LOGLEVEL.info, false)
    }
    
    /**
     * Updates the state of the snackbar to show an error message
     * @param {string} message message to show on the snackbar
     * @param {*} setSnackbar method to update state of the snackbar state object
     */
    showError(message, setSnackbar) {
        const log = this._getObject(message, LOGLEVEL.error)
        setSnackbar(log)
    }

    /**
     * Updates the state of the snackbar to show an success message
     * @param {*} message message to show on the snackbar
     * @param {*} setSnackbar method to update state of the snackbar state object
     */
    showSuccess(message, setSnackbar) {
        const log = this._getObject(message, LOGLEVEL.success)
        setSnackbar(log) 
    }

    /**
     * Updates the state of the snackbar to show an success message
     * @param {string} message message to show on the snackbar
     * @param {*} setSnackbar method to update state of the snackbar state object
     */
    showWarning(message, setSnackbar) {
        const log = this._getObject(message, LOGLEVEL.success)
        setSnackbar(log) 
    }

    /**
     * Updates the state of the snackbar to show an success message
     * @param {string} message message to show on the snackbar
     * @param {*} setSnackbar method to update state of the snackbar state object
     */
    showInfo(message, setSnackbar) {
        const log = this._getObject(message, LOGLEVEL.info)
        setSnackbar(log) 
    }

    /**
     * Hide the snackbar
     * @param {*} currentState current state of the snackbar
     * @param {*} setSnackbar method to update state of the snackbar state object
     */
    hide(currentState, setSnackbar) {
        const log = this._getObject(currentState.message, currentState.severity, false);
        setSnackbar(log);
    }
    
}

// Singletone class
const snackbarService = new SnackBarService();
export default snackbarService;