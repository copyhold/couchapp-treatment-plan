# CouchDB Treatment plan
Provides client management and monthly and daily view of passed and future treatments (visits or etc)

[Demo](https://copyhold.cloudant.com/demo-beds/_design/krovati-couch/index.html)

username: login

password: password

Uses CouchDB for everything - store data , serve attachents , permissions , user management.
Uses React+Redux for frontend.

Webpack, nodemon, babel for prepare files.

# Usage

Clone,

Create *couchapp/.couchapprc* file with you database

Create users, you'll need to create an admin user. This way anonymous will be able to open the login page.

*webpack --watch --config webpack.conf.js*

*couchapp push* // from couchapp folder
