
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

const dataOutput = document.getElementById('dataoutput');


    //Create Material Storage categories
const materialStorageTab = document.getElementById('materialStorage');
// materialStorageTab.addEventListener('onload', populateMatStorage);
materialStorageTab.addEventListener('click', populateMatStorage);
async function populateMatStorage() {
    
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
                    newItemImg.setAttribute('src', './icons/63265.png');
                    document.getElementById(item).appendChild(newItemImg);

                    nameP.setAttribute('class', 'itemName');
                    nameP.innerHTML = 'nameNotFound';
                    document.getElementById(item).appendChild(nameP);

                    countP.setAttribute('class', 'itemAmount');
                    countP.innerHTML = inventory[item].count;
                    document.getElementById(item).appendChild(countP);


                })
            })
}

