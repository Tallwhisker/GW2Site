import { 
    getStorageObject, 
    setStorage,
    getStorageArray 
} from "./storageHandler.js";

import { 
    populateInventories
} from "../main.js";



// const apiUrl = 'https://api.guildwars2.com/v2/';


//Item information request controller
let itemQueueSignal = 0;
let newItems = {};
const itemQueue = [];

async function itemInformationStart(inputArray) {

    inputArray.forEach(item => {
        newItems[item] =  {
            name : 'Placeholder',
            webIcon : '',
            localIcon : 'spaghet.png'
        }});

    itemQueue.push(...inputArray);

    if(itemQueueSignal === 0) {
        itemQueueSignal = 1;
        itemQueueHandler();
        console.log('Starting itemQueueHandler');
    }
};


function itemQueueHandler() {

const queueHandler = setInterval(() => {

        if (itemQueue.length === 0) {
            
            const itemInfo = getStorageObject('itemInfo');
            for(let item in newItems) {
                itemInfo[item] = newItems[item];
            }
            setStorage('itemInfo', itemInfo);
            newItems = {};
            populateInventories();
            
            itemQueueSignal = 0;
            console.log('ItemQueueHandler done');
            clearInterval(queueHandler);
        } 
        else if(itemQueue.length > 50) {
            fetchItemInfo(itemQueue.splice(0, 50).toString());
            console.log(`Sent 50 items to fetchItemInfo`);
            console.log(`Remaining in queue: ${itemQueue.length}`)
        } 
        else {
            console.log(`Sent ${itemQueue.length} items to fetchItemInfo`)
            fetchItemInfo(itemQueue.splice(0, itemQueue.length).toString());
        }

}, 7500);
};




    //Split item array and slow down fetch
async function itemInfoParser(data) {


    console.log(`InfoParser Starting: ${data.length} items in queue.`)
    const itemInterval = setInterval(() => {
        if (data.length === 0) {
            clearInterval(itemInterval);
            console.log('InfoParser stopped')
        } 
        else if(data.length > 50) {
            fetchItemInfo(data.splice(0, 50).toString());
            console.log(`Sent 50 items to fetchItemInfo`);
        } 
        else {
            fetchItemInfo(data.splice(0, data.length).toString());
            console.log(`Sent ${data.length} items to fetchItemInfo`)
        }
    },7500)
}

    //Fetch item info 
async function fetchItemInfo(items) {
    const newItemInfo = getStorageArray('newItemInfo');


    fetch(`https://api.guildwars2.com/v2/items?ids=${items}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('FetchItemInfo Error');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(item => {
            newItems[item.id] =  {
                name : item.name,
                webIcon : item.icon,
                localIcon : ''
            }
            newItemInfo.push(item.id);
            })
            setStorage('newItemInfo', newItemInfo);
        })
        .catch(error => {
            console.log(error);
        })
        // console.log('FetchItemInfo done')
}



//Anonymous speciality function trigger for custom data manipulation

// document.getElementById('functionTrigger').addEventListener('click',() => {

// })

export {
    itemInformationStart,
}