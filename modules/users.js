const contactList = document.getElementById('contact-list');

export class Users {
    constructor(username, email, phone) {
        this._username = username;
        this._email = email;
        this._phone = phone;
    }

    display() {
        console.log(`Username: ${this._username}, Email: ${this._email}, Phone: ${this._phone}`);
        const contactItem = document.createElement('li');
        contactItem.className = 'contact-list-item';
        contactItem.innerHTML = `Username: ${this._username}, Email: ${this._email}, Phone: ${this._phone}`;
        contactList.appendChild(contactItem);
        const trashIcon = document.createElement('i');
        trashIcon.className = 'fa-solid fa-trash m-2';
        trashIcon.style.cursor = 'pointer';
        trashIcon.style.color = 'red';
        contactItem.appendChild(trashIcon);
        trashIcon.addEventListener('click', () => {
            contactList.removeChild(contactItem);
            trashIcon.remove();
            console.log(`Contact deleted: ${this._username}`);
        });
    }

    static toJSON(user) {
        return {
            username: user._username,
            email: user._email,
            phone: user._phone
        };
    }

    get id() { return this._id; }

    get username() { return this._username; }

    get email() { return this._email; }

    get phone() { return this._phone; }

    set username(username) { this._username = username; }

    set email(email) { this._email = email; }

    set phone(phone) { this._phone = phone; }
}