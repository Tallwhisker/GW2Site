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
    itemInformationStart,
    itemNameChecker
} from './dataHandler.js';


//Material Storage Tab & button
const materialStorageTab = document.getElementById('materialStorageTab');
const matStorageBtn = document.getElementById('matStorageButton');

//Function to hide everyone then show itself
matStorageBtn.addEventListener('click', showMatTab);
    async function showMatTab() {
            hideTabs();
            materialStorageTab.style.display = 'block';
};


//Fetch the material storage and format data
async function fetchMatStorage() {
    
    //Check for permissions because function can be triggered manually
    if(permissionInventory === 1 && localStorage.getItem('itemInfo')) {
    const itemInfo = getStorageObject('itemInfo');
    const newItems = [];

    fetch(`https://api.guildwars2.com/v2/account/materials?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
            throw new Error(`Fetch Error`);
        }
        return response.json();
    })
    .then(data => {
        const matStorageCategories = {};
        const materialStorage = {}
        data.forEach(element => {
            let elID = (element.id);
            let elCat = (element.category);
            if(!matStorageCategories[elCat]) {
                matStorageCategories[elCat] = [];
            }; 
            matStorageCategories[elCat].push(elID);
            
            materialStorage[elID] = {
                'count' : element.count
            };

            if(!itemInfo[element.id]) {
                newItems.push(elID);
            };

    });
        //Overwrite any stored data with new data
        setStorage('materialStorage', materialStorage);
        setStorage('matStorageCategories', matStorageCategories);
    })
    .catch(error => {
        console.error(error);
    });

    setTimeout(populateMatStorage, 1000);

    //If any unknown items are found, send them to dataHandler
    if(newItems.length > 0) {
        console.log(`MatStorageModule found ${newItems.length} new items`)
        itemInformationStart(newItems);
    };
}
};


//Main function to populate the Material Storage tab with items
async function populateMatStorage() {

    //Get current item data
    const itemInfo = getStorageObject('itemInfo');
    const materialStorage = getStorageObject('materialStorage');
    const matStorageCategories = getStorageObject('matStorageCategories');
    
    //Primary iterator for categories
    matStorageCategoryNames.forEach(cat => {
        let categoryID = Object.keys(cat).toString();

        //Get H2 category element for category names
        let newH2 = document.getElementById(`Cat${categoryID}`);
        
        //Check if the itemGrid already exists, else make a new one.
        let matGridExists = document.getElementById(`Grid${categoryID}`);
        if(!matGridExists) {

            //Set category H2 element event listener to hide the category grid
            newH2.addEventListener('click', () => {
                let target = document.getElementById(`Grid${categoryID}`);
                if(target.style.display === 'none') {
                    target.style.display = 'grid';
                } else {target.style.display = 'none'}
            });
            
            //Create DIV Elements for category item grid
            const newItemGrid = document.createElement('div');
            newItemGrid.setAttribute('class', 'itemGrid');
            newItemGrid.setAttribute('id', `Grid${categoryID}`);
            materialStorageTab.appendChild(newItemGrid);
            newH2.insertAdjacentElement('afterend', newItemGrid);
        };
        
        //Set parentDiv to the itemGrid then reset it
        let parentDiv = document.getElementById(`Grid${categoryID}`);
        parentDiv.innerHTML = '';

        //Secondary iterator for items. Iterator variable to prevent the Soybean incident.
        let i = 0; 
        matStorageCategories[categoryID].forEach(item => {
            const newItemDiv = document.createElement('div');
            const newItemImg = document.createElement('img');
            const nameP = document.createElement('p');
            const countP = document.createElement('p');
            
            //Create DIV Element for item container
            newItemDiv.setAttribute('class', 'item');
            newItemDiv.setAttribute('id', `MST${item}i${i}`);
            parentDiv.appendChild(newItemDiv);

            //Imagecheck because some items don't have an icon.
            //Alternatively they have a web-hosted icon and not a local one.
            let iconURL ;
            if(itemInfo[item]){
                if(itemInfo[item].localIcon) {
                    iconURL = `./icons/${itemInfo[item].localIcon}`
                } else if (itemInfo[item].webIcon) {
                    iconURL = itemInfo[item].webIcon
                };
            };

            //Create IMG Element for item image
            //If no icon from above check, Give 'em the spaghet.
            newItemImg.setAttribute('class', 'itemImg');
            newItemImg.setAttribute('src', iconURL ? iconURL : './icons/spaghet.png');
            document.getElementById(`MST${item}i${i}`).appendChild(newItemImg);

            //Create P Element for item name
            nameP.setAttribute('class', 'itemName');
            nameP.innerHTML = itemNameChecker(item); //Function in dataHandler module
            document.getElementById(`MST${item}i${i}`).appendChild(nameP);

            //Create P Element for item amount
            countP.setAttribute('class', 'itemAmount');
            countP.innerHTML = materialStorage[item].count ? materialStorage[item].count : 0;
            document.getElementById(`MST${item}i${i}`).appendChild(countP);
            i++;

        //End secondary iterator
        });

    //End primary iterator
    });
    
//Function end
};


export { 
    populateMatStorage,
    fetchMatStorage
};