//const authToken = '?access_token=A3654FC9-D58C-4042-90A4-DADEC5420D9C27304699-B424-4768-8444-D84564C142A7';
const apiUrl = 'https://api.guildwars2.com/v2/';

    //Get localStorage from input 'key'
function getStorage (key) {
    if(!localStorage.getItem(key)) {
        console.log(`No local data for ${key}`);
        return {};
    }
    let tempData = localStorage.getItem(key);
    console.log(`Reading local ${key}`);
    return JSON.parse(tempData);
}

    //Write localStorage data from iput 'key' and 'value'
function setStorage (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`Writing local ${key}`);
}

const authToken = localStorage.getItem('authToken') ? localStorage.getItem('authToken') : '';
const authPermissions = localStorage.getItem('tokenPermissions') ? localStorage.getItem('tokenPermissions') : [];
const inventory = getStorage('Inventory');
const wallet = getStorage('Wallet');



    //Define buttons
const permissionTrigger = document.getElementById('trigToken').addEventListener('click', permissionControl);
const matStorageTrigger = document.getElementById('trigMatStorage').addEventListener('click', updateMatStorage);


    //Check API key and/or request info
async function permissionControl() {
    //No token -> ask for token
    if (!localStorage.getItem('authToken')) {
        let getToken = window.prompt('GW2 API Key');
        localStorage.setItem('authToken', getToken.toString());
    }
    //Token permissions
    fetch(`${apiUrl}tokeninfo?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('Fetch: Response not ok');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('tokenPermissions', JSON.stringify(data.permissions));
        console.log(`Writing local tokenPermissions`);
    })
    .catch(error => {
        console.error('Error:', error);
    })
}


//     //Central API Fetcher
// async function fetchData(target) {
//     console.log(`Fetch: ${target}`);
//     fetch(`https://api.guildwars2.com/v2/${target}?access_token=${authToken}`)
//     .then(response => {
//         if(!response.ok) {
//             throw new Error('Fetch: Response not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Fetch: Returning data');
//         return data;
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     })
// }

    //Fetch material storage and write to inventory
async function updateMatStorage() {
    if(authPermissions.includes('inventories')) {
        fetch(`${apiUrl}account/materials?access_token=${authToken}`)
        .then(response => {
            if(!response.ok) {
                throw new Error('Fetch: Response not ok');
            }
            console.log(`Fetch matStorage OK`);
            return response.json();
        })
        .then(data => {
            data.forEach(element => {
                inventory[element.id] = {
                    'count' : element.count,
                    'category' : element.category,
                    'binding' : element.binding,
                }
                // console.log(`Added ID: ${element.id}`);
            })
            setStorage('Inventory', inventory);
        })
        .catch(error => {
            console.error('Error:', error);
        })} else {console.log(`No Permission for 'Inventory'`)
            alert('Account permission "inventory" missing.')
        };
}


