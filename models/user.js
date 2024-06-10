import { v4 as uuid } from "uuid";

export default class User {
    constructor(username, password, name, lastName) {
        this.id = uuid();
        this.username = username;
        this.password = password;
        this.name = name;
        this.lastName = lastName;
    }
}
