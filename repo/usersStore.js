import User from "../models/user.js";

class UsersStore {
    users = new Map();

    constructor() {
        const admin = new User("admin", "admin", "Админ", "Админов");
        this.users.set(admin.username, admin);
    }

    addUserAsync = async ({ username, password, name, lastName }) => {
        const newUser = new User(username, password, name, lastName);
        this.users.set(newUser.username, newUser);
        return newUser;
    };

    getUserAsync = async (username) => this.users.get(username);

    verifyUserAsync = async (username, password) => {
        const user = await this.getUserAsync(username);
        if (password && user?.password == password) {
            return user;
        }
        return undefined;
    };
}

const usersStore = new UsersStore();

export default usersStore;
