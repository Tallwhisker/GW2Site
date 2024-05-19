The goal of this project was to retrieve and display the inventories of my game account in GW2 with JavaScript.

I needed to use an authorized API, modify the data after my needs and then store it. Since I have no server structure available I decided to use the browsers localStorage.

The biggest challenge was to structure the data in a way that was then easy to manage. It took a few iterations.


Early on I realized that having everything bunched into 1 file wasn't gonna work, so I split things up in modules with the added bonus of separation of concern.

main.js 
Handles most logic and triggering of data gathering & processing as well as eventListeners outside of module-specific things.

bankStorage, characterBags & materialStorage modules
Handle their own part of gathering, processing and then displaying their respective inventory type.

storageHandler
This module was needed because of the way localStorage stores things. Everything going in becomes an object, but getting it from localStorage provides a string. So the logical solution would be to make a function that retrieves data from memory, format it to what I need and then return that.

dataHandler
This module essentially handles everything related to item data. When an inventory module finds an unrecognized item it sends it to this module.
The dataHandler module then adds the recieved items to a queue, and an iterator will chip away 1-50 items per time from the queue as to not overload the API with requests. 
This is the only module with ability to write item data to localStorage.
There was a lesson to be learnt before I ended up at this setup.

itemInfo.js
This module exists entirely for the purpose of providing "starting data" for items found in structured storage (Material Storage) where the items don't change very often. 
The purpose of this is only to reduce the initial load on the API when first setting up the data structure.
It contains data for 655+ items as well as the category names for the material storage.

Related to this, I also retrieved the same amount of icons to further reduce API load and provide these via the "./icons/" folder.

