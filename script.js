import { Users } from './modules/users.js';

const loadContactsBtn = document.getElementById('load-contacts-btn');
let addContactBtn = document.getElementById('add-contact-btn');
const cancelEditContactBtn = document.getElementById('cancel-edit-contact-btn');
const emailInput = document.getElementById('email-input');
const usernameInput = document.getElementById('username-input');
const phoneInput = document.getElementById('phone-input');
const contactList = document.getElementById('contact-list');


async function loadContacts() {
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
                // Set the ID from the fetched data
                contact.id = user.id;
                addContactToDOM(contact);
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
    // User validation passed, create a new Users instance
    const newContact = new Users(username, email, phone);
    // Save it to the DB via API
    let response = await saveNewContact(newContact);
    // Response ok, add new contact to DOM and clear inputs for the next addition
    if(response.ok) {
        console.log('Contact added successfully');
        addContactToDOM(newContact);
        clearInputs();
        // Set the ID of the new contact from the response
        newContact.id = (await response.json()).id;
    } else {
        console.error(response.status + ' Error adding contact: ' + response.statusText);
    }
}

function addContactToDOM(contact){
    // Display it via User method and get its Dom Item as return
    if(contact instanceof Users) {
        let newContactItem = contact.display();
        // Add event listener to the pencil icon
        newContactItem.querySelector('.fa-pencil').addEventListener('click', (event) => editContactMode(event, contact, newContactItem));
        console.log('Adding event listener to edit icon');
        // Give the Dom Item to edit at the right place
        // Add event listener to the trash icon
        newContactItem.querySelector('.fa-trash').addEventListener('click', (event) => {
            console.log('Adding event listener to delete icon');
            deleteContact(event, contact);
        });
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

async function editNewContact(contact){
    // Update contact in the DB via API
    let response = await fetch(`https://jsonplaceholder.typicode.com/users/${contact.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Users.toJSON(contact))
    });
    return response;
}

async function editContactMode(event, contact, contactItem) {
    event.preventDefault();
    // Show the cancel button
    cancelEditContactBtn.style.display = 'inline-block';
    // Preload Inputs with current contact data
    console.log(`Editing contact: ${contact.username}`);
    emailInput.value = contact.email;
    usernameInput.value = contact.username;
    phoneInput.value = contact.phone;

    // Remove the addContactBtn event listener
    addContactBtn = removeAllListeners(addContactBtn);
    // Change the button text to "Update Contact"
    addContactBtn.textContent = 'Update Contact';
    // Switch event listener from add to edit
    addContactBtn.addEventListener('click', (event) => editContact(event, contact, contactItem));
}

async function editContact(event, contact, contactItem){
    event.preventDefault();
    // Update new contact with the values from the inputs and keep its ID (mandatory for the API request)
    let editedContact = new Users(usernameInput.value, emailInput.value, phoneInput.value);
    editedContact.id = contact.id;
    let response = await editNewContact(editedContact);
    if(response.ok) {
        console.log(`Contact ${editedContact.username} updated successfully in the database.`);
        // Update contact in the DOM
        // Saves edit and delete icons
        const editIcon = contactItem.querySelector('.fa-pencil');
        const deleteIcon = contactItem.querySelector('.fa-trash');
        // Update the contact item text content
        contactItem.textContent = `Username: ${editedContact.username}, Email: ${editedContact.email}, Phone: ${editedContact.phone}`;
        // Re-append the icons to the updated contact item
        contactItem.appendChild(editIcon);
        contactItem.appendChild(deleteIcon);
        // Clear Inputs for the next Addition/Edit
        clearInputs();

        // Switch the button back to its original state
        addContactBtn = removeAllListeners(addContactBtn);
        addContactBtn.textContent = 'Add Contact';
        addContactBtn.addEventListener('click', (event) => addContact(event));
    } else {
        console.error(`Error updating contact ${editedContact.username}: ${response.status} ${response.statusText}`);
    }
}

function cancelEdit(event) {
    event.preventDefault();
    // Switch the button back to its original state
    addContactBtn = removeAllListeners(addContactBtn);
    addContactBtn.textContent = 'Add Contact';
    addContactBtn.addEventListener('click', (event) => addContact(event));
    // Clear Inputs for the next Addition/Edit
    clearInputs();
    // Hide the button
    cancelEditContactBtn.style.display = 'none';
} 

async function deleteContact(event, contact) {
    event.preventDefault();
    // Delete contact from the DB via API
    let response = await fetch(`https://jsonplaceholder.typicode.com/users/${contact.id}`, {
        method: 'DELETE'
    });
    if(response.ok) {
        console.log(`Contact ${contact.username} deleted successfully from the database.`);
        // Delete contact from the DOM
        contact.deleteContactDisplay(event);
        console.log(`Contact ${contact.username} removed from the display.`);
    } else {
        console.error(`Error deleting contact ${contact.username}: ${response.status} ${response.statusText}`);
    }
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
    cancelEditContactBtn.addEventListener('click', (event) => cancelEdit(event));

    console.log('Event listeners added');
}

function removeAllListeners(element) {
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
}

function main(){
    console.log('Contacts Manager Initializing...');
    addEventListeners();
}

main();