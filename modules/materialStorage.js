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
    itemInformationStart,
    itemNameChecker,
    itemInfo
} from './dataHandler.js';


//Get current item data
let matStorageCategories = getStorageObject('matStorageCategories');

//Material Storage Tab & button
const materialStorageTab = document.getElementById('materialStorageTab');
const matStorageBtn = document.getElementById('matStorageButton');

//Toggle visibility between the tabs
matStorageBtn.addEventListener('click', showMatTab);
    async function showMatTab() {
        hideTabs();
        materialStorageTab.style.display = 'block';
};


//Fetch the material storage and format data
async function fetchMatStorage() {
    
    //Check for permissions because function can be triggered manually
    if(permissionInventory === 1) {
    const newItems = [];

    fetch(`https://api.guildwars2.com/v2/account/materials?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
            throw new Error(`Fetch Error`);
        }
        return response.json();
    })
    .then(data => {
        matStorageCategories = {};
        data.forEach(element => {
            let elID = (element.id);
            let elCat = (element.category);
            if(!matStorageCategories[elCat]) {
                matStorageCategories[elCat] = [];
            }; 
            matStorageCategories[elCat].push([ elID, element.count]);

            //Check for unknown items
            if(!itemInfo[element.id]) {
                newItems.push(element.id);
            };
        });

        //Overwrite any stored data with new data
        setStorage('matStorageCategories', matStorageCategories);

        //If any unknown items are found, send them to dataHandler
        if(newItems.length > 0) {
            console.log(`MatStorage Module found ${newItems.length} new items`)
            itemInformationStart(newItems);
        };

        //Start the populating of material storage tab
        populateMatStorage();
    })
    .catch(error => {
        console.error(error);
    });
    }
};


//Main function to populate the Material Storage tab with items
async function populateMatStorage() {
    
    //Primary iterator for categories
    for(let cat in matStorageCategories) {

        //Get H2 category element for category names
        let newH2 = document.getElementById(`Cat${cat}`);
        
        //Check if the itemGrid already exists, else make a new one.
        let matGridExists = document.getElementById(`Grid${cat}`);
        if(!matGridExists) {

            //Set category H2 element event listener to hide the category grid
            newH2.addEventListener('click', () => {
                let target = document.getElementById(`Grid${cat}`);
                if(target.style.display === 'none') {
                    target.style.display = '';
                } else {target.style.display = 'none'}
            });

            
            //Create DIV Elements for category item grid
            const newItemGrid = document.createElement('div');
            newItemGrid.setAttribute('class', 'itemGrid');
            newItemGrid.setAttribute('id', `Grid${cat}`);
            materialStorageTab.appendChild(newItemGrid);
            newH2.insertAdjacentElement('afterend', newItemGrid);

            document.getElementById('matStCollapseAll').addEventListener('click',
             () => {
                newItemGrid.style.display = 'none';
             });
        };
        
        //Set parentDiv to the itemGrid then reset it
        let parentDiv = document.getElementById(`Grid${cat}`);
        parentDiv.innerHTML = '';

        //Secondary iterator for items. Iterator variable to prevent the Soybean incident.
        let i = 0; 
        matStorageCategories[cat].forEach(item => {
            const newItemDiv = document.createElement('div');
            const newItemImg = document.createElement('img');
            const nameP = document.createElement('p');
            const countP = document.createElement('p');

            let itemID = item[0];
            let itemCount = item[1];
            
            //Create DIV Element for item container
            newItemDiv.setAttribute('class', 'item');
            newItemDiv.setAttribute('id', `MST${itemID}i${i}`);
            parentDiv.appendChild(newItemDiv);

            //If icon exists, return that. Else the caller will use 'The Spaghet'
            let iconURL ;
            if(itemInfo[itemID]){
                if(itemInfo[itemID].localIcon) {
                    iconURL = `./icons/${itemInfo[itemID].localIcon}`
                } else if (itemInfo[itemID].webIcon) {
                    iconURL = itemInfo[itemID].webIcon
                };
            };
        
            //Check if item has a rarity, else set it to blank
            let rarity;
            if(itemInfo[itemID]) {
                rarity = itemInfo[itemID].rarity
            } else {rarity = ""};
    
            //Create IMG Element for item image
            newItemImg.setAttribute('class', `itemImg ${rarity}`);
            newItemImg.setAttribute('src', iconURL ? iconURL : './icons/spaghet.png');
            newItemImg.setAttribute('alt',
             itemInfo[itemID].name ? itemInfo[itemID].name : `Icon of item ${itemID}`);
            document.getElementById(`MST${itemID}i${i}`).appendChild(newItemImg);

            //Create P Element for item name
            nameP.setAttribute('class', 'itemName');
            nameP.innerHTML = itemNameChecker(itemID); //Function in dataHandler module
            document.getElementById(`MST${itemID}i${i}`).appendChild(nameP);

            //Create P Element for item amount
            countP.setAttribute('class', 'itemAmount');
            countP.innerHTML = itemCount ? itemCount : 0;
            document.getElementById(`MST${itemID}i${i}`).appendChild(countP);
            i++;

        //End secondary iterator
        });

    //End primary iterator
    };
    
//Function end
};


export { 
    populateMatStorage,
    fetchMatStorage
};