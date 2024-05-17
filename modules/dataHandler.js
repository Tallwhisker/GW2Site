import { 
    getStorageObject, 
    setStorage,
    getStorageArray 
} from "./storageHandler.js";



// const apiUrl = 'https://api.guildwars2.com/v2/';


//Make Function for error checking


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
    const itemInfo = getStorageObject('itemInfo');
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
        })
        .catch(error => {
            console.log(error);
        })
        console.log('FetchItemInfo done')
}



//Anonymous speciality function trigger for custom data manipulation

// document.getElementById('functionTrigger').addEventListener('click',() => {

// })

export {
    itemInfoParser
}