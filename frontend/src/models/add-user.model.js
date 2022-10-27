// {
//     "user":{
//         "email" : "henri@gmail.com",
//         "name" : "Henrique Marques",
//         "age" : 24
//     },
//     "password": "asd123",
//     "divisions": [
//         "8091f677-bfd5-4d99-aabe-b8096e1b77f6",
//         "9ea3022a-2d36-4c74-8114-5e0e757efebd"
//     ]
// }

export default class AddUser {
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
