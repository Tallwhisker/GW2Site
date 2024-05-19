
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

// import {
//     itemInformationStart
// } from "./modules/dataHandler.js"

import { 
    populateBank, 
    fetchBank 
} from "./modules/bankStorage.js";

import { 
    populateMatStorage, 
    fetchMatStorage 
} from "./modules/materialStorage.js";

import {
    popCharTabOnLoad,
    fetchCharactersList
} from "./modules/characterBags.js"


let authToken = getStorageString('authToken');
let permissionInventory = 0;
let permissionCharacters = 0;

//Get API key information
async function getNewToken() {
    let getToken = window.prompt(
    `Insert API Key. This will RESET inventory data.
     "inventories" and "characters" permissions needed`);
     if(getToken.length > 70) {
        authToken = getToken;
        localStorage.setItem('authToken', getToken);
        setStorage('itemInfo', baseItemInfo);
        fetchToStorage('tokeninfo', 'tokenInfo');
        fetchToStorage('account', 'accountInfo');
        localStorage.removeItem('materialStorage');
        localStorage.removeItem('bankStorage');
        // localStorage.removeItem('Characters');
        setTimeout(displayAccountName, 1000);
        setTimeout(checkPermissions, 1000);
        setTimeout(fetchBank,2000);
        setTimeout(fetchMatStorage,2000);
        setTimeout(fetchCharactersList,2000);

    } else {alert('Input error, min length is 70')};
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
    if(permissionsArray.includes('account') &&
    permissionsArray.includes('characters')
    ) {
        permissionCharacters = 1;
    }
}

//When window is loaded, check this
window.onload = function onLoadFunction() {
    console.log(`Autoload trigger`);
    if(!localStorage.getItem('aboutSeen')) {
        projectInfoDiv.style.display = 'block';
    }
    if(localStorage.getItem('accountInfo')) {
        displayAccountName();
    };

    if(localStorage.getItem('tokenInfo')) {
        checkPermissions();
    };
    populateInventories();
};

async function populateInventories() {

    if(localStorage.getItem('materialStorage') &&
    permissionInventory === 1) {
        populateMatStorage();
    };

    if(localStorage.getItem('bankStorage') &&
    permissionInventory === 1) {
        populateBank();
    };

    if(localStorage.getItem('characters') &&
    permissionCharacters === 1 ) {
        popCharTabOnLoad();
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
    fetchCharactersList();
    status
});

    //Button to trigger localStorage export
// const downloadData = document.getElementById('download');
// downloadData.addEventListener('click', downloadStorage);



    //Button to show aboutProject
const aboutProjectTrigger = document.getElementById('aboutProject');
const projectInfoDiv = document.getElementById('projectInfo');

//Triggers to show and hide the aboutProject
projectInfoDiv.addEventListener('click', () => {
    projectInfoDiv.style.display = 'none';
    localStorage.setItem('aboutSeen', 'seen');
});
aboutProjectTrigger.addEventListener('click', () =>
    projectInfoDiv.style.display = 'block');






//Item tab controls

//Hide all tabs
async function hideTabs() {
    materialStorageTab.style.display = 'none';
    bankTab.style.display = 'none';
    charInventoryTab.style.display = 'none';
    dataDownloadTab.style.display = 'none';
};




    //Datadownload Tab
// const dataDownloadTab = document.getElementById('dataDownloadTab');

// downloadData.addEventListener('click', showDownloadTab);
//     async function showDownloadTab() {
//         hideTabs();
//         dataDownloadTab.style.display = 'block';
// };



//Anonymous speciality function trigger for custom data manipulation
// document.getElementById('functionTrigger').addEventListener('click', fetchCharactersList)

// document.getElementById('functionTrigger').addEventListener('click',() => {
//     let newURL = [];
//     const itemInfo = getStorageObject('itemInfo');
//     console.log('linkFixer go!')
//     for (let obj in itemInfo) {
//         console.log(obj);
//         if(itemInfo[obj].webIcon && !itemInfo[obj].localIcon) {
//             itemInfo[obj].localIcon = itemInfo[obj].webIcon.split('/').pop();
//         } 
        
//     }
//     setStorage('itemInfo', itemInfo);
//     console.log('LinkFixer done');
// })

export { 
    displayAccountName,
    permissionInventory,
    permissionCharacters,
    authToken,
    hideTabs,
    populateInventories
};


// const kittyCatImg = document.getElementById('kittycat');
// let kittyJumpInt;
// const kittyJump = setInterval(() => {
//     kittyJumpInt = Math.ceil(Math.random() * 20);


// },);

// const screenMax700 = window.matchMedia('(max-width: 600px)');