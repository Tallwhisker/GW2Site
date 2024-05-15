
import { getStorageArray, getStorageObject, getStorageString, downloadStorage, setStorage } 
from "./modules/storageHandler.js";

import { fetchMatStorage, getNewToken } 
from "./modules/dataHandler.js";

import { itemInfo, matStorageCategoryNames } 
from "./data/itemInfo.js";


// const authToken = getStorageString('authToken');
// const authPermissions = getStorageString('tokenPermissions');

// const wallet = getStorageArray('Wallet');



//Control panel buttons for MODULE FUNCTIONS

    //if accountInfo exists, display after Control panel
const accountNameSpan = document.getElementById('accountName');
    async function displayAccountName() {
        let accOjb = getStorageObject('accountInfo');
        accountNameSpan.innerHTML = ` - ${accOjb.name}`
    }

    //Button to trigger API Key function
const permissionTrigger = document.getElementById('fetchToken');
permissionTrigger.addEventListener('click', getNewToken);

    //Button to trigger material storage fetch
const matStorageTrigger = document.getElementById('fetchMatStorage');
matStorageTrigger.addEventListener('click', fetchMatStorage);

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

    //Material Storage Tab
const materialStorageTab = document.getElementById('materialStorageTab');
const matStorageBtn = document.getElementById('matStorageButton');

matStorageBtn.addEventListener('click', showMatTab);
    async function showMatTab() {
        if(localStorage.getItem('materialStorage')) {
            hideTabs();
            materialStorageTab.style.display = 'block';
            document.getElementById('categoryNav').style.display = 'block';
        } else {
            alert('No local materialStorage data, API Key required.');
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

    //When material storage tab is loaded, check this
materialStorageTab.onload = populateOnLoad();
    async function populateOnLoad() {
        if(localStorage.getItem('materialStorage')) {
            populateMatStorage();
        } 
        if(!localStorage.getItem('matStorageCategories')) {
            setStorage('matStorageCategories', 
            {6:[], 29:[], 37:[], 46:[], 30:[], 5:[], 49:[], 50:[], 38:[]});
        }
        // if(localStorage.getItem('bank')) {
        //     populateBankTab();
        // }     
        // if(localStorage.getItem('Characters')) {
        //     populateCharactersTab();
        // }
        if(localStorage.getItem('accountInfo')) {
            displayAccountName();
        }
        if(!localStorage.getItem('itemInfo')) {
            setStorage('itemInfo', itemInfo);
        }
}

    //Function for rendering the material storage items
async function populateMatStorage() {

const materialStorage = getStorageObject('materialStorage');
const matStorageCategories = getStorageObject('matStorageCategories');

    //Remove content in the material storage tab
    materialStorageTab.textContent = '';  

    //Primary array iterator for categories
    matStorageCategoryNames.forEach(cat => {
        let categoryID = Object.keys(cat).toString();
        let categoryName = Object.values(cat).toString();

        //Create H2 Elements for category names
        const newH2 = document.createElement('h2');
        newH2.setAttribute('id', `Cat${categoryID}`);
        newH2.innerHTML = categoryName;

        //Set new H2 Element event listener to hide the category grid
        newH2.addEventListener('click', () => {
            let target = document.getElementById(`Grid${categoryID}`);
            if(target.style.display === 'none') {
                target.style.display = 'grid';
            } else {target.style.display = 'none'}
        });
        materialStorageTab.appendChild(newH2);
        
        //Create DIV Elements for category item grid
        const newItemGrid = document.createElement('div');
        newItemGrid.setAttribute('class', 'itemGrid');
        newItemGrid.setAttribute('id', `Grid${categoryID}`);
        materialStorageTab.appendChild(newItemGrid);

        //Set parentDiv to the newly created itemgrid
        let parentDiv = document.getElementById(`Grid${categoryID}`);

        //Secondary array iterator for items
        matStorageCategories[categoryID].forEach(item => {
            const newItemDiv = document.createElement('div');
            const newItemImg = document.createElement('img');
            const nameP = document.createElement('p');
            const countP = document.createElement('p');
            
            //Create DIV Element for item container
            newItemDiv.setAttribute('id', item);
            newItemDiv.setAttribute('class', 'item');
            parentDiv.appendChild(newItemDiv);

            //Create IMG Element for item image
            newItemImg.setAttribute('class', 'itemImg');
            newItemImg.setAttribute('src', `./icons/${itemInfo[item].localIcon}` ?
                `./icons/${itemInfo[item].localIcon}` : itemInfo[item].icon);
            document.getElementById(item).appendChild(newItemImg);

            //Create P Element for item name
            nameP.setAttribute('class', 'itemName');
            nameP.innerHTML = itemInfo[item].name;
            document.getElementById(item).appendChild(nameP);

            //Create P Element for item amount
            countP.setAttribute('class', 'itemAmount');
            countP.innerHTML = materialStorage[item].count;
            document.getElementById(item).appendChild(countP);

        //End secondary iterator
        })

    //End primary iterator
    })

//Function end
}



export { populateMatStorage, displayAccountName };