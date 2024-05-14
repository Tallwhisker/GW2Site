import { getStorageArray, getStorageObject, getStorageString, setStorage } 
from "./storageHandler.js";

// import { matStorageIds, matStorageNames } 
// from "../data/categories.json"

const apiUrl = 'https://api.guildwars2.com/v2/';
const authToken = getStorageString('authToken');

//Check API key and/or request info

async function fetchToStorage(target, key) {
    // console.log('FetchToStorage triggered');
    fetch(`https://api.guildwars2.com/v2/${target}?access_token=${authToken}`)
        .then(response => {
            if(!response.ok) {
            throw new Error('FetchReturn Error');
        }
            console.log(`FetchReturn ${target} OK`);
            return response.json();
        })
        .then(data => {
            console.log(`FetchReturn: Sending ${target} data`);
            setStorage(key, data);
        })
        .catch(error => {
            console.log(error);
        })
}

async function getNewToken() {
    //No token -> ask for token
        let getToken = window.prompt('Insert new API Key. This will ->RESET<- any stored data.');
        localStorage.setItem('authToken', getToken);
        // setStorage('authToken', getToken);
        fetchToStorage('tokeninfo', 'tokenInfo');
        fetchToStorage('account', 'accountInfo');

    //Token permissions
    // fetch(`${apiUrl}tokeninfo?access_token=${authToken}`)
    // .then(response => {
    //     if(!response.ok) {
    //         throw new Error('Fetch: Response not ok');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     setStorage('Permissions', data);
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // })
}

    //Fetch material storage and write to inventory

async function fetchMatStorage() {
    let inventory = getStorageObject('Inventory');
        fetch(`${apiUrl}account/materials?access_token=${authToken}`)
        .then(response => {
            if(!response.ok) {
                throw new Error(`Fetch Error`);
            }
            console.log(`Fetched Material Storage`);
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
            categorySorter(data);
        })
        .catch(error => {
            console.error(error);
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
    getNewToken
    // fetchReturn
}