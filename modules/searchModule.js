import {
    itemInfo
} from "./dataHandler.js";

import {
    getStorageObject,
    getStorageArray,
    setStorage
} from "./storageHandler.js";

import {
    matStorageCategoryNames
} from "../data/itemInfo.js";

import {
    spawnListItem,
    spawnSearchList
} from "./elementModule.js";
import { 
    hideTabs
} from "../main.js";


//Define the button and tab for search
const searchTab = document.getElementById('searchTab');
const searchTabButton = document.getElementById('searchInventoryButton');

searchTabButton.addEventListener('click', showSearchTab);
function showSearchTab() {
    hideTabs();
    searchTab.style.display = 'block';
};


//Button to trigger search and get value of text field
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener('click', startSearch);
const searchInput = document.getElementById("searchTerm");
searchInput.addEventListener("keyup", startSearch);


function startSearch() {
    document.getElementById('searchResults').innerHTML = "";
    let searchTerm = searchInput.value;
    searchInventories(searchForName(searchTerm), constructSearch());
};


//Function to create the storage object of all inventories
function constructSearch() {
    let searchArrays = {};
    const matStorage = getStorageObject('matStorageCategories');
    const bankStorage = getStorageArray('bankStorage');
    const charInventories = getStorageObject('characters');

    searchArrays["Bank"] = bankStorage;

    for (let cat in matStorage) {
        let catName = matStorageCategoryNames[cat];
        searchArrays[catName] = matStorage[cat];
    };

    for (let char in charInventories) {
        searchArrays[char] = charInventories[char];
    };
    return searchArrays;
};


//Get the itemID from itemInfo database
function searchForName(key) {
    const searchKey = key.toLowerCase();
    const matches = [];

    for (let item in itemInfo) {
        let itemID = item;
        let itemName = itemInfo[itemID].name;

        if (itemName.toLowerCase().includes(searchKey)) {
            matches.push( itemID );
        };
    };

    return matches;
};


//Iterate through the storage object and send each array to searchArray
function searchInventories(keyArray, invArrays) {
    let searchResults = {};

    for (let category in invArrays) {
        keyArray.forEach(key => {
            let itemID = key;
            let results = searchArray(itemID, invArrays[category]);
            
            if (results > 0 && searchResults[itemID]){
                searchResults[itemID].push([category, results]);
            }
            else if (results > 0 && ! searchResults[itemID]) {
                searchResults[itemID] = [];
                searchResults[itemID].push([category, results]);
            };
        });
    };
    presentSearchResults(searchResults);
    
    let countResults = 0;
    for (let item in searchResults) {
        countResults++;
    };

    document.getElementById("searchInformation").innerHTML = `${countResults} Results.`;
};


//Go through input array, match for key and count amount from matches
function searchArray(key, arrayInput) {
    let itemCount = 0;

    arrayInput.forEach(item => {
        let itemID = item[0];
        if (itemID == key) {
            itemCount += item[1];
        };
    });
    return itemCount;
};


//Send the collected data to create the lists
function presentSearchResults(input) {

    for (let category in input) {
        let index = 0;
        
        //Create the container and title
        spawnSearchList(category, "searchResults");
        
        let totalCount = 0;
        input[category].forEach(item => {
            
            //Create the item holder
            spawnListItem(item[0], item[1], index, category);
            totalCount += item[1];
            index++;
        });
        if (index > 1) {
            //Show a total if there's more than 1 list entry
            spawnListItem("- - - -", "- - - - -",index, category);
            spawnListItem(totalCount, "Total owned", index, category);
        };
    };
};

export {
    startSearch
};