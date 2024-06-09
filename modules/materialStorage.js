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
    itemNameShortener,
    itemInfo
} from './dataHandler.js';

import {
    spawnItemDiv,
    spawnItemIcon,
    spawnItemName,
    spawnItemCount,
    spawnCategoryGrid
} from "./elementModule.js";

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

                matStorageCategories[elCat].push([ 
                    elID, 
                    element.count
                ]);

                //Check for unknown items
                if(!itemInfo[element.id]) {
                    newItems.push(element.id);
                };
            });

            //Overwrite any stored data with new data
            setStorage('matStorageCategories', matStorageCategories);

            //If any unknown items are found, send them to dataHandler
            if(newItems.length > 0) {
                console.log(`MatStorage Module found ${newItems.length} new items`);
                itemInformationStart(newItems);

                //If new items were found, refresh after 4 seconds.
                setTimeout(populateMatStorage, 4000);
            };

            //Start the populating of material storage tab
            populateMatStorage();
        })
        .catch(error => {
            console.error(error);
        });
    };
};


//Main function to populate the Material Storage tab with items
async function populateMatStorage() {
    
    //Primary iterator for categories
    for(let cat in matStorageCategories) {

        //If no grid exists, create it and add event triggers
        const matGridExists = document.getElementById(`Grid${cat}`);
        if( ! matGridExists) {
            spawnCategoryGrid(`Grid${cat}`, `Cat${cat}`, 'itemGrid');
            
            //Add trigger to collapse all categories
            document.getElementById('matStCollapseAll').addEventListener('click',
            () => {
                document.getElementById(`Grid${cat}`).style.display = 'none';
            });

            document.getElementById(`Cat${cat}`).addEventListener('click', () => {
                const targetGrid = document.getElementById(`Grid${cat}`);
                if(targetGrid.style.display === 'none') {
                    targetGrid.style.display = "";
                } 
                else {
                    targetGrid.style.display = 'none';
                };
            });
        };
        
        document.getElementById(`Grid${cat}`).innerHTML = "";

        //Secondary iterator for items. Iterator variable to prevent the Soybean incident.
        let i = 0; 
        matStorageCategories[cat].forEach(item => {
            let itemID = item[0];
            let itemCount = item[1];
            
            spawnItemDiv(`MS${itemID}i${i}`, `Grid${cat}`);
            spawnItemIcon(itemID, `MS${itemID}i${i}`);
            spawnItemName(itemID, `MS${itemID}i${i}`);
            spawnItemCount(itemCount, `MS${itemID}i${i}`);

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