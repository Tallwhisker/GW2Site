import { getStorageArray, getStorageObject, getStorageString, setStorage } 
from "./storageHandler.js";

import { populateMatStorage, displayAccountName, populateBank } 
from "../main.js";


const apiUrl = 'https://api.guildwars2.com/v2/';
const authToken = getStorageString('authToken');
const materialStorage = getStorageObject('materialStorage');
// const matStorageCategories = getStorageObject('matStorageCategories');
const itemInfo = getStorageObject('itemInfo');
const newItemInfo = getStorageArray('newItemInfo');


//Fetch target info and send to localStorage
async function fetchToStorage(target, key) {
    fetch(`https://api.guildwars2.com/v2/${target}?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
        throw new Error('FetchReturn Error');
    }
        return response.json();
    })
    .then(data => {
        setStorage(key, data);
    })
    .catch(error => {
        console.log(error);
    })
}

//Get API key information
async function getNewToken() {
        let getToken = window.prompt(
        `Insert API Key. This will ->RESET<- any stored data.
         "Inventories" and "characters" permissions needed`);
         if(getToken) {
            localStorage.setItem('authToken', getToken);
            fetchToStorage('tokeninfo', 'tokenInfo');
            fetchToStorage('account', 'accountInfo');
            localStorage.removeItem('materialStorage');
            localStorage.removeItem('bankStorage');
            // localStorage.removeItem('Characters');
            setTimeout(displayAccountName, 3000)
        } else {alert('No token input')};
}

    //Fetch material storage and write to materialStorage
async function fetchMatStorage() {
        fetch(`${apiUrl}account/materials?access_token=${authToken}`)
        .then(response => {
            if(!response.ok) {
                throw new Error(`Fetch Error`);
            }
            console.log(`Fetched Material Storage`);
            return response.json();
        })
        .then(data => {
            const newItems = [];
            const matStorageCategories = {};
            data.forEach(element => {
                let elID = (element.id);
                let elCat = (element.category);
                if(!matStorageCategories[elCat]) {
                    matStorageCategories[elCat] = [];
                } 
                matStorageCategories[elCat].push(elID);
                
                materialStorage[elID] = {
                    'count' : element.count
                }
                if(!itemInfo[elID]) {
                    newItems.push(elID);
                }

        })
            let stupidSoybeanIndex = matStorageCategories[49].indexOf(97105, 0);
            let stupidSoybean = matStorageCategories[49].splice(stupidSoybeanIndex, 1);

            itemInfoParser(newItems);
            console.log(`fetchmat sent ${newItems.length} items`)
            setStorage('materialStorage', materialStorage);
            setStorage('matStorageCategories', matStorageCategories);
            populateMatStorage();
        })
        .catch(error => {
            console.error(error);
        })
}

    //Split item array and slow down fetch
async function itemInfoParser(data) {
    if(data.length < 1) {return}

    console.log(`InfoParser Starting: ${data.length} items in queue.`)
    const interval = setInterval(() => {
        if (data.length === 0) {
            clearInterval(interval);
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
    fetch(`https://api.guildwars2.com/v2/items?ids=${items}`)
        .then(response => {
            if(!response.ok) {
            throw new Error('FetchItemInfo Error');
        }
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                itemInfo[item.id] =  {
                name : item.name,
                webIcon : item.icon,
                localIcon : ''
            }
            newItemInfo.push(item.id);
            }
            )
            setStorage('newItemInfo', newItemInfo);
            setStorage('itemInfo', itemInfo);
            linkFixer(newItemInfo);
        })
        .catch(error => {
            console.log(error);
        })
        console.log('FetchItemInfo done')
}

// document.getElementById('functionTrigger').addEventListener('click', linkFixer);

function linkFixer(input) {
    console.log(`linkFixer: ${input}`);
    input.forEach(element => {
        if(itemInfo[element].webIcon && !itemInfo[element].localIcon) {
            itemInfo[element].localIcon = itemInfo[element].webIcon.split('/').pop();
        } 
    });
}

//Fetch bank and handle bankStorage
async function fetchBank() {
    fetch(`${apiUrl}account/bank?access_token=${authToken}`)
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
        newBankStorage[0] = { 'count' : 0};
        data.forEach(item => {
            console.log(item);
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
        newBankStorage[0].count = emptyCount;
        setStorage('bankStorage', newBankStorage);
        itemInfoParser(newItems);
        populateBank();
    })
    .catch(error => {
        console.log(error);
    })
};



//Anonymous function trigger for custom data manipulation

// document.getElementById('functionTrigger').addEventListener('click',() => {
//         let newURL = [];
//         console.log('linkFixer go!')
//         for (let obj in itemInfo) {
//             // console.log(obj);
//             if(itemInfo[obj].webIcon && itemInfo[obj].localIcon === '') {
//                 let oldURL = itemInfo[obj].webIcon.split("").reverse();
//                 // console.log(oldString);
//                 while(oldURL[0] !== '/') {
//                     newURL.unshift(oldURL.shift());
//                 }
//                 itemInfo[obj].localIcon = newURL.join("");
//                 console.log(`${obj} : ${newURL.join("")}`);
//                 newURL.splice(0, newURL.length);
//             }
//         }
//         console.log('LinkFixer done');
//   setStorage('itemInfo', itemInfo);
// })

export {
    fetchMatStorage,
    fetchBank,
    getNewToken
}