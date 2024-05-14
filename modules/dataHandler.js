import { getStorageArray, getStorageObject, getStorageString, setStorage } 
from "./storageHandler.js";

import { populateMatStorage } 
from "../main.js";

// import { matStorageIds, matStorageNames } 
// from "../data/categories.json"

const apiUrl = 'https://api.guildwars2.com/v2/';
const authToken = getStorageString('authToken');
let inventory = getStorageObject('Inventory');


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
        fetchToStorage('tokeninfo', 'tokenInfo');
        fetchToStorage('account', 'accountInfo');
}

    //Fetch material storage and write to inventory

async function fetchMatStorage() {
        fetch(`${apiUrl}account/materials?access_token=${authToken}`)
        .then(response => {
            if(!response.ok) {
                throw new Error(`Fetch Error`);
            }
            console.log(`Fetched Material Storage`);
            return response.json();
        })
        .then(data => {
            itemInfoParser(data);
            data.forEach(element => {
                if(inventory[element.id]) {
                 
                inventory[element.id]['count'] = element.count,
                inventory[element.id]['category'] = element.category,
                inventory[element.id]['binding'] = element.binding
                } else {
                    inventory[element.id] = {
                        'count' : element.count,
                        'category' : element.category,
                        'binding' : element.binding
                    }
                }

        })
            setStorage('Inventory', inventory);
            // categorySorter(data);
            populateMatStorage();
        })
        .catch(error => {
            console.error(error);
        })
}

    //Sort materialStorage into category - should only run if 'Category' key does not exist
async function categorySorter(data) {
    if(!localStorage.getItem('Categories')) {
        let categories = {6:[], 29:[], 37:[], 46:[], 30:[], 5:[], 49:[], 50:[], 38:[]};
        data.forEach(item => {
            categories[item.category].push(item.id);
        })
        setStorage('Categories', categories);
    }
}


    //Fetch item info 
async function fetchItemInfo(items) {
    let itemInfo = getStorageArray('itemInfo');
    fetch(`https://api.guildwars2.com/v2/items?ids=${items}`)
        .then(response => {
            if(!response.ok) {
            throw new Error('FetchReturn Error');
        }
            console.log(`FetchItemInfo OK`);
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                inventory[item.id]['icon'] = item.icon;
                inventory[item.id]['name'] = item.name;

                itemInfo.push({
                    [item.id] : {
                        'name' : item.name,
                        'icon' : item.icon
                    }
                });

            })
            setStorage('Inventory', inventory);
            setStorage('itemInfo', itemInfo);
        })
        .catch(error => {
            console.log(error);
        })
}


async function itemInfoParser(data) {
    let itemArray = [];
    console.log('itemparser predata')
    data.forEach(item => {
        inventory[item.id].icon ? true : itemArray.push(item.id);
    })
   const interval = setInterval(() => {
        if (itemArray.length === 0) {
            clearInterval(interval);
            console.log('InfoParser Interval stopped')
        } 
        else if(itemArray.length > 50) {
            // itemArray = data.splice(0, 50);
            fetchItemInfo(itemArray.splice(0, 50).toString());
            // itemArray.splice(0, itemArray.length);
        } 
        else {
            fetchItemInfo(itemArray.splice(0, itemArray.length).toString());
        }
    },10000)

    // data.forEach(item => {
    //     if(!inventory[item.id].icon){
    //         itemArray.push(item.id)
    //         i --;
    //     }
    //     if(itemArray.length >= 60 || i === 0) {
    //         console.log(itemArray.toString());
    //         // setTimeout(fetchItemInfo, 10000, itemArray.toString());
    //         itemArray.splice(0, itemArray.length);
    //     }
    // })
    // fetchItemInfo(itemArray.toString());
}



export {
    fetchMatStorage,
    getNewToken
    // fetchReturn
}