//const authToken = '?access_token=A3654FC9-D58C-4042-90A4-DADEC5420D9C27304699-B424-4768-8444-D84564C142A7';
import { getStorageArray, getStorageObject, getStorageString } from "./modules/storageHandler.js";





const authToken = getStorageString('authToken');
const authPermissions = getStorageString('Permissions');
const inventory = getStorageObject('Inventory');
// const wallet = getStorageArray('Wallet');



    //Define buttons
const permissionTrigger = document.getElementById('trigToken').addEventListener('click', );
const matStorageTrigger = document.getElementById('trigMatStorage').addEventListener('click', );







