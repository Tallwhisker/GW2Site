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
    itemInfoParser 
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

    fetch(`https://api.guildwars2.com/v2/account/bank?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('FetchReturn Error');
        }
        return response.json();
    })
    .then(data => {
        const newBankStorage = {};
        const newItems = [];
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
        itemInfoParser(newItems);
    })
    .catch(error => {
        console.log(error);
    })
    setTimeout(populateBank, 1000);
}
};


//Function to populate bank tab

async function populateBank() {
    const bankStorage = getStorageObject('bankStorage');
    const itemInfo = getStorageObject('itemInfo');

    bankTab.textContent = '';


    //Create the new item grid container
    const newItemGrid = document.createElement('div');
    newItemGrid.setAttribute('class', 'itemGrid');
    newItemGrid.setAttribute('id', `GridBank`);
    bankTab.appendChild(newItemGrid);

    //Set parentDiv to the newly created itemgrid
    let parentDiv = document.getElementById(`GridBank`);


    for (let obj in bankStorage) {
        let itemID = obj;
        let itemCount = bankStorage[obj].count;
        

        //Define new element creators
        const newItemDiv = document.createElement('div');
        const newItemImg = document.createElement('img');
        const nameP = document.createElement('p');
        const countP = document.createElement('p');
        
        //Create DIV Element for item container
        newItemDiv.setAttribute('id', itemID);
        newItemDiv.setAttribute('class', 'item');
        parentDiv.appendChild(newItemDiv);

        //Imagecheck
        let iconURL = itemInfo[itemID].localIcon ? 
            `./icons/${itemInfo[itemID].localIcon}` : itemInfo[itemID].webIcon;

        //Create IMG Element for item image
        newItemImg.setAttribute('class', 'itemImg');
        newItemImg.setAttribute('src', iconURL);
        document.getElementById(itemID).appendChild(newItemImg);

        //Create P Element for item name
        nameP.setAttribute('class', 'itemName');
        nameP.innerHTML = itemInfo[itemID].name;
        document.getElementById(itemID).appendChild(nameP);

        //Create P Element for item amount
        countP.setAttribute('class', 'itemAmount');
        countP.innerHTML = itemCount;
        document.getElementById(itemID).appendChild(countP);

    //End iterator
    };
console.log('Populated Bank tab');
};



export { 
    populateBank, 
    fetchBank
}