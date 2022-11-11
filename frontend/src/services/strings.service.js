export default class StringService {
    /**
     * Format a string with multiple values
     * @param {*} string
     * @param  {...any} args
     * @returns
     */
    static format = (string, ...args) => {
        var formatted = string;
        for (var i = 0; i < args.length; i++) {
            var regexp = new RegExp("\\{" + i + "\\}", "gi");
            formatted = formatted.replace(regexp, args[i]);
        }
        return formatted;
    };
}
