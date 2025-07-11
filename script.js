import { Users } from './modules/users.js';

const loadContactsBtn = document.getElementById('load-contacts-btn');
const addContactBtn = document.getElementById('add-contact-btn');
const emailInput = document.getElementById('email-input');
const usernameInput = document.getElementById('username-input');
const phoneInput = document.getElementById('phone-input');
const contactList = document.getElementById('contact-list');


async function loadContacts() {
    const contacts = [];
    console.log('Loading contacts...');

    // Clear the contact list before loading new contacts
    clearContactList();

    let loadingMessage = document.createElement('h4');
    loadingMessage.textContent = 'Loading contacts...';
    contactList.parentElement.appendChild(loadingMessage);
    
    try{
        setTimeout(async () => {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            data.forEach(user => {
                const contact = new Users(user.username, user.email, user.phone);
                contacts.push(contact);
                contact.display();
            });
            console.log('Contacts loaded successfully');
            loadingMessage.remove();
        }, 2500);
    } catch (error) {
        console.error('Error loading contacts:', error);
        loadingMessage.textContent = 'Error loading contacts';
    }
}

async function addContact(event) {
    event.preventDefault();
    console.log('Adding contact...');
    const email = emailInput.value;
    const username = usernameInput.value;
    const phone = phoneInput.value;
    let error = null;

    if(error = validateInputs(email, username, phone)) {
        console.error('Validation Error:\n' + error.map(e => `- ${e}`)
                                                    .join('\n'));
        return;
    }

    const newContact = new Users(username, email, phone);
    let response = await saveNewContact(newContact);
    if(response.ok) {
        console.log('Contact added successfully');
        let newContactItem = newContact.display();
        newContactItem.addEventListener('click', (event) => {
            newContact.deleteContact(event, newContactItem);
        });
        clearInputs();
    } else {
        console.error(response.status + ' Error adding contact: ' + response.statusText);
    }
}

async function saveNewContact(contact) {
    let response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Users.toJSON(contact))
    });
    return response;
}

async function deleteContact(event, contact) {
    deleteContactDisplay(event, contact);
    let response = await fetch(`https://jsonplaceholder.typicode.com/users/${contact.id}`, {
        method: 'DELETE'
    });
}

function validateInputs(email, username, phone) {
    let error = null;
    let errorMessages = [];
    if(!email) errorMessages.push('Email is missing');
    if(!username) errorMessages.push('Username is missing');
    if(!phone) errorMessages.push('Phone number is missing');
    if (errorMessages.length > 0) error = errorMessages;
    return error;
}

function clearInputs() {
    emailInput.value = '';
    usernameInput.value = '';
    phoneInput.value = '';
}

function clearContactList(){
    while (contactList.firstChild) contactList.removeChild(contactList.firstChild);
}

function addEventListeners() {
    loadContactsBtn.addEventListener('click', loadContacts);
    addContactBtn.addEventListener('click', (event) => addContact(event));

    console.log('Event listeners added');
}

function main(){
    console.log('Contacts Manager Initializing...');
    addEventListeners();
}

main();