# HIS
A web based information system for keeping track of your possessions.

## Requirements
In order to execute HIS, you must have [node.js](https://nodejs.org/) and [SQLite](https://www.sqlite.org/) installed. HIS was developed with version 4.2.1 of node.js and 3.8.7.1 of SQLite.

To install the required modules, run `npm install` and it will download the latest versions of the required modules.

## Create database

To create the database that HIS uses, execute `sqlite3 [database name] <database_creation.sql`.

## Run HIS

To run HIS, execute `node app.js [database]`. HIS runs on port 80 and, as such, you need to run node with root privileges.
