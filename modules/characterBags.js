import { 
    authToken,
    permissionCharacters,
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


//Define the status and character status output.
const charQueueOutput = document.getElementById('charQueueOutput');


//Character Inventory tab
const charInventoryTab = document.getElementById('charInventoryTab');
const characterInvBtn = document.getElementById('charInventoryButton');

characterInvBtn.addEventListener('click', showInventoryTab);
async function showInventoryTab() {
        hideTabs();
        charInventoryTab.style.display = 'block';
};


//Function to fetch the list of characters. Pass data downwards.
function fetchCharactersList() {
    if(permissionCharacters === 1) {
    characterInvBtn.style.backgroundColor = '#ff7f50';
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
    })
    .catch(error => {
        console.log(error);
    })
}
};


//Function to first modify the character names for fetchURL specifics.
//Then handle the staggering of requesting character inventories.
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
                requestName.push('%20');
            } else {
                requestName.push(letter);
            }
        });
        charQueue.push(requestName.join(''));
    });

    //Primary iterator, send a character name & request name every 4s.
    //When queue is empty, turn itself off and schedule writing of data.
    setStorage('characters', characters);
    let charInterval = setInterval(() => {
        if(charQueue.length < 1) {

            //When queue is empty, save data and turn itself off.
            clearInterval(charInterval);
            setTimeout(setStorage('characters', characters),2500);
            popCharTabOnLoad(characters);
            charQueueOutput.innerHTML = '';
            characterInvBtn.style.backgroundColor = null;
        }
        else {
            charQueueOutput.innerHTML = `Retrieving data for: ${characterNames[0]},
             ${charQueue.length -1} remaining`;
            fetchCharacterData(charQueue.shift(), characterNames.shift());
        };
    },4000);
};


//Main function for retrieving character data and formating it.
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

        //Send each finished character to be populated on the page.
        populateCharacterBagsTab(characters[char], char);

        //If any unknown items were found, they get sent to dataHandler module.
        if(newItems.length > 0) {
        itemInformationStart(newItems);
        };
    })
    .catch(error => {
        console.log(error);
        console.log(`Fetch of character: ${char} failed.`);
    })
};



//When triggered it formats the stored data for the populating function.
function popCharTabOnLoad() {
    charQueueOutput.innerHTML = '';
    let characters = getStorageObject('characters');
    for(let char in characters) {
        populateCharacterBagsTab(characters[char], char);
    };
};



//Main function for creating character titles and their inventories.
function populateCharacterBagsTab(inventoryArray, charName) {
const itemInfo = getStorageObject('itemInfo');


    //Check if character tab exist
    let charTabExists = document.getElementById(charName);

    //If there is no character tab of the character currently processing, make a new one.
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
    };

    //Set parentDiv to the itemGrid of the character, then reset it.
    let parentDiv = document.getElementById(`Grid${charName}`);
    parentDiv. innerHTML = '';

    //Primary iterator for items
    inventoryArray.forEach(item => {
        let itemID = item[0];
        let itemAmount = item[1];
        const RI = Math.ceil(Math.random() * 10000);

        //Define element constructors
        const newItemDiv = document.createElement('div');
        const newItemImg = document.createElement('img');
        const nameP = document.createElement('p');
        const countP = document.createElement('p');
        
        //Create DIV Element for item container
        newItemDiv.setAttribute('id', `BAG${itemID}RI${RI}`);
        newItemDiv.setAttribute('class', 'item');
        parentDiv.appendChild(newItemDiv);

        //Imagecheck because some items don't have an icon,
        //Alternatively they have a web-hosted icon and not a local one.
        let iconURL ;
        if(itemInfo[itemID]){
            if(itemInfo[itemID].localIcon) {
                iconURL = `./icons/${itemInfo[itemID].localIcon}`
            } else if (itemInfo[itemID].webIcon) {
                iconURL = itemInfo[itemID].webIcon
            }
        };

        //Create IMG Element for item image
        //If no icon from above check, Give 'em the spaghet.
        newItemImg.setAttribute('class', 'itemImg');
        newItemImg.setAttribute('src', iconURL ? iconURL : './icons/spaghet.png');
        document.getElementById(`BAG${itemID}RI${RI}`).appendChild(newItemImg);

        //Create P Element for item name
        nameP.setAttribute('class', 'itemName');
        nameP.innerHTML = itemNameChecker(itemID); //Function in dataHandler module
        document.getElementById(`BAG${itemID}RI${RI}`).appendChild(nameP);

        //Create P Element for item amount
        countP.setAttribute('class', 'itemAmount');
        countP.innerHTML = itemAmount;
        document.getElementById(`BAG${itemID}RI${RI}`).appendChild(countP);

    //End iterator
    });

//Function end
};


export {
    fetchCharactersList,
    popCharTabOnLoad
}