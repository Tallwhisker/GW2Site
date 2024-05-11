//const authToken = '?access_token=A3654FC9-D58C-4042-90A4-DADEC5420D9C27304699-B424-4768-8444-D84564C142A7';

const authToken = localStorage.getItem('authToken');
const permissions = localStorage.getItem('Permissions');
const inventory = localStorage.getItem('Inventory');
const wallet = localStorage.getItem('Wallet');

    //Define butonz
// const permissionTrigger = document.getElementById('permTrigger');
const apiUrl = 'https://api.guildwars2.com/v2/';

    //Standalone API key control & input
async function permissionControl() {
    // If Token -> Fetch permissions
    if(localStorage.getItem('authToken')) {
        await fetch(`${apiUrl}tokeninfo?access_token=${authToken}`)
        .then(response => {
            if(!response.ok) {
                throw new Error('Fetch: Response not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('Permissions',data.permissions.toString());
        })
        .catch(error => {
            console.error('Error:', error);
        })
        // localStorage.setItem('Permissions',permissions[permissions].toString());
    } else if (!authToken) {
        let getToken = window.prompt('GW2 Account token');
        localStorage.setItem('authToken', getToken.toString());
    }
}
// permissionTrigger.addEventListener('click', permissionControl());


    //Central API Fetcher
async function fetchData(target) {
    fetch(`https://api.guildwars2.com/v2/${target}?access_token=${authToken}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('Fetch: Response not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetch: Returning data');
        return data;
    })
    .catch(error => {
        console.error('Error:', error);
    })
}

    //Update and write inventory data
async function updateInventory() {
    if(permissions.some('inventories'))
        fetchData('account/inventory').then(data => {
            data.forEach(element => {
                inventory[element.id] = {
                    'id' : element.id, 
                    'name' : '',
                    'count' : element.count,
                    'category' : element.category,
                    'binding' : element.binding,
                    'buyorder' : 0,
                    'sellorder' : 0,
                    'icon' : '',
                }
                console.log(`Updated ID: ${element.id}`);
            })
            localStorage.setItem('inventory',inventory.toString());
    })
}


