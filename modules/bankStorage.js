import { 
    authToken,
    permissionInventory,
    hideTabs
} from "../main.js";

import { 
    setStorage,
    getStorageArray
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
    spawnItemCount
} from "./elementModule.js";

//Get current item data
let bankStorage = getStorageArray('bankStorage');

//Bank tab & button
const bankTab = document.getElementById('bankTab');
const bankBtn = document.getElementById('bankButton');

//Set parentDiv to the bank itemGrid
const parentDiv = document.getElementById(`GridBank`);

//Toggle visibility between the tabs
bankBtn.addEventListener('click', () => {
    hideTabs();
    bankTab.style.display = 'block';
});


//Fetch bank and format data return
async function fetchBank() {

    //Check for permissions because function can be triggered manually
    if(permissionInventory === 1) {
        const newItems = [];

        fetch(`https://api.guildwars2.com/v2/account/bank?access_token=${authToken}`)
        .then(response => {
            if(!response.ok) {
                throw new Error('FetchReturn Error');
            }
            return response.json();
        })
        .then(data => {
            bankStorage.length = 0;
            let emptyCount = 1;
            data.forEach(item => {
                if(item) {
                    bankStorage.push( [
                        item.id,
                        item.charges ? item.charges : item.count
                        ] 
                    );

                    if(!itemInfo[item.id]) {
                        newItems.push(item.id);
                    };
                }
                else if (item === null) {
                    emptyCount++;
                };
            });
            //Save bank data
            bankStorage.unshift( ['EmptySlot', emptyCount] );
            setStorage('bankStorage', bankStorage);

            //If any unknown items are found, send them to dataHandler
            if(newItems.length > 0) {
                console.log(`Bank Module found ${newItems.length} new items`);
                itemInformationStart(newItems);

                //Refresh bank after 4s if there's any unknown items.
                setTimeout(populateBank, 4000);
            };

            //Start the populating of bank tab
            populateBank();
        })
        .catch(error => {
            console.log(error);
        });
    };
};


//Function to populate bank tab
async function populateBank() {
    
    parentDiv.innerHTML = '';

    //Primary bank iterator
    bankStorage.forEach(item => {
        let itemID = item[0];
        let itemCount = item[1];

        //Random 4-digit number for each item to guard against duplicates
        const RI = Math.ceil(Math.random() * 10000);

        spawnItemDiv(`BS${itemID}RI${RI}`, `GridBank`);
        spawnItemIcon(itemID, `BS${itemID}RI${RI}`);
        spawnItemName(itemID, `BS${itemID}RI${RI}`);
        spawnItemCount(itemCount, `BS${itemID}RI${RI}`);

    //End iterator
    });
};


//Exporting only the functions I want to trigger outisde of module
export { 
    populateBank, 
    fetchBank
};