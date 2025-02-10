# Guild Wars 2 Inventory Viewer
Fan project 

This project requests data from a players account via the game API using their API key, then organizes it and displays it on the page.

This being entirely client-side, all client information is handled through localStorage in the users browser. 


## Modules

### main
Handles most logic and triggering of functions except module-specific things.
Handles API key and permissions from said API key.
localVersion is a variable that lets me force-reload the base item info in case it is required.
(Such as adding a new item property to store & display)

Exports API token & permissions


### bankStorage
### characterBags
### materialStorage 
Each of these modules handle their own inventory type. After being called they fetch their inventory, format it and send it to be displayed.
Data is organized in a two-dimensional array under their respective category.
The categories work on a [ itemID , count ] basis and request their item information from the variable **itemInfo** for display purposes.


### storageHandler
Functions here are called by other modules to send/retrieve data to/from localStorage and return the information formated to either string, object or array.
Also contains the function to write to localStorage.

Exports the **itemInfo** variable for item data
Imports the .data/itemInfo module at setup


### .data/itemInfo
This "module" exists entirely for the purpose of providing some starting data as well as hosting icons for said items.
It reduces the initial setup time and reduces the amount of off-site traffic.

It contains data for ~900+ items with itemID, itemName, localIcon, webIcon and rarity.
Upon inserting an API key this information is saved to the localStorage.


### elementModule
This module creates and appends all elements that the inventory modules need.
Initially they handled the creation themselves, but was then centralized to reduce duplicate code and enable easier expansion.


### dataHandler
This module handles everything related to item data. When an inventory module finds an unrecognized item it sends the itemID here.
The dataHandler module then adds the recieved items to a queue, and an iterator will chip away 200 items per iteration from the queue since the API has a ceiling for requests.
*This is the only module with ability to write item data to localStorage.*
*There was a lesson in data management to be learnt before I ended up at this setup.*

#### dataHandler Functions
>**itemInformationStart** uses a variable called *itemQueueSignal* that is initialized to **0**. Upon being called the function iterates through the provided array and adds any items not already queued to the queue, and **if** the *itemQueueSignal* is **0**, set it to **1** and call the **itemQueueHandler**.
>
>The **itemQueueHandler** in turn is essentially a loop at 1s intervals that perform some checks on the *itemQueue*. 
>Send a max of 200 items per iteration, if the queue is empty it turns itself off and sets the signal to **0**.
>
>The **fetchItemInfo** function receives a joined string with itemIDs, inserts it into the API URL and then iterates through the response and saves any items that are successfully requested.
>Then it saves *itemInfo* to localStorage.
>
>So essentially, any errors -> item won't be saved, and if there's new items, they'll get requested. 
>Potential issue if there's repeat offenders like the API giving me itemIDs that then return no data because they "don't exist".
>
>**itemNameChecker** also lives in the **dataHandler** module.
>This function caps the word count and word length if they exceed the limits, then return the new more organized name.
>Alternatively, if the item doesn't have a name yet it simply returns "Unknown: itemID" as the name.
>Coupled with the integrated icon-checks in the inventory modules, all items will have a default name and icon.





### Copyright

© ArenaNet LLC. All rights reserved. NCSOFT, ArenaNet, Guild Wars, Guild Wars 2, GW2, Guild Wars 2: Heart of Thorns, Guild Wars 2: Path of Fire, Guild Wars 2: End of Dragons, and Guild Wars 2: Secrets of the Obscure and all associated logos, designs, and composite marks are trademarks or registered trademarks of NCSOFT Corporation.


> https://www.arena.net/en/legal/content-terms-of-use
