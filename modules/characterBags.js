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
    itemNameChecker,
    itemInfo
} from './dataHandler.js';

import {
    spawnItemDiv,
    spawnItemIcon,
    spawnItemName,
    spawnItemCount,
    spawnCategoryTitle,
    spawnCategoryGrid
} from "./elementModule.js";


//Define the status and character status output.
const charQueueOutput = document.getElementById('charQueueOutput');

//Character Inventory tab
const charInventoryTab = document.getElementById('charInventoryTab');
const characterInvBtn = document.getElementById('charInventoryButton');

//Toggle visibility between the tabs
characterInvBtn.addEventListener('click', showInventoryTab);
async function showInventoryTab() {
    hideTabs();
    charInventoryTab.style.display = 'block';
};


//Function to fetch the list of characters. Pass data downwards.
function fetchCharactersList() {

    //Check for permissions because function can be triggered manually
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
    });
    };
};


//Function to modify the character names to URL specifics.
//Then handle the staggering of requesting character inventories.
let characters = {};
async function characterQueueManager(input) {
    let charQueue = [];
    const characterNames = [];

    input.forEach(char => {
        characterNames.push(char);
        charQueue.push(encodeURIComponent(char));
    });

    //Primary iterator, send a character name & URL name every interval.
    //When queue is empty, turn itself off.
    // setStorage('characters', characters);
    let charInterval = setInterval(() => {
        if(charQueue.length < 1) {

            clearInterval(charInterval);
            charQueueOutput.innerHTML = '';
            characterInvBtn.style.backgroundColor = null;
        }
        else {
            charQueueOutput.innerHTML = `Requesting: ${characterNames[0]},
            ${charQueue.length -1} remaining`;
            fetchCharacterData(charQueue.shift(), characterNames.shift());
        };
    },100); //Timer 0.1s
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
        characters[char] = [];
        let emptyCount = 0;
        for(let bag in data.bags) {
            if(data.bags[bag]) {
                data.bags[bag].inventory.forEach(item => {
                    if (item) {
                        characters[char].push( [
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
            };
        };
        //Input the empty slots count into inventory array
        characters[char].unshift( ['EmptySlot', emptyCount] );

        //Send each finished character to be populated on the page and save to storage.
        populateCharacterBagsTab(characters[char], char);
        setStorage('characters', characters);

        //If any unknown items were found, they get sent to dataHandler module.
        if(newItems.length > 0) {
            console.log(`Character Module found ${newItems.length} new items`);
            itemInformationStart(newItems);

            //If new items were found, refresh after 4 seconds.
            setTimeout(populateCharacterBagsTab, 4000, characters[char], char);
        };
    })
    //If the fetch of a character fails, this will send info that indicates it failed.
    .catch(error => {
        console.log(error);
        console.log(`Fetch of character: ${char} failed.`);

        //Remove existing title
        let charTitle = document.getElementById(char);
        if (charTitle) {
            charTitle.remove();
        };

        //Remove existing itemGrid
        let charGrid = document.getElementById(`Grid${char}`);
        if(charGrid) {
            charGrid.remove();
        };

        //Send Char name and append with "Failed Downloading."
        populateCharacterBagsTab([['EmptySlot', 0]] , `${char} - Failed downloading.`);
        characters[`${char} - Error.`] = [['EmptySlot', 0]];
        setStorage('characters', characters);
    });
};


//When triggered it formats the stored data for the populating function.
function popCharTabOnLoad() {
    let characters = getStorageObject('characters');
    for(let char in characters) {
        populateCharacterBagsTab(characters[char], char);
    };
    charQueueOutput.innerHTML = "";
};


//Main function for creating character titles and their inventories.
function populateCharacterBagsTab(inventoryArray, charName) {

    let charTitle = document.getElementById(charName);
    let charGrid = document.getElementById(`Grid${charName}`);

    if ( ! charTitle) {
        spawnCategoryTitle(charName, 'charInventoryTab', `Grid${charName}`);
    };

    if(charGrid) {
        charGrid.remove();
    };

    //Call for creation of Grid
    spawnCategoryGrid(`Grid${charName}`, charName, 'itemGrid');

    //Primary iterator for items
    inventoryArray.forEach(item => {
        let itemID = item[0];
        let itemCount = item[1];
        const RI = Math.ceil(Math.random() * 10000);

        //Call for creation of item
        spawnItemDiv(`CB${itemID}RI${RI}`, `Grid${charName}`);
        spawnItemIcon(itemID, `CB${itemID}RI${RI}`);
        spawnItemName(itemID, `CB${itemID}RI${RI}`);
        spawnItemCount(itemCount, `CB${itemID}RI${RI}`);

    });

//Function end
};


export {
    fetchCharactersList,
    popCharTabOnLoad
};