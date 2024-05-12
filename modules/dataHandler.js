import { getStorageArray, getStorageObject, getStorageString, setStorage } from "./modules/storageHandler.js";
const apiUrl = 'https://api.guildwars2.com/v2/';

//Check API key and/or request info

async function fetchPermissions() {
    //No token -> ask for token
    if (!localStorage.getItem('authToken')) {
        let getToken = window.prompt('GW2 API Key');
        localStorage.setItem('authToken', getToken.toString());
    }
    //Token permissions
    fetch(`${apiUrl}tokeninfo?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('Fetch: Response not ok');
        }
        return response.json();
    })
    .then(data => {
        setStorage('Permissions', data);
    })
    .catch(error => {
        console.error('Error:', error);
    })
}

    //Fetch material storage and write to inventory

async function fetchMatStorage() {
    let inventory = getStorageObject('Inventory');
        fetch(`${apiUrl}account/materials?access_token=${authToken}`)
        .then(response => {
            if(!response.ok) {
                throw new Error('Fetch: Response not ok');
            }
            console.log(`Fetch matStorage OK`);
            return response.json();
        })
        .then(data => {
            data.forEach(element => {
                inventory[element.id] = {
                    'count' : element.count,
                    'category' : element.category,
                    'binding' : element.binding,
                }
            })
            setStorage('Inventory', inventory);
        })
        .catch(error => {
            console.error('Error:', error);
        })
}

export {
    fetchMatStorage,
    fetchPermissions
}