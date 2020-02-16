# Code Convention
The app structure strictly follows ``Model-Routes-Controllers-Services Code Structure``

+ Here the ``routes`` contains all the application endpoints
+ Each endpoints has its controller associated with it
+ The respective controller will be resposible for
    * `` request body validation `` 
    * `` Calling respective service to get the data``
    * `` Prepare the response accordingly``
+ The service called by the controller will be responsible for
    * `` preparing the results as requested `` Basically it will be interacting with models(database entities) to prepare the data according to the logic as coded.
    * `` Note ``: Service should always return `` promise `` 
----

### Other modules

+ `` Public ``: Contains all the static files for the pages like `` css ``, `` js `` etc.
+ `` const.js ``: Contains all the constants declared for the app
 