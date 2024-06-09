import { 
    getStorageObject, 
    setStorage
} from "./storageHandler.js";

//Item data to reduce initial setup load. Activates on new API key.
import { 
    baseItemInfo 
} from "../data/itemInfo.js"; 


//Get current itemInfo
let itemInfo = getStorageObject('itemInfo');

//Function called from new API key or data version in main.js
async function coldStartItemInfo() {
    setStorage('itemInfo', baseItemInfo);
    itemInfo = baseItemInfo;
};

//Item information request controller
let itemQueueSignal = 0;
const itemQueue = [];


//Queue creator, any unknown items go to this function.
async function itemInformationStart(inputArray) {
    inputArray.forEach(item => {

        //If item is not already in queue, add it.
        if(!itemQueue.includes(item)) {
            itemQueue.push(item);
        };
    });

    //If the "run signal" for the queueHandler is OFF, turn it on
    if(itemQueueSignal === 0) {
        itemQueueSignal = 1;
        itemQueueHandler();
    };
};


//Function to split itemQueue into bits to not overload API. Timed.
//Max 200 items per request & 300 requests per minute.
function itemQueueHandler() {

    //Primary interval
    const queueHandler = setInterval(() => {

        //If the queue is empty, turn itself off.
        if (itemQueue.length === 0) {
            itemQueueSignal = 0;
            clearInterval(queueHandler);
        }
            //If the queue is bigger than 200 items, send 200.
        else if(itemQueue.length > 200) {
            fetchItemInfo(itemQueue.splice(0, 200).toString());
        } 
            //If the queue is less than 200 items, send the remaining.
        else {
            fetchItemInfo(itemQueue.splice(0, itemQueue.length).toString());
        };

        //Interval number
    }, 1000); //1s
};


//Function that is called from other modules to get shortened item name.
function itemNameShortener(inputId) {

    let name = [];
    let nameSplit = [];

    //If item data exists, process it.
    if(itemInfo[inputId]) {
        nameSplit = itemInfo[inputId].name.split(' ');

        //Check the word count
        if(nameSplit.length > 3) {
            name = [
                nameSplit[0],
                " ... ",
                nameSplit[nameSplit.length - 2],
                nameSplit[nameSplit.length - 1]
            ];
        } 
        else {
            name = nameSplit;
        };

        //Check the word length
        for(let i = 0; i < name.length; i++) {
            if(name[i].length > 9) {
                name[i] = `${name[i].split('').splice(0,7).join('')}..`;
            };
        };

        //Return the processed name.
        return name.join(' ');

    //If it doesn't have any local data, return Unknown.
    } 
    else {
        return `Unknown ID: ${inputId}`;
    };
};


//Get the item name
function getItemName(id) {
    let itemName = `Unknown ID: ${inputId}`;

    if(itemInfo[id]) {
        itemName = itemInfo[id].name
    };
    return itemName;
};


//Get the item icon
function getItemIcon(id) {
    let itemIcon = './icons/spaghet.png';

    if(itemInfo[id].localIcon) {
        itemIcon = `./icons/${itemInfo[id].localIcon}`;
    } 
    else if (itemInfo[id].webIcon) {
        itemIcon = itemInfo[id].webIcon;
    }
    return itemIcon;
};


//Get item rarity
function getItemRarity(id) {
    let itemRarity = "";

    if(itemInfo[id].rarity) {
        itemRarity = itemInfo[id].rarity;
    }
    return itemRarity;
};


//Main function for fetching and saving new item data.
async function fetchItemInfo(items) {

    fetch(`https://api.guildwars2.com/v2/items?ids=${items}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('FetchItemInfo Error');
        };
        return response.json();
    })
    .then(data => {
        data.forEach(item => {
            itemInfo[item.id] = {
                name : item.name,
                rarity : item.rarity,
                webIcon : item.icon,
                localIcon : ''
            };
        });

        //Saves data from recieved items to storage
        setStorage('itemInfo', itemInfo);
    })
    .catch(error => {
        console.log(error);
        console.log(`Error fetching items: ${items}`);
    });
};


export {
    itemInformationStart,
    itemNameShortener,
    itemInfo,
    coldStartItemInfo,
    getItemIcon,
    getItemName,
    getItemRarity
};