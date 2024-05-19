The goal of my project was to retrieve and display the inventories of my game account dynamically with JavaScript.

To achieve this, I

    Set up GIT to easier track progress and changes
    Request API data with API keys via ?query (I initially tried request headers, but they didn't work in browser due to CORS)
    Store/retrieve the data in the browsers localStorage
    Created a HTML & CSS structure to support JavaScript implementation
    Use JavaScript module structure to isolate by concern
    Use JavaScript to dynamically create elements with gathered data that adjusted elements to a predetermined structure.
    Reduced initial API load by pre-loading ~650 items worth of name and URL data via exporting a module.


The biggest challenge was modifying the data and converting it to/from storage.