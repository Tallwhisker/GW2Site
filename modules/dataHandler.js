import { 
    getStorageObject, 
    setStorage,
    getStorageArray 
} from "./storageHandler.js";

import { 
    populateInventories
} from "../main.js";



const statusOutput = document.getElementById('statusOutput');

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
        statusOutput.innerText = 'New items found, starting download.'
    }
};


const itemInfo = getStorageObject('itemInfo');
function itemQueueHandler() {

const queueHandler = setInterval(() => {

        if (itemQueue.length === 0) {
            
            for(let item in newItems) {
                itemInfo[item] = newItems[item];
            }
            setStorage('itemInfo', itemInfo);
            newItems = {};
            populateInventories();
            
            itemQueueSignal = 0;
            // console.log('ItemQueueHandler done');
            statusOutput.innerText = 'idle';
            clearInterval(queueHandler);
        } 
        else if(itemQueue.length > 50) {
            fetchItemInfo(itemQueue.splice(0, 50).toString());
            console.log(`Sent 50 items to fetchItemInfo`);
            // console.log(`Remaining in queue: ${itemQueue.length}`);
            statusOutput.innerText =`Items remaining in queue: ${itemQueue.length}`
        } 
        else {
            // console.log(`Sent ${itemQueue.length} items to fetchItemInfo`);
            fetchItemInfo(itemQueue.splice(0, itemQueue.length).toString());
            statusOutput.innerText =`Items remaining in queue: ${itemQueue.length}`
        }

}, 7500);
};




    //Split item array and slow down fetch
function itemNameChecker(inputId) {
    let name = [];
    let nameSplit = [];
    if(itemInfo[inputId]) {
        nameSplit = itemInfo[inputId].name.split(' ');

        if(nameSplit.length > 3) {
            name.push(nameSplit.pop());
            name.unshift(nameSplit.pop());
            name.unshift(' ... ');
            name.unshift(nameSplit.shift());
        } else {name = nameSplit}

        for(let i = 0; i < name.length; i++) {
            if(name[i].length > 9) {
                // let temp = name[i]
                name[i] = `${name[i].split('').splice(0,7).join('')}..`
            }
        }

        // console.log(name.join(' '))
        return name.join(' ');

        } else {
        return name = `Unknown ID: ${inputId}`
    }
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
    itemNameChecker
}