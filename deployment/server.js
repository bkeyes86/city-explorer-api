'use strict';

// Application Dependencies
require('dotenv').config();
const express = require('express'); //

// Application Setup 
const app = express(); //
const PORT = process.env.PORT || 3000; //

// Route Definition
app.use(errorHandler);
app.use('*', notFoundHandler);

// Route Handlers


function notFoundHandler(request, response) {
  response.status(404).send('404 - No Found');
}
function errorHandler(error, request, response, next) {
  response.status(500).json({error: true, message:error.message});
}

// App listener
app.listen(PORT,() => console.log(`Listening on port ${PORT}`)); //
