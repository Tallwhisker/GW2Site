//const authToken = '?access_token=A3654FC9-D58C-4042-90A4-DADEC5420D9C27304699-B424-4768-8444-D84564C142A7';
import { getStorageArray, getStorageObject, getStorageString } 
from "./modules/storageHandler.js";

import { fetchMatStorage, fetchPermissions } 
from "./modules/dataHandler.js";




// const authToken = getStorageString('authToken');
// const authPermissions = getStorageString('tokenPermissions');
// const inventory = getStorageObject('Inventory');
// const wallet = getStorageArray('Wallet');



    //Define buttons
const permissionTrigger = document.getElementById('fetchToken');
permissionTrigger.addEventListener('click', fetchPermissions);

const matStorageTrigger = document.getElementById('fetchMatStorage');
matStorageTrigger.addEventListener('click', fetchMatStorage);

const downloadData = document.getElementById('download');
downloadData.addEventListener('click', downloadStorage);

const dataOutput = document.getElementById('dataoutput');

function downloadStorage() {
    let key = window.prompt('LocalStorage Key');
    let data = localStorage.getItem(key)
    dataOutput.style.display = 'block';
    dataOutput.innerHTML = data;
}





