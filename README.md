# Guild Wars 2 Inventory Viewer
Fan project 

The goal of this project was to retrieve and display the inventories of my game account in GW2 with JavaScript via the provided game API.

I needed to use an authorized API, modify the data after my needs and then store it. Since I have no server structure available I decided to use the browsers localStorage.

The biggest challenge was to structure the data in a way that was then easy to manage. It took a few iterations.


## Modules



### main.js
Handles most logic and triggering of data gathering & processing as well as eventListeners outside of module-specific things.



### bankStorage, characterBags & materialStorage modules
Each of these modules handle their own inventory. After being initialized by the main they gather, process, store and display their inventory.
The only data gathered outside of their respective module is item name. This is queried via the **dataHandler module** since that module will have the latest item information.



### storageHandler
This module was needed because of the way localStorage stores things. Everything going in becomes an object but needs to be input as string, and getting it out of localStorage provides a string. 
So the logical solution would be to make a function that retrieves data from memory, format it to what I need and then return that.
Also has the added benefit of reducing the code needed in other functions to gather data from localStorage.



### itemInfo
This module exists entirely for the purpose of providing "starting data" for items found in structured storage (Material Storage) where the items don't change very often, plus a chunk of items that I had in my bags during creation.

The purpose for this is strictly to reduce the initial load on API requests when you first start using the app, as well as provide locally-hosted images for already-known items to further reduce neccessary requests.

It contains data for 700+ items with itemID, itemName and localIcon.
Upon inserting an API key this information is saved to the localStorage.



### dataHandler
This module essentially handles everything related to item data. When an inventory module finds an unrecognized item it sends it to this module.
The dataHandler module then adds the recieved items to a queue, and an iterator will chip away 1-50 items per iteration from the queue as to not overload the API with requests. 
This is the only module with ability to write *item data* to localStorage.
There was a lesson to be learnt before I ended up at this setup.



This being my favorite module, I want to explain more about it.

>I initially had all modules handle their own *new data* and save it when done, but this proved to be rather problematic due to them occassionally overwriting eachothers data and as such losing data.
>I needed a more structually controlled environment for this data.
>
>The solution is rather simple. Each module has a check if the current itemID exists in *itemData* and if not, sends them to **itemInformationStart** in dataHandler as an array.
>
>The **itemInformationStart** function uses a global variable called *itemQueueSignal* that is initialized to **0**. Upon being called the function iterates through the provided array to set up initial data structure in *newItems* and then sends the itemIDs to the global variable *itemQueue*, and **if** the *itemQueueSignal* is **0**, set it to **1** and call the **itemQueueHandler**.
>
>The **itemQueueHandler** in turn is essentially a loop at 5s intervals that perform some checks on the *itemQueue*. 
>
>1. IF *itemQueue* empty => 
>    get *newItemInfo* from storage
>    Iterate through *newItemInfo* and write data from *newItems* to *itemInfo* for each itemID provided. (explained further below)
>    Save *itemInfo* to localStorage, reset the *newItems*, trigger refresh of inventories and lastly turn itself off and set *itemQueueSignal* to **0**.
>
>2. ELSE IF *itemQueue* bigger than 50 items =>
>    send 50 items to *fetchItemInfo*
>
>3. ELSE
>    send remaining items to *fetchItemInfo*
>
>The **fetchItemInfo** function receives a joined string with items, inserts it into the API URL and then iterates through the response, overwriting data in *newItems* (previous templates) as well as any itemID it receives back to *newItemInfo*.
>Then it saves *newItemInfo* to localStorage.
>
>The variable *newItemInfo* is needed to cross-check that any sent item request *actually* comes back with data, otherwise the template that *itemInformationStart* creates is saved to the *itemData*. 
>Otherwise this would mean that any failed item request would get saved incorrectly and be unable to be requested again due to the modules finding the itemID in *itemData*.
>
>So essentially, any errors -> item won't be saved, and if there's new items, they'll get requested. 
>Potential issue if there's repeat offenders. 
>
>
>**itemNameChecker** also lives in the **dataHandler** module.
>This function is called from each inventory module and checks, corrects and returns the item names. (or if item doesn't exist, a default value)
>
>Due to self-inflicted layout issues with some item names, I needed a solution to force them into some resemblance of order. 
>So this function caps the word count and word length if they exceed the limits, then return the new more organized name.
>
>Take "Wurm's WvW Reward Track Blessing Enrichment" for example, it's veery long.
>This reduces it to "Wurm's ... Blessing Enrichm.." to fit the layout.
>
>This function also comes with the benefit of letting all inventory modules render their items immediately, before any new items are handled using the provided default values.




### Copyright

© ArenaNet LLC. All rights reserved. NCSOFT, ArenaNet, Guild Wars, Guild Wars 2, GW2, Guild Wars 2: Heart of Thorns, Guild Wars 2: Path of Fire, Guild Wars 2: End of Dragons, and Guild Wars 2: Secrets of the Obscure and all associated logos, designs, and composite marks are trademarks or registered trademarks of NCSOFT Corporation.


> https://www.arena.net/en/legal/content-terms-of-use


I do not allow any redistribution of the project, in parts or in its entirety without prior written approval.