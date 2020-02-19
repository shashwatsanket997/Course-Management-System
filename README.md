# Course-Mangement-System
A Course Management System(``CMS``) is an online environment for course interactions between professsors and students. The application has ``3`` types of users as ``Student``, ``Professor`` and ``Admin``. Each with different set of permissions and functionalities. The project is built on ``Node Js`` and ``Pug`` as template rendering system. The ``Code Structure`` strictly follows ``Model-Routes-Controllers-Services structure``.

## Table of contents

- [Features](#features)
- [What's Included](#whats-included)
- [Quick Start](#quick-start)
- [Dependencies](#documentation)

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

``Code Structure``
``
root
└── controllers/
      ├── auth.controller.js
      ├── cms.controller.js
├───models
      ├──Collaboration.js
      ├──CourseRegistrations.js
      ├──Courses.js
      ├──Invitations.js
      ├──Users.js
├───routes
      ├──routes.js
├───services
      ├──auth.service.js
      ├──cms.service.js
├───utils
├───validators
      ├──validators.js
└───views
      ├── --
``
