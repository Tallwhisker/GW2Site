import { 
    getStorageString, 
    fetchToStorage,
    getStorageObject
} from "./modules/storageHandler.js";

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
} from "./modules/characterBags.js";

import {
    coldStartItemInfo
} from "./modules/dataHandler.js";

import {
    startSearch
} from "./modules/searchModule.js";


//Set version of itemInfo database (in ./data/itemInfo.js)
const localVersion = 1;

//Set up initial values for module export
let authToken = getStorageString('authToken');
let permissionInventory = 0;
let permissionCharacters = 0;


//Button to trigger API Key function
const permissionTrigger = document.getElementById('fetchToken');
permissionTrigger.addEventListener('click', getNewToken);


//Menu
const mainMenu = document.getElementById('mainMenu');
const mainMenuList = document.getElementById('mainMenuList');

mainMenu.addEventListener('mouseover', showMenu);
mainMenuList.addEventListener('mouseover', showMenu);

function showMenu() {
    mainMenuList.style.display = 'block';
};

mainMenu.addEventListener('mouseout', hideMenu);
mainMenuList.addEventListener('mouseout', hideMenu);

function hideMenu() {
    mainMenuList.style.display = 'none';
};

//Function to ask for API key, then initialize setup
async function getNewToken() {
    let getToken;
    //Ask user for their API key via prompt
    try {
        getToken = window.prompt(
        `Insert API Key. This will reset all stored data.
        "inventories" and "characters" permissions needed`);
    }
    catch {
        console.error();
    };

    //If provided key matches length
    if(getToken.length > 70) {
        //Clear all stored information
        localStorage.clear();

        //Set new key and fetch basic data structures
        authToken = getToken;
        localStorage.setItem('authToken', getToken);
        dataVersion();
        fetchToStorage('tokeninfo', 'tokenInfo');
        fetchToStorage('account', 'accountInfo');
        localStorage.setItem('aboutSeen', 'seen');

        //Delayed start for data download.
        setTimeout(displayAccountName, 1000);
        setTimeout(checkPermissions, 1000);
        setTimeout(fetchBank,3000);
        setTimeout(fetchMatStorage,3000);
        setTimeout(fetchCharactersList,3000);
    } 
    else {
        //If no key or incorrect length, show error.
        alert('Input error, min length is 70');
    };
};


//Function to delete all localStorage data
document.getElementById('resetData').addEventListener('click', () => {
   let confirmDelete = confirm('Are you sure you want to reset everything?');
   if(confirmDelete) {
        localStorage.clear();
   };
});


//Check permissions and set exported permission signals
async function checkPermissions() {

    //Get stored permissions and extract them
    let tokenInfo = getStorageObject('tokenInfo');
    let permissionsArray = tokenInfo.permissions;

    //Check and set inventory signal
    if(permissionsArray.includes('account') &&
    permissionsArray.includes('inventories')
    ) {
        permissionInventory = 1;

        //Check for updated itemInfo DB
        dataVersion();
    };

    //Check and set characters signal
    if(permissionsArray.includes('account') &&
    permissionsArray.includes('characters')
    ) {
        permissionCharacters = 1;
    };
};


//When window is loaded, run these things.
window.onload = function onLoadFunction() {

    //If you haven't seen the about window, show it.
    if( ! localStorage.getItem('aboutSeen')) {
        projectInfoDiv.style.display = 'block';
    };

    //If there's an account name, show it.
    if(localStorage.getItem('accountInfo')) {
        displayAccountName();
    };

    //If there's permission info, check it.
    if(localStorage.getItem('tokenInfo')) {
        checkPermissions();
    };

    //Call for inventory creation
    populateInventories();
};


//Check if there's stored data & permissions and if so, create inventories.
async function populateInventories() {

    if(localStorage.getItem('matStorageCategories') &&
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
};


//Define the accountname output element
const accountNameSpan = document.getElementById('accountName');

//Function to extract account name from storage and display it.
async function displayAccountName() {
    if(localStorage.getItem('accountInfo')) {
        let accOjb = getStorageObject('accountInfo');
        accountNameSpan.innerHTML = ` - ${accOjb.name}`;
    } 
    else {
        accountNameSpan.innerHTML = '';
    };
};


//Define button to trigger inventory request
const matStorageTrigger = document.getElementById('updateInventory');

matStorageTrigger.addEventListener('click', () => {

    if(authToken) {
        fetchMatStorage();
        fetchBank();
        fetchCharactersList();
    }
    else {
        getNewToken();
    };
});


//Button to show aboutProject panel
const aboutProjectTrigger = document.getElementById('aboutProject');

aboutProjectTrigger.addEventListener('click', () => {
    projectInfoDiv.style.display = 'block';
});


//Trigger to hide the aboutProject panel
const projectInfoDiv = document.getElementById('projectInfo');

//When you hide the panel, set it's value to seen
projectInfoDiv.addEventListener('click', () => {
    projectInfoDiv.style.display = 'none';
    localStorage.setItem('aboutSeen', 'seen');
});



//Hide all tabs, called from inventory Modules
async function hideTabs() {
    materialStorageTab.style.display = 'none';
    bankTab.style.display = 'none';
    charInventoryTab.style.display = 'none';
    searchTab.style.display = 'none';
};

//Function to reset the itemInfo data if the base data is newer.
function dataVersion() {

    let dataV = localStorage.getItem('dataVersion');
    if(dataV < localVersion) {
        coldStartItemInfo();
        localStorage.setItem('dataVersion', localVersion);
        console.log('itemInfo data reset to new version.');
    };
};

export { 
    displayAccountName,
    permissionInventory,
    permissionCharacters,
    authToken,
    hideTabs,
    populateInventories
};

