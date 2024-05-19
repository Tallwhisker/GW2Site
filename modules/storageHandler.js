import { 
    authToken 
} from "../main.js";


//Write localStorage data to parameter 'key' and input 'value'

function setStorage (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
// console.log(`Writing local: ${key}`);
};

//Fetch target info and send to localStorage
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
    })
};

//Get localStorage from input 'key' -> return as OBJECT

function getStorageObject (key) {
    if(!localStorage.getItem(key)) {
        console.log(`No local data for ${key}`);
        return {};
    }
    let tempData = localStorage.getItem(key);
    // console.log(`Retrieving Object: ${key}`);
    return JSON.parse(tempData);
};

//Get localStorage from input 'key' -> return as screwed up ARRAY

function getStorageArray (key) {
    if(!localStorage.getItem(key)) {
        console.log(`No local data for ${key}`);
        return [];
    }
    let tempData = localStorage.getItem(key);
    // console.log(`Retrieving Array: ${key}`);
    return JSON.parse(tempData);
};

//Get localStorage from input 'key' -> return as STRING

function getStorageString (key) {
    if(!localStorage.getItem(key)) {
        console.log(`No local data for ${key}`);
        return '';
    }
    // console.log(`Retrieving String: ${key}`);
    return localStorage.getItem(key).toString();
};

// //Output the selected 'key' to the dataOutput element
// const dataOutput = document.getElementById('dataoutput');
function downloadStorage() {
    let storageKey = window.prompt('LocalStorage Key');
    let downloadData = localStorage.getItem(storageKey)
    dataOutput.style.display = 'block';
    dataOutput.innerHTML = downloadData;
};

export {
    setStorage,
    fetchToStorage,
    getStorageObject,
    getStorageString,
    getStorageArray, 
    downloadStorage
};