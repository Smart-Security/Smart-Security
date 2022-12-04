export default class EditUser {
    constructor(email, name, birthDate, password, divisions) {
        this.user = {
            email: email,
            name: name,
            birthDate: birthDate,
        };
        this.password = password;
        this.divisions = divisions;
    }
}
