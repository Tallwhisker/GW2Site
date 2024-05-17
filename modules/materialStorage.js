import { 
    authToken,
    permissionInventory,
    hideTabs
} from "../main.js";

import { 
    setStorage,
    getStorageObject
 } from "./storageHandler.js";

import {
    matStorageCategoryNames
} from '../data/itemInfo.js';

import { 
    itemInfoParser 
} from './dataHandler.js'


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
};



//Fetch material storage and write to materialStorage

async function fetchMatStorage() {

    //Check for permissions
if(permissionInventory === 1 && localStorage.getItem('itemInfo')) {

    const itemInfo = getStorageObject('itemInfo');

    fetch(`https://api.guildwars2.com/v2/account/materials?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
            throw new Error(`Fetch Error`);
        }
        console.log(`Fetched Material Storage`);
        return response.json();
    })
    .then(data => {
        const newItems = [];
        const matStorageCategories = {};
        const materialStorage = {}
        data.forEach(element => {
            let elID = (element.id);
            let elCat = (element.category);
            if(!matStorageCategories[elCat]) {
                matStorageCategories[elCat] = [];
            } 
            matStorageCategories[elCat].push(elID);
            
            materialStorage[elID] = {
                'count' : element.count
            }

            if(!itemInfo[element.id]) {
                newItems.push(elID);
            }

    })
        let stupidSoybeanIndex = matStorageCategories[49].indexOf(97105, 0);
        let stupidSoybean = matStorageCategories[49].splice(stupidSoybeanIndex, 1);

        itemInfoParser(newItems);
        console.log(`fetchmat: ${newItems.length} items -> infoParser`)
        setStorage('materialStorage', materialStorage);
        setStorage('matStorageCategories', matStorageCategories);
    })
    .catch(error => {
        console.error(error);
    })
    setTimeout(populateMatStorage, 2000);
}
};


//Function for populating material storage tab
async function populateMatStorage() {

    const itemInfo = getStorageObject('itemInfo');
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
    
                //Imagecheck
                let iconURL = itemInfo[item].localIcon ? 
                 `./icons/${itemInfo[item].localIcon}` : itemInfo[item].webIcon;
    
                //Create IMG Element for item image
                newItemImg.setAttribute('class', 'itemImg');
                newItemImg.setAttribute('src', iconURL);
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
    console.log('Populated Material tab');

};



export { 
    populateMatStorage,
    fetchMatStorage
}