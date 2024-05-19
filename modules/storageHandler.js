import { 
    authToken 
} from "../main.js";


//Write localStorage data to parameter inputs.
function setStorage (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
};


//Flexible fetch and send to storage directly. Input target and key value for setStorage.
async function fetchToStorage(target, key) {
    fetch(`https://api.guildwars2.com/v2/${target}?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
        throw new Error('FetchReturn Error');
    }
        return response.json();
    })
    .then(data => {
        setStorage(key, data);
    })
    .catch(error => {
        console.log(error);
    });
};


//Get localStorage from input 'key' and return OBJECT
function getStorageObject (key) {
    if(!localStorage.getItem(key)) {
        console.log(`No local data for ${key}`);
        return {};
    };
    let tempData = localStorage.getItem(key);
    return JSON.parse(tempData);
};


//Get localStorage from input 'key' and return ARRAY
function getStorageArray (key) {
    if(!localStorage.getItem(key)) {
        console.log(`No local data for ${key}`);
        return [];
    };
    let tempData = localStorage.getItem(key);
    return JSON.parse(tempData);
};


//Get localStorage from input 'key' and return STRING
function getStorageString (key) {
    if(!localStorage.getItem(key)) {
        console.log(`No local data for ${key}`);
        return '';
    };
    return localStorage.getItem(key).toString();
};


export {
    setStorage,
    fetchToStorage,
    getStorageObject,
    getStorageString,
    getStorageArray
};