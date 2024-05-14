
import { getStorageArray, getStorageObject, getStorageString, downloadStorage } 
from "./modules/storageHandler.js";

import { fetchMatStorage, getNewToken } 
from "./modules/dataHandler.js";




// const authToken = getStorageString('authToken');
// const authPermissions = getStorageString('tokenPermissions');
// const inventory = getStorageObject('Inventory');
// const wallet = getStorageArray('Wallet');



    //Define buttons
const permissionTrigger = document.getElementById('fetchToken');
permissionTrigger.addEventListener('click', getNewToken);

const matStorageTrigger = document.getElementById('fetchMatStorage');
matStorageTrigger.addEventListener('click', fetchMatStorage);

const downloadData = document.getElementById('download');
downloadData.addEventListener('click', downloadStorage);

const dataOutput = document.getElementById('dataoutput');


