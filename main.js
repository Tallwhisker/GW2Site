
import { 
    getStorageString, 
    downloadStorage, 
    fetchToStorage,
    setStorage, 
    getStorageObject
} from "./modules/storageHandler.js";

import { 
    baseItemInfo 
} from "./data/itemInfo.js";

import { 
    populateBank, 
    fetchBank 
} from "./modules/bankStorage.js";

import { 
    populateMatStorage, 
    fetchMatStorage 
} from "./modules/materialStorage.js";

let authToken = getStorageString('authToken');
let permissionInventory = 0;

//Get API key information
async function getNewToken() {
    let getToken = window.prompt(
    `Insert API Key. This will RESET inventory data.
     "Inventories" and "characters" permissions needed`);
     if(getToken.length > 70) {
        authToken = getToken;
        localStorage.setItem('authToken', getToken);
        fetchToStorage('tokeninfo', 'tokenInfo');
        fetchToStorage('account', 'accountInfo');
        localStorage.removeItem('materialStorage');
        localStorage.removeItem('bankStorage');
        // localStorage.removeItem('Characters');
        setTimeout(displayAccountName, 3000);
        setTimeout(checkPermissions, 3000);
    } else {alert('No token input')};
};

//Check permissions
async function checkPermissions() {
    let tokenInfo = getStorageObject('tokenInfo');
    let permissionsArray = tokenInfo.permissions;
    if(permissionsArray.includes('account') &&
    permissionsArray.includes('inventories')
    ) {
        permissionInventory = 1;
    }
}

//When window is loaded, check this
window.onload = function onLoadFunction() {
    // console.log(`Autoload trigger`);
    if(localStorage.getItem('accountInfo')) {
        displayAccountName();
    }
    if(localStorage.getItem('tokenInfo')) {
        checkPermissions();
    }
    // if(localStorage.getItem('characterBags')) {
        //     populateCharacterBagsTab();
    // }
    if(!localStorage.getItem('itemInfo')) {
        setStorage('itemInfo', baseItemInfo);
    }
    setTimeout(populateInventories, 1000);
};

async function populateInventories() {
    console.log(permissionInventory)

    if(localStorage.getItem('materialStorage') &&
    permissionInventory === 1) {
        populateMatStorage();
    };
    if(localStorage.getItem('bankStorage') &&
    permissionInventory === 1) {
        populateBank();
    };
}


//Control panel buttons for MODULE FUNCTIONS

    //if accountInfo exists, display after Control panel
const accountNameSpan = document.getElementById('accountName');
    async function displayAccountName() {
        if(localStorage.getItem('accountInfo')) {
            let accOjb = getStorageObject('accountInfo');
            accountNameSpan.innerHTML = ` - ${accOjb.name}`
        } else {
            accountNameSpan.innerHTML = '';
        }
    };

    //Button to trigger API Key function
const permissionTrigger = document.getElementById('fetchToken');
permissionTrigger.addEventListener('click', getNewToken);

    //Button to trigger inventory fetch
const matStorageTrigger = document.getElementById('updateInventory');
matStorageTrigger.addEventListener('click', () => {
    fetchMatStorage();
    fetchBank();
});

    //Button to trigger localStorage export
const downloadData = document.getElementById('download');
downloadData.addEventListener('click', downloadStorage);

    //Button to show aboutProject
const aboutProjectTrigger = document.getElementById('aboutProject');
const projectInfoDiv = document.getElementById('projectInfo');

//Triggers to show and hide the aboutProject
projectInfoDiv.addEventListener('click', () =>
    projectInfoDiv.style.display = 'none');
aboutProjectTrigger.addEventListener('click', () =>
    projectInfoDiv.style.display = 'block');






//Item tab controls

//Hide all tabs
async function hideTabs() {
    materialStorageTab.style.display = 'none';
    bankTab.style.display = 'none';
    charInventoryTab.style.display = 'none';
    dataDownloadTab.style.display = 'none';
    document.getElementById('categoryNav').style.display = 'none';
};


    //Character Inventory tab
const charInventoryTab = document.getElementById('charInventoryTab');
const characterInvBtn = document.getElementById('charInventoryButton');

characterInvBtn.addEventListener('click', showInventoryTab);
    async function showInventoryTab() {
        if(localStorage.getItem('characters')) {
            hideTabs();
            charInventoryTab.style.display = 'block';
        } 
        else {
            alert('No local character data, API Key required');
            return;
        }
};

    //Datadownload Tab
const dataDownloadTab = document.getElementById('dataDownloadTab');

downloadData.addEventListener('click', showDownloadTab);
    async function showDownloadTab() {
        hideTabs();
        dataDownloadTab.style.display = 'block';
};



//Anonymous speciality function trigger for custom data manipulation

document.getElementById('functionTrigger').addEventListener('click',() => {
    let newURL = [];
    const itemInfo = getStorageObject('itemInfo');
    console.log('linkFixer go!')
    for (let obj in itemInfo) {
        console.log(obj);
        if(itemInfo[obj].webIcon && !itemInfo[obj].localIcon) {
            itemInfo[obj].localIcon = itemInfo[obj].webIcon.split('/').pop();
        } 
        
    }
    setStorage('itemInfo', itemInfo);
    console.log('LinkFixer done');
})

export { 
    displayAccountName,
    permissionInventory,
    authToken,
    hideTabs
};