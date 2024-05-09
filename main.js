const materialStorage = [];
const inventoryBags = {lastUpdate: '', materials: []};
const itemValuesBuy = {lastUpdate: '',};
const itemValuesSell = {lastUpdate: '',};
const inventoryBank = {lastUpdate: '',};

const authToken = '?access_token=6DB85DFC-FEAF-EF46-9DF1-86A6D42CD11B8098D83A-762D-4F88-86F1-909C6384C08E';
const apiUrl = 'https://api.guildwars2.com/v2';

const inventory = {};
// const requestBody = {
//     method: 'GET',
//     headers: {
//         'Authorization': `Bearer ${authToken}`,
//     }
// };

function fetchMaterialStorage() {
    fetch(`${apiUrl}/account/materials${authToken}`)
        .then(response => {
            if (!response.ok) {
            throw new Error('fetchMaterialStorage: Network response not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('fetchMaterialStorage: Returning data');
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fetchBankTabs() {
    fetch(`${apiUrl}/account/bank${authToken}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('fetchBankTabs: Network response not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('fetchBankTabs: Returning data');
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        })
}

function fetchWallet() {
    fetch(`${apiUrl}/account/wallet${authToken}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('fetchWallet: Network response not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('fetchWallet: Returning data');
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        })
}

// updateMaterialStorage();

