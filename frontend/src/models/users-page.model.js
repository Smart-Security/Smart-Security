
// {
//     "maxUsers": 3,
//     "length": 3,
//     "userDtos": [
//         {
//             "uuid": "f045b8b0-788a-4415-a45c-a8f0193d288e",
//             "email": "example@mail.com",
//             "name": "aa",
//             "age": 10,
//             "divisionDtos": []
//         },
//         {
//             "uuid": "9c95f89f-e8ec-4e2d-a2f0-a141f2c74a8b",
//             "email": "dani@gmail.com",
//             "name": "aa",
//             "age": 10,
//             "divisionDtos": []
//         },
//         {
//             "uuid": "7d8a9c92-454d-4aff-be9f-7b827f90111a",
//             "email": "daniel@gmail.com",
//             "name": "Daniel Fernandes",
//             "age": 26,
//             "divisionDtos": []
//         }
//     ],
//     "last": true
// }

export class UserRecord {

    constructor(uuid, email, name, age, divisionDtos) {
        this.uuid = uuid;
        this.email = email;
        this.name = name;
        this.age = age;
        this.divisionDtos = divisionDtos;
    }

}

export default class UsersPage {

}