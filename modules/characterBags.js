import { 
    authToken,
    permissionInventory,
    permissionCharacters,
    hideTabs
} from "../main.js";

import { 
    setStorage,
    getStorageObject,
    getStorageArray
 } from "./storageHandler.js";

import { 
    itemInformationStart,
    itemNameChecker
} from './dataHandler.js'

const charQueueOutput = document.getElementById('charQueueOutput');
// const characterModuleStatus = 0;


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
};

function fetchCharactersList() {
    if(permissionCharacters === 1) {
    charQueueOutput.innerHTML = 'Getting characters from servers.';
    fetch(`https://api.guildwars2.com/v2/characters?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('FetchReturn Error');
        }
        return response.json();
    })
    .then(data => {
        characterQueueManager(data);
        // console.log(data);
    })
    .catch(error => {
        console.log(error);
    })
}
};

let characters = {};
async function characterQueueManager(input) {
    let charQueue = [];
    const characterNames = [];

    input.forEach(char => {
        characters[char] = [];
        let requestName = [];
        characterNames.push(char);
        char.split('').forEach(letter => {
            if(letter === ' ') {
                requestName.push('%20')
            } else {
                requestName.push(letter);
            }
        })
        charQueue.push(requestName.join(''));
    })
    // console.log(charQueue);
    setStorage('characters', characters);

    let charInterval = setInterval(() => {
        if(charQueue.length < 1) {
            clearInterval(charInterval)
            setTimeout(setStorage('characters', characters),2500);
            charQueueOutput.innerHTML = '';
        }
        else {
            charQueueOutput.innerHTML = `Retrieving data for: ${characterNames[0]}
             ${charQueue.length -1} remaining`;
            
            fetchCharacterData(charQueue.shift(), characterNames.shift());
        }

    },5000);
};


async function fetchCharacterData(inputName, char) {
    
    fetch(`https://api.guildwars2.com/v2/characters/${inputName}/inventory?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('FetchReturn Error');
        }
        return response.json();
    })
    .then(data => {
        let newItems = [];
        const itemInfo = getStorageObject('itemInfo');
        let emptyCount = 0;
        for(let bag in data.bags) {
            if(data.bags[bag]) {
                data.bags[bag].inventory.forEach(item => {
                    if (item) {
                        characters[char].push( [item.id,item.count]
                        )
                        if(!itemInfo[item.id]) {
                            newItems.push(item.id);
                        }
                    } 
                    else if (item === null) {
                        emptyCount++;
                    }
                }
            )}
        }
        characters[char].unshift( ['EmptySlot', emptyCount]);
        populateCharacterBagsTab(characters[char], char);
        // setStorage('characters', characters);
        if(newItems.length > 0) {
        // console.log(`CharModule found ${newItems.length} new items`);
        itemInformationStart(newItems);
        };
    })
    .catch(error => {
        console.log(error);
        console.log(`Fetch of character: ${char} failed.`);
    })
};

//Function to get stored characters and slap them into the tab on page load.
function popCharTabOnLoad() {
    charQueueOutput.innerHTML = '';
    let characters = getStorageObject('characters');
    for(let char in characters) {
        populateCharacterBagsTab(characters[char], char);
    }
};




function populateCharacterBagsTab(inventoryArray, charName) {
    //Input: OBJ[[]]

const itemInfo = getStorageObject('itemInfo');

    //Check if character tab exist, if so -> skip making new H2
    let charTabExists = document.getElementById(charName);

    if(!charTabExists) {
        //Create H2 Element for character name
        const newH2 = document.createElement('h2');
        newH2.setAttribute('id', charName);
        newH2.innerHTML = charName;

        //Set new H2 Element event listener to hide the category grid
        newH2.addEventListener('click', () => {
            let target = document.getElementById(`Grid${charName}`);
            if(target.style.display === 'none') {
                target.style.display = 'grid';
            } else {target.style.display = 'none'}
        });
        charInventoryTab.appendChild(newH2);
        
        //Create DIV Elements for category item grid
        const newItemGrid = document.createElement('div');
        newItemGrid.setAttribute('class', 'itemGrid');
        newItemGrid.setAttribute('id', `Grid${charName}`);
        charInventoryTab.appendChild(newItemGrid);
        
    }
    //Set parentDiv to the newly created itemgrid
    let parentDiv = document.getElementById(`Grid${charName}`);
    parentDiv. innerHTML = '';

    //Array iterator for items
    inventoryArray.forEach(item => {
        let itemID = item[0];
        let itemAmount = item[1];
        const RI = Math.ceil(Math.random() * 10000);

        const newItemDiv = document.createElement('div');
        const newItemImg = document.createElement('img');
        const nameP = document.createElement('p');
        const countP = document.createElement('p');
        
        //Create DIV Element for item container
        newItemDiv.setAttribute('id', `BAG${itemID}RI${RI}`);
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
        document.getElementById(`BAG${itemID}RI${RI}`).appendChild(newItemImg);

        //Create P Element for item name
        nameP.setAttribute('class', 'itemName');
        nameP.innerHTML = itemNameChecker(itemID);
        document.getElementById(`BAG${itemID}RI${RI}`).appendChild(nameP);

        //Create P Element for item amount
        countP.setAttribute('class', 'itemAmount');
        countP.innerHTML = itemAmount;
        document.getElementById(`BAG${itemID}RI${RI}`).appendChild(countP);

    //End iterator
    })

//Function end
};


export {
    fetchCharactersList,
    popCharTabOnLoad,
}