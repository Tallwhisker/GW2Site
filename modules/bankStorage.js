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
    itemNameChecker
} from './dataHandler.js'

//Bank tab
const bankTab = document.getElementById('bankTab');
const bankBtn = document.getElementById('bankButton');

//Toggle visibility between the tabs

bankBtn.addEventListener('click', showBankTab);
    async function showBankTab() {
        if(localStorage.getItem('bankStorage')) {
            hideTabs();
            bankTab.style.display = 'block';
        }
        else {
            alert('No local bank data, API Key required');
            return;
        }
};


//Fetch bank and handle bankStorage

async function fetchBank() {

//Check for permissions
if(permissionInventory === 1 && localStorage.getItem('itemInfo')) {
    const itemInfo = getStorageObject('itemInfo');
    const newItems = [];

    fetch(`https://api.guildwars2.com/v2/account/bank?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('FetchReturn Error');
        }
        return response.json();
    })
    .then(data => {
        const newBankStorage = {};
        let emptyCount = 1;
        newBankStorage['EmptySlot'] = { 'count' : 0};
        data.forEach(item => {
            if(item) {
                newBankStorage[item.id] = {
                    'count' : item.count };

                if(!itemInfo[item.id]) {
                    newItems.push(item.id);}
            }

            else if (item === null) {
                emptyCount++;
        };

    })
        newBankStorage['EmptySlot'].count = emptyCount;
        setStorage('bankStorage', newBankStorage);
        if(newItems.length > 0) {
            console.log(`BankModule found ${newItems.length} new items`);
            itemInformationStart(newItems);
        };
        // populateBank();
        console.log(`BANK${newItems}`)
    })
    .catch(error => {
        console.log(error);
    })
}
};


//Function to populate bank tab

async function populateBank() {
    const bankStorage = getStorageObject('bankStorage');
    const itemInfo = getStorageObject('itemInfo');

    
    //Create the new item grid container
    const newItemGrid = document.createElement('div');
    newItemGrid.setAttribute('class', 'itemGrid');
    newItemGrid.setAttribute('id', `GridBank`);
    bankTab.appendChild(newItemGrid);
    
    //Set parentDiv to the newly created itemgrid
    let parentDiv = document.getElementById(`GridBank`);
    parentDiv.textContent = ''


    for (let obj in bankStorage) {
        let itemID = obj;
        let itemCount = bankStorage[obj].count;

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

        //Imagecheck
        let iconURL ;
        if(itemInfo[itemID]){
            if(itemInfo[itemID].localIcon) {
                iconURL = `./icons/${itemInfo[itemID].localIcon}`
            } else if (itemInfo[itemID].webIcon) {
                iconURL = itemInfo[itemID].webIcon
            }
        }

        //Create IMG Element for item image
        newItemImg.setAttribute('class', 'itemImg');
        newItemImg.setAttribute('src', iconURL ? iconURL : './icons/spaghet.png');
        document.getElementById(`BS${itemID}RI${RI}`).appendChild(newItemImg);

        //Create P Element for item name
        nameP.setAttribute('class', 'itemName');
        nameP.innerHTML = await itemNameChecker(itemID);
        document.getElementById(`BS${itemID}RI${RI}`).appendChild(nameP);

        //Create P Element for item amount
        countP.setAttribute('class', 'itemAmount');
        countP.innerHTML = itemCount;
        document.getElementById(`BS${itemID}RI${RI}`).appendChild(countP);

    //End iterator
    };
// console.log('Populated Bank tab');
};



export { 
    populateBank, 
    fetchBank
}