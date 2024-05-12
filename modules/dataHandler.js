import { getStorageArray, getStorageObject, getStorageString, setStorage } 
from "./storageHandler.js";

const apiUrl = 'https://api.guildwars2.com/v2/';
const authToken = getStorageString('authToken');

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
            console.log(`Fetched Material Storage`);
            return response.json();
        })
        .then(data => {
            categorySorter(data);
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

    //Sort materialStorage into category - should only run if 'Category' key does not exist
async function categorySorter(data) {
    if(!localStorage.getItem('Categories')) {
        let categories = {5:[], 6:[], 29:[], 30:[], 37:[], 38:[], 46:[], 49:[], 50:[]};
        data.forEach(item => {
            categories[item.category].push(item.id);
        })
        setStorage('Categories', categories);
    }
}


    //Fetch item info 
// async function fetchItemInfo(array) {}


export {
    fetchMatStorage,
    fetchPermissions
}