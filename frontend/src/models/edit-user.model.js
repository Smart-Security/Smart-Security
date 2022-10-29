export default class EditUser {
  constructor(email, name, birthDate, divisions) {
    this.user = {
      email: email,
      name: name,
      birthDate: birthDate,
    };
    this.divisions = divisions;
  }
}
