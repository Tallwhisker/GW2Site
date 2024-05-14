
import { getStorageArray, getStorageObject, getStorageString, downloadStorage } 
from "./modules/storageHandler.js";

import { fetchMatStorage, getNewToken } 
from "./modules/dataHandler.js";

import { matStorageIds, matStorageNames } 
from "./data/matStorageCategory.js";


// const authToken = getStorageString('authToken');
// const authPermissions = getStorageString('tokenPermissions');
const inventory = getStorageObject('Inventory');
// const wallet = getStorageArray('Wallet');



    //Define buttons
const permissionTrigger = document.getElementById('fetchToken');
permissionTrigger.addEventListener('click', getNewToken);

const matStorageTrigger = document.getElementById('fetchMatStorage');
matStorageTrigger.addEventListener('click', fetchMatStorage);

const downloadData = document.getElementById('download');
downloadData.addEventListener('click', downloadStorage);





    //Create Material Storage categories

    
    
    
    //Material Storage Tab
const materialStorageTab = document.getElementById('materialStorageTab');
const matStorageBtn = document.getElementById('matStorageButton');
matStorageBtn.addEventListener('click', showMatTab);
async function showMatTab() {
    if(localStorage.getItem('Inventory')) {
        hideTabs();
        materialStorageTab.style.display = 'block';
        document.getElementById('categoryNav').style.display = 'block';
    } else {
        alert('No local inventory data, API Key required.');
        return;
    }
}

    //Bank tab
const bankTab = document.getElementById('bankTab');
const bankBtn = document.getElementById('bankButton');

bankBtn.addEventListener('click', showBankTab);
async function showBankTab() {
    if(localStorage.getItem('bank')) {
        hideTabs();
    bankTab.style.display = 'block';
    }
    else {
    alert('No local bank data, API Key required');
    return;
}
}

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
}

    //Datadownload Tab
const dataDownloadTab = document.getElementById('dataDownloadTab');

downloadData.addEventListener('click', showDownloadTab);
async function showDownloadTab() {
    hideTabs();
    dataDownloadTab.style.display = 'block';
}



//Hide all tabs
async function hideTabs(trigger) {
    materialStorageTab.style.display = 'none';
    bankTab.style.display = 'none';
    charInventoryTab.style.display = 'none';
    dataDownloadTab.style.display = 'none';
    document.getElementById('categoryNav').style.display = 'none';
}
    
materialStorageTab.onload = populateOnLoad();
async function populateOnLoad() {
    if(localStorage.getItem('Inventory')) {
        populateMatStorage();
    } 
    // if(localStorage.getItem('bank')) {
    //     populateMatStorage();
    // }     
    // if(localStorage.getItem('Characters')) {
    //     populateMatStorage();
    // } 
}
async function populateMatStorage() {

    materialStorageTab.textContent = '';  

    //Make the category H2's
    matStorageNames.forEach(cat => {
        let category = Object.keys(cat).toString();
        let name = Object.values(cat).toString();

        const newH2 = document.createElement('h2');
        newH2.setAttribute('id', `Cat${category}`);
        newH2.innerHTML = name;
        materialStorageTab.appendChild(newH2);
        
        // let parent = document.getElementById(`Cat${category}`);
        const newItemGrid = document.createElement('div');
        newItemGrid.setAttribute('class', 'itemGrid');
        newItemGrid.setAttribute('id', `Grid${category}`);
        materialStorageTab.appendChild(newItemGrid);
        // let subParent = parent.querySelector('div');
        let parentDiv = document.getElementById(`Grid${category}`);


            matStorageIds[category].forEach(item => {
                const newItemDiv = document.createElement('div');
                const newItemImg = document.createElement('img');
                const nameP = document.createElement('p');
                const countP = document.createElement('p');
                
                newItemDiv.setAttribute('id', item);
                newItemDiv.setAttribute('class', 'item');
                parentDiv.appendChild(newItemDiv);

                newItemImg.setAttribute('class', 'itemImg');
                newItemImg.setAttribute('src', inventory[item].icon ?
                 inventory[item].icon : './icons/63265.png');
                document.getElementById(item).appendChild(newItemImg);

                nameP.setAttribute('class', 'itemName');
                nameP.innerHTML = inventory[item].name;
                document.getElementById(item).appendChild(nameP);

                countP.setAttribute('class', 'itemAmount');
                countP.innerHTML = inventory[item].count;
                document.getElementById(item).appendChild(countP);


                })
            })
}



export { populateMatStorage };