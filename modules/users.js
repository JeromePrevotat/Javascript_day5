const contactList = document.getElementById('contact-list');

export class Users {
    constructor(username, email, phone) {
        this._id;
        this._username = username;
        this._email = email;
        this._phone = phone;
    }

    deleteContactDisplay(event, contact) {
        event.preventDefault();
        console.log(`Deleting contact: ${contact.username}`);
        event.target.parentElement.remove();
        event.target.remove();
        console.log(`Contact deleted: ${this._username}`);
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
        return contactItem;
    }

    static toJSON(user) {
        return {
            username: user._username,
            email: user._email,
            phone: user._phone
        };
    }

    get id() { return this._id; }
    set id(id) { this._id = id; }

    get username() { return this._username; }
    set username(username) { this._username = username; }
    
    get email() { return this._email; }
    set email(email) { this._email = email; }

    get phone() { return this._phone; }
    set phone(phone) { this._phone = phone; }



}