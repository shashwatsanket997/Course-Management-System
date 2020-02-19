# Course-Mangement-System
A Course Management System(``CMS``) is an online environment for course interactions between professsors and students. The application has ``3`` types of users as ``Student``, ``Professor`` and ``Admin``. Each with different set of permissions and functionalities. The project is built on ``Node Js`` and ``Pug`` as template rendering system. The ``Code Structure`` strictly follows ``Model-Routes-Controllers-Services structure``.

## Table of contents

- [Features](#features)
- [What's Included](#whats-included)
- [Quick Start](#quick-start)
- [Documentation](#documentation)

## Features
+ A ``cookie-session`` based ``authentication`` system. To manage the context and track of different types of users.
+ ``3`` types of users ``Student``, ``Professor``, ``Admin``
+ ``Course Registration System`` : ``Student`` can register set of available courses based on the registration ``limit``. Moreover it can deregister the registered courses.
+ ``Student`` can view their registered courses on the home page.
+ ``Professor`` can create courses or can invite other professors for collaboration using `` Collaboration via invitation``
+ ``Professor`` or collaboraters can ``edit`` their respective courses. Edit course means the ``duration``, ``limit of registration`` and ``content``
+ ``Professor`` specifically the creator of the course can ``delete`` the course. 
+ ``Professor`` can accept invitation for collaboration from other professors.
+ ``Admin`` can ``Create``, ``Read`` ,``Edit``, ``Delete`` the courses on the portal.
+ ``Admin`` can also manage the collaboration of the particular course.
+ ``Collaboration via invitation``: A feature which enables the professors to send and accept invitation for collaboration.

## What's Included
The structure of the code strictly follows ``Model-Routes-Controllers-Services``. Here in this project 
+ The ``models`` contains pseudo database entries.
+ The ``routes`` contains all the availble endpoints, and serve as mapping of url with its associated controller
+ The ``controllers`` are mainly responsible for input validation and rendering the respective pages
+ The ``services`` are those which interacts with the database(here the ``Pseudo`` database) and prepares the data as requested by users

Apart from this, the project has ``validators``, ``const``,``views``.
+ ``validators`` contains all the validation logic and constraints.
+ ``const`` contains all the ``constants``,``Enum`` for this project as well as ``publicUrls`` the routes that does'nt seek authentication.
+ ``views`` has pug files which will server during page rendering. Each pug views is been extended with layout.pug which acts as master template.
For detailed Code convention refer ``convention.md``.

## Quick Start

  1. Clone the repository 
  2. cd into the folder with the project files
  3. ```run npm install ``` command. It should install the ```express```, ```express-session```,```express-validators```,```pug```, ```lodash``` and ```body-parser``` packages and install them locally. 
  4. Once installation completed. 
  5. run ```node app.js``` to start the project.

## Documentation

Each API written, has a ```common series flow``` as an API is first listed in routes.js along with its validator(which act as the middleware). If the route is public, then it is mentioned in const.js as a non-public URL will seek authentication and will redirect to login using the access middleware defined in app.js. Each route has its respective controller, which validates the body, params or query if provided. If validation fails, it re-render the page with the validation error. It also checks the permission of the accessing user, on unauthorized access it re-render the page with authorization error. If valid permission, its respective service is called which interacts with model and prepare the data for the respective page. The service returns promise if the promise rejects with error the respective controller will catch the error and re-render accordingly. And if it resolves with the data, the controller will render the page with the data accordingly.
