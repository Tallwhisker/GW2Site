import { 
    authToken,
    permissionInventory,
    hideTabs
} from "../main.js";

import { 
    setStorage,
    getStorageObject,
    getStorageArray
} from "./storageHandler.js";

import { 
    itemInformationStart,
    itemNameChecker,
    itemInfo
} from './dataHandler.js'

let bankStorage = getStorageArray('bankStorage');

//Bank tab & button
const bankTab = document.getElementById('bankTab');
const bankBtn = document.getElementById('bankButton');


//Toggle visibility between the tabs
bankBtn.addEventListener('click', showBankTab);
    async function showBankTab() {
            hideTabs();  //->Main.js
            bankTab.style.display = 'block';
};


//Fetch bank and format data return
async function fetchBank() {

    const newItems = [];

    fetch(`https://api.guildwars2.com/v2/account/bank?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('FetchReturn Error');
        }
        return response.json();
    })
    .then(data => {
        let bankStorage = [];
        let emptyCount = 1;
        data.forEach(item => {
            if(item) {
                bankStorage.push( [item.id, item.count] );

                if(!itemInfo[item.id]) {
                    newItems.push(item.id);
                }
            }

            else if (item === null) {
                emptyCount++;
            };

        })
        //Overwrite old bank data
        bankStorage.unshift( ['EmptySlot', emptyCount] );
        setStorage('bankStorage', bankStorage);

        //If any unknown items are found, send them to dataHandler
        if(newItems.length > 0) {
            console.log(`Bank Module found ${newItems.length} new items`);
            itemInformationStart(newItems);
        };

        //Start the populating of bank tab
        setTimeout(populateBank, 1000);
    })
    .catch(error => {
        console.log(error);
    })
};


//Function to populate bank tab
async function populateBank() {
    // const bankStorage = getStorageObject('bankStorage');

    
    //Set parentDiv to the bank itemGrid then reset it
    let parentDiv = document.getElementById(`GridBank`);
    parentDiv.textContent = ''

    //Primary bank iterator
    bankStorage.forEach(item => {
        let itemID = item[0];
        let itemCount = item[1];

        //Random 4-digit number for each item to guard against duplicates
        const RI = Math.ceil(Math.random() * 10000);

        //Define new element creators
        const newItemDiv = document.createElement('div');
        const newItemImg = document.createElement('img');
        const nameP = document.createElement('p');
        const countP = document.createElement('p');
        
        //Create DIV Element for item container
        newItemDiv.setAttribute('id', `BS${itemID}RI${RI}`);
        newItemDiv.setAttribute('class', 'item');
        parentDiv.appendChild(newItemDiv);

        //Imagecheck because some items don't have an icon.
        //Alternatively they have a web-hosted icon and not a local one.
        let iconURL ;
        if(itemInfo[itemID]){
            if(itemInfo[itemID].localIcon) {
                iconURL = `./icons/${itemInfo[itemID].localIcon}`
            } else if (itemInfo[itemID].webIcon) {
                iconURL = itemInfo[itemID].webIcon
            }
        };

        let rarity;
        if(itemInfo[itemID].rarity) {
            rarity = itemInfo[itemID].rarity
        } else {rarity = ""};

        //Create IMG Element for item image
        //If no icon from above check, Give 'em the spaghet.
        newItemImg.setAttribute('class', `itemImg ${rarity}`);
        newItemImg.setAttribute('src', iconURL ? iconURL : './icons/spaghet.png');
        document.getElementById(`BS${itemID}RI${RI}`).appendChild(newItemImg);

        //Create P Element for item name
        nameP.setAttribute('class', 'itemName');
        nameP.innerHTML = itemNameChecker(itemID); //Function in dataHandler module
        document.getElementById(`BS${itemID}RI${RI}`).appendChild(nameP);

        //Create P Element for item amount
        countP.setAttribute('class', 'itemAmount');
        countP.innerHTML = itemCount;
        document.getElementById(`BS${itemID}RI${RI}`).appendChild(countP);

    //End iterator
    });
};


//Exporting only the functions I want to trigger outisde of module
export { 
    populateBank, 
    fetchBank
};