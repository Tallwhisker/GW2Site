


//Write localStorage data to parameter 'key' and input 'value'

function setStorage (key, value) {
localStorage.setItem(key, JSON.stringify(value));
console.log(`Writing local: ${key}`);
}


//Get localStorage from input 'key' -> return as OBJECT

function getStorageObject (key) {
    if(!localStorage.getItem(key)) {
        console.log(`No local data for ${key}`);
        return {};
    }
    let tempData = localStorage.getItem(key);
    console.log(`Retrieving Object: ${key}`);
    return JSON.parse(tempData);
}

//Get localStorage from input 'key' -> return as screwed up ARRAY

function getStorageArray (key) {
    if(!localStorage.getItem(key)) {
        console.log(`No local data for ${key}`);
        return [];
    }
    let tempData = localStorage.getItem(key);
    console.log(`Retrieving Array: ${key}`);
    return JSON.parse(tempData);
}

//Get localStorage from input 'key' -> return as STRING

function getStorageString (key) {
    if(!localStorage.getItem(key)) {
        console.log(`No local data for ${key}`);
        return '';
    }
    console.log(`Retrieving String: ${key}`);
    return localStorage.getItem(key).toString();
}

//Output the selected 'key' to the dataOutput element
const dataOutput = document.getElementById('dataoutput');
function downloadStorage() {
    let storageKey = window.prompt('LocalStorage Key');
    let downloadData = localStorage.getItem(storageKey)
    dataOutput.style.display = 'block';
    dataOutput.innerHTML = JSON.parse(downloadData);
}

export {setStorage, getStorageArray, getStorageObject,
     getStorageString, downloadStorage};