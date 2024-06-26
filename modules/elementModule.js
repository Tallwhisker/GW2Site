import { 
    itemInfo,
    itemNameShortener,
    getItemIcon,
    getItemName,
    getItemRarity
} from "./dataHandler.js";


//Creates new element for title and appends to target
async function spawnCategoryTitle(name, target, child) {
    const newH2 = document.createElement('h2');
    
    newH2.setAttribute('id', name);
    newH2.setAttribute('class', 'gridCategory');
    newH2.innerHTML = name;

    //Set category H2 element event listener to hide the category grid
    newH2.addEventListener('click', () => {

        let targetGrid = document.getElementById(child);
        if(targetGrid.style.display === 'none') {
            targetGrid.style.display = '';
        } 
        else {
            targetGrid.style.display = 'none';
        };
    });

    document.getElementById(target).appendChild(newH2);
};


//Creates new element for grid container and inserts after target
async function spawnCategoryGrid(name, target, type) {
    const newItemGrid = document.createElement('div');

    newItemGrid.setAttribute('class', type);
    newItemGrid.setAttribute('id', name);

    document.getElementById(target).insertAdjacentElement('afterend', newItemGrid);
};


//Creates new element for item container and appends to target
async function spawnItemDiv(name, target) {
    const newItemDiv = document.createElement('div');

    newItemDiv.setAttribute('id', name);
    newItemDiv.setAttribute('class', 'item');

    document.getElementById(target).appendChild(newItemDiv);
};


//Creates new element for item icon and appends to target
async function spawnItemIcon(itemID, target) {
    const newItemImg = document.createElement('img');

    //Set default values in case of no item data.
    // let rarity = "";
    // let iconURL = './icons/spaghet.png';

    // if(itemInfo[itemID]){
    //     if(itemInfo[itemID].localIcon) {
    //         iconURL = `./icons/${itemInfo[itemID].localIcon}`;
    //     } 
    //     else if (itemInfo[itemID].webIcon) {
    //         iconURL = itemInfo[itemID].webIcon;
    //     }

    //     if(itemInfo[itemID].rarity) {
    //         rarity = itemInfo[itemID].rarity;
    //     }
    // };

    //Functions -> dataHandler module
    let itemName = getItemName(itemID);
    let itemIcon = getItemIcon(itemID);
    let itemRarity = getItemRarity(itemID);

    newItemImg.setAttribute('src', itemIcon);
    newItemImg.setAttribute('class', `itemImg ${itemRarity}`);
    newItemImg.setAttribute('alt', itemName);

    document.getElementById(target).appendChild(newItemImg);
};


//Creates new element for item name and appends to target
async function spawnItemName(itemID, target) {
    const nameP = document.createElement('p');

    nameP.setAttribute('class', 'itemName');
    nameP.innerHTML = itemNameShortener(itemID); //Function in dataHandler module
    document.getElementById(target).appendChild(nameP);
};


//Creates new element for item amount and appends to target
async function spawnItemCount(amount, target) {
    const countP = document.createElement('p');

    countP.setAttribute('class', 'itemAmount');
    countP.innerHTML = amount ? amount : 0;
    document.getElementById(target).appendChild(countP);
};

async function spawnSearchList(id, target) {

    const newListDiv = document.createElement('div');
    // const newH2 = document.createElement('h2');
    // const newUL = document.createElement('ul');
    // const newIcon = document.createElement('img');

    // let name = itemInfo[id].name;
    // let rarity = itemInfo[id].rarity;
    // let itemIcon = './icons/spaghet.png';

    // if(itemInfo[id].localIcon) {
    //     itemIcon = `./icons/${itemInfo[id].localIcon}`;
    // } 
    // else if (itemInfo[id].webIcon) {
    //     itemIcon = itemInfo[id].webIcon;
    // }

    let itemName = getItemName(id);
    let itemIcon = getItemIcon(id);
    let itemRarity = getItemRarity(id);

    newListDiv.setAttribute('id', `SC-${id}`);
    newListDiv.setAttribute('class', 'searchContainer');
    
    // newIcon.setAttribute('class', `${rarity}`);
    // newIcon.setAttribute('src', itemIcon);
    // document.getElementById(`SC-${id}`).appendChild(newIcon);
    
    // newH2.setAttribute('id', `searchTitle-${id}`);
    // newH2.setAttribute('class', 'searchTitle');
    // newH2.innerHTML = name;
    // document.getElementById(`SC-${id}`).appendChild(newH2);
    
    // newUL.setAttribute('id', `UL-${id}`);
    // newUL.setAttribute('class', "itemList");
    // document.getElementById(`SC-${id}`).appendChild(newUL);
    
    newListDiv.innerHTML = 
    `<img class="${itemRarity}" src="${itemIcon}">
    <h2 id="searchTitle-${id}" class="searchTitle">${itemName}</h2>
    <ul id="UL-${id}" class="itemList"></ul>`
    
    document.getElementById(target).appendChild(newListDiv);
};

async function spawnListItem(name, amount, ri, id) {

    const newLI = document.createElement('li');

    newLI.setAttribute('id',`LI-${id}RI${ri}`);
    newLI.setAttribute('class', 'itemPoint');
    newLI.innerHTML = `${amount} - ${name}`;
    document.getElementById(`UL-${id}`).appendChild(newLI);

};


export {
    spawnCategoryTitle,
    spawnCategoryGrid,
    spawnItemDiv,
    spawnItemIcon,
    spawnItemName,
    spawnItemCount,
    spawnListItem,
    spawnSearchList
};