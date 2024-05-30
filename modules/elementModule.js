import { 
    itemInfo,
    itemNameChecker
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
async function spawnCategoryGrid(name, target) {
    const newItemGrid = document.createElement('div');

    newItemGrid.setAttribute('class', 'itemGrid');
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
    let rarity = "";
    let iconURL = './icons/spaghet.png';

    if(itemInfo[itemID]){
        if(itemInfo[itemID].localIcon) {
            iconURL = `./icons/${itemInfo[itemID].localIcon}`;
        } 
        else if (itemInfo[itemID].webIcon) {
            iconURL = itemInfo[itemID].webIcon;
        }

        if(itemInfo[itemID].rarity) {
            rarity = itemInfo[itemID].rarity;
        }
    };

    newItemImg.setAttribute('class', `itemImg ${rarity}`);
    newItemImg.setAttribute('src', iconURL);

    document.getElementById(target).appendChild(newItemImg);
};


//Creates new element for item name and appends to target
async function spawnItemName(itemID, target) {
    const nameP = document.createElement('p');

    nameP.setAttribute('class', 'itemName');
    nameP.innerHTML = itemNameChecker(itemID); //Function in dataHandler module
    document.getElementById(target).appendChild(nameP);
};


//Creates new element for item amount and appends to target
async function spawnItemCount(amount, target) {
    const countP = document.createElement('p');

    countP.setAttribute('class', 'itemAmount');
    countP.innerHTML = amount ? amount : 0;
    document.getElementById(target).appendChild(countP);
};


export {
    spawnCategoryTitle,
    spawnCategoryGrid,
    spawnItemDiv,
    spawnItemIcon,
    spawnItemName,
    spawnItemCount
};