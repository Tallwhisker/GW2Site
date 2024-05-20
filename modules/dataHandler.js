import { 
    getStorageObject, 
    setStorage,
    getStorageArray 
} from "./storageHandler.js";

import { 
    populateInventories
} from "../main.js";

import { 
    populateBank 
} from "./bankStorage.js";

import { 
    populateMatStorage 
} from "./materialStorage.js";

//Define output element for status 
const statusOutput = document.getElementById('statusOutput');


//Item information request controller
let itemQueueSignal = 0;
let newItems = {};
const itemQueue = [];


//Queue creator, any unknown items go to this function.
//Items are formated to a default template for the future
//as well as being passed into the global itemQueue.
async function itemInformationStart(inputArray) {
    inputArray.forEach(item => {
        newItems[item] =  {
            name : `Unknown ID: ${item}`,
            webIcon : '',
            localIcon : 'spaghet.png'
        };
        if(!itemQueue.includes(item)) {
            itemQueue.push(item);
        };
    });

    //If the runSignal for the queueHandler is OFF, turn it on!
    if(itemQueueSignal === 0) {
        itemQueueSignal = 1;
        itemQueueHandler();
        console.log('Starting itemQueueHandler');
        statusOutput.innerText = 'New items found, starting download.'
    };
};


//Function with internal iterator for reducing the global itemQueue. Interval 5s
function itemQueueHandler() {

    
//Primary interval
const queueHandler = setInterval(() => {

    //Get current itemInfo
    const itemInfo = getStorageObject('itemInfo');

    //If the queue is empty, save the new data and turn itself off.
    if (itemQueue.length === 0) {
        const newItemInfo = getStorageArray('newItemInfo');
        newItemInfo.forEach(item => {
            itemInfo[item] = newItems[item];
        });

        setStorage('itemInfo', itemInfo);
        localStorage.removeItem('newItemInfo');
        newItems = {};
        populateBank();
        populateMatStorage();
        
        itemQueueSignal = 0;
        statusOutput.innerText = 'idle';
        console.log('Stopped itemQueueHandler');
        clearInterval(queueHandler);
    } 
    //If the queue is bigger than 50 items, send 50.
    else if(itemQueue.length > 100) {
        fetchItemInfo(itemQueue.splice(0, 100).toString());
        statusOutput.innerText =`Items remaining in queue: ${itemQueue.length}`
    } 
    //If the queue is less than 50 items, send the remaining.
    else {
        statusOutput.innerText =`${itemQueue.length} items downloading.`
        fetchItemInfo(itemQueue.splice(0, itemQueue.length).toString());
    };

    //Interval number
}, 3000);
};


//Function that is called from other modules to retrieve the item names.
function itemNameChecker(inputId) {

    //Get current data
    const itemInfo = getStorageObject('itemInfo');

    let name = [];
    let nameSplit = [];

    //If item HAS any data, process it.
    if(itemInfo[inputId]) {
        nameSplit = itemInfo[inputId].name.split(' ');

        //Check the word count
        if(nameSplit.length > 3) {
            name.push(nameSplit.pop());
            name.unshift(nameSplit.pop());
            name.unshift(' ... ');
            name.unshift(nameSplit.shift());
        } else {name = nameSplit};

        //Check the word length
        for(let i = 0; i < name.length; i++) {
            if(name[i].length > 9) {
                // let temp = name[i]
                name[i] = `${name[i].split('').splice(0,7).join('')}..`
            };
        };

        //Return the processed name.
        return name.join(' ');

    //If it doesn't have any local data, return Unknown.
    } else {
    return name = `Unknown ID: ${inputId}`
    };
};


//Main function for fetching and processing item data.
async function fetchItemInfo(items) {
    const newItemInfo = getStorageArray('newItemInfo');

    fetch(`https://api.guildwars2.com/v2/items?ids=${items}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('FetchItemInfo Error');
        };
        return response.json();
    })
    .then(data => {
        data.forEach(item => {
            newItems[item.id] =  {
                name : item.name,
                webIcon : item.icon,
                localIcon : ''
            };
            newItemInfo.push(item.id);
            });
            setStorage('newItemInfo', newItemInfo);
    })
    .catch(error => {
        console.log(error);
        console.log(`Error fetching items: ${items}`);
    })
};


export {
    itemInformationStart,
    itemNameChecker
};