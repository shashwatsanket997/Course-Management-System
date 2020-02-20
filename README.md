# Course-Management-System
A Course Management System(``CMS``) is an online environment for course interactions between professsors and students. The application has ``3`` types of users as ``Student``, ``Professor`` and ``Admin``, each with different set of permissions and functionalities. The project is built on ``Node Js`` and ``Pug`` as template rendering system. The ``Code Structure`` strictly follows ``Model-Routes-Controllers-Services structure``.

## Table of contents

- [Features](#features)
- [Concepts Used](#concepts-applied)
- [What's Included](#whats-included)
- [Quick Start](#quick-start)
- [Documentation](#documentation)

## Features
+ A ``cookie-session`` based ``authentication`` system, to manage the context and track of different types of users.
+ ``3`` types of users ``Student``, ``Professor`` and ``Admin``.
+ ``Course Registration System`` : ``Student`` can register from a set of available courses based on the registration ``limit``. Moreover it can deregister the registered courses.
+ ``Student`` can view their registered courses on the home page.
+ ``Professor`` can create courses or can invite other professors for collaboration using `` Collaboration via invitation``
+ ``Professor`` or collaboraters can ``edit`` their respective courses. Editing a course contains the ``duration``, ``limit of registration`` and ``content``
+ ``Professor`` creating the course(not the collaborater) can ``delete`` the course. 
+ ``Professor`` can accept invitation for collaboration from other professors.
+ ``Admin`` can ``Create``, ``Read`` ,``Edit``, ``Delete`` the courses on the portal.
+ ``Collaboration via invitation``: A feature which enables the professors to send and accept invitation for collaboration.
+ ``Professor`` can see the status of collaboration request sent by them on home page
+  Proper request body validations are performed via the custom middlewares 
+ ``Pseudo Database`` is implemented, which reads the JSON files load it into memory. Along with internal event is triggered to save the current memory data(db data) back to the files, in certain interval of time [Read more](#pseudo-database) 

## Concepts Applied
1. Express.js, routes, middlewares 
2. Pug (Template Rendering engine) 
3. Express-validators( For validating req body) 
4. Express-sessions 
5. Body-parser 
6. lodash 
7. fs, paths, events (In Implementing  Pseudo Database)
8. Promises

## What's Included
The structure of the code strictly follows ``Model-Routes-Controllers-Services``. Here in this project 
+ The ``models`` contains pseudo database entries.
+ The ``routes`` contains all the availble endpoints and serves as mapping of url with its associated controller.
+ The ``controllers`` are mainly responsible for input validation and rendering the respective pages.
+ The ``services`` are those which interacts with the database(here the ``Pseudo`` database) and prepares the data as requested by users.

Apart from this, the project has ``validators``, ``const``,``views``.
+ ``validators`` contains all the validation logic and constraints.
+ ``const`` contains all the ``constants``,``Enum`` for this project as well as ``publicUrls`` the routes that does not seek authentication.
+ ``views`` has pug files which will server during page rendering. Each pug views has been extended with layout.pug which acts as master template.
For detailed Code convention refer ``convention.md``.

## Quick Start

  1. Clone the repository.
  2. cd into the folder with the project files.
  3. ```run npm install ``` command. It should install the ```express```, ```express-session```,```express-validators```,```pug```, ```lodash``` and ```body-parser``` packages and install them locally. 
  4. Once installation completed. 
  5. run ```node app.js``` to start the project.
#### Few Users for quick start  
| username | password | userType |
|----------|----------|------|
| root | asdf| professor |
| andrew | asdf | professor |
| shashwat | asdf | student |
| ishu | asdf | student |
| admin | asdf | admin |

## Documentation

Each API written, has a ```common series flow``` . An API is first listed in routes.js along with its validator(which act as the middleware). If the route is public, then it is mentioned in const.js. A non-public URL will seek authentication and will redirect to login using the access middleware defined in app.js. Each route has its respective controller, which validates the body, params or query if provided. If validation fails, it re-renders the page with the validation error. It also checks for the permission of the accessing user. On unauthorized access it re-render the page with authorization error. If permission is valid, its respective service is called which interacts with model and prepares the data for the respective page. The service returns promise. If the promise rejects with error the respective controller will catch the error and re-render accordingly. And if it resolves with the data, the controller will render the page with the data accordingly.

#### Pseudo Database
A simple JSON database management system, which is implemented to learn the crux behind the working of ``object oriented databases`` moreover to hava a grip on ``fs``, ``path`` and ``events`` libraries of nodeJs. The implementation can be found in ``/models/db.js``
##### Working
1. Read the multiple json files using  fs.readFile, Parse the data and load it in memory
2. Once the data is loaded, server is started.
3. After every ``T`` time(configurable in ``/const.js``) an event is triggered for Db checkpoint.
4. The event listner copy the current memory status(In-mem Db), writes back to their respective JSON file.
5. Inorder to maintain the ``consistency problem``(at granular level to limit the scope of project). Synchronous write(``fs.writeFileSync``) is used which blocks the main thread during the write process.

#### Permission Table
| Action | Student | Professor | Collaborating Prof |Admin|
|----------|----------|----------|-----------|--------|
| Add Course c1| No | Yes | No | Yes |
| Edit Course c1| No | Yes | Yes | Yes |
| Delete Course c1| No | Yes | No | Yes |
| Register Course c1| Yes | No | No | No |
| Deregister Course c1| Yes | No | No | No |
| Add collaborateres for c1| No | Yes | No | No|
| Send Collaboration Request| No | Yes | Yes | No |
| Accept Collaboration Request| No | Yes | Yes | No |

#### Template Rendering Routes -->

|Route| Method| IsPublic |Description|
|-----|-------|------------|--------|
|/login|``GET``| ``True`` | Renders index page which contains both register and login form |
|/login|``POST``| ``True``|For authentication |
|/register|``POST``|``True`` |For creating the user |
|/logout|``GET``| ``False``|Logging Out |
|/home|``GET``| ``False``| Renders home page according to the type of user |
|/courses/add|``GET``| ``False``| Renders Course Add page with form  |
|/courses/add|``POST``| ``False``| To submit the form  |
|/courses/:id|``GET``| ``False``| To get the details of particular course  |
|/courses/:id/edit|``GET``| ``False``| Renders the form with pre filled details of a particular course |
|/courses/:id/edit|``POST``| ``False``| For the form submission |
|/courses/:id/register|``POST``| ``False``| For registering the particular course |
|/courses/:id/deregister|``POST``| ``False``| For deregistering the particular course |
|/courses/:id/collaborations|``GET``| ``False``| Renders the collaboration page for managing collaborations |
|/courses/:id/collaborations/:username|``POST``| ``False``| Sending the collaboration request to user with username for course with id |
|/courses/:id/colaborate|``POST``| ``False``| Accepting the collaboration request for course with id |

``Note:`` At some places, delete or put method can be preffered but HTML forms does not support these two HTTP methods.

----



