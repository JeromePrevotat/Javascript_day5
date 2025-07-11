export class Users {
    constructor(id, username, email, phone) {
        this._id = id;
        this._username = username;
        this._email = email;
        this._phone = phone;
    }

    get id() { return this._id; }

    get username() { return this._username; }

    get email() { return this._email; }

    get phone() { return this._phone; }

    set username(username) { this._username = username; }

    set email(email) { this._email = email; }

    set phone(phone) { this._phone = phone; }
}