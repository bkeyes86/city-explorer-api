'use strict';

// Application Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Application Setup 
const app = express(); //
const PORT = process.env.PORT || 3000; //
app.use(cors());


// Route Definition
app.use(errorHandler);
app.use('*', notFoundHandler);

// Route handlers
function rootHandler(request, response) {
  response.status(200).send('City Explorer back-end')

}
function locationHandler(request, response) {
  const city = 'seattle';
  const locationData = require('./data/location.json');
  const location = new Location(city, locationData)
  response.status(200).send(location);
}

function notFoundHandler(request, response) {
  response.status(404).send('404 - Not Found');
}
function errorHandler(error, request, response, next) {
  response.status(500).json({error: true, message:error.message});
}

function Location(city, locationData) {
  this.search_query = city;
  this.formatted_query = locationData[0].display_name;
}

// App listener
app.listen(PORT,() => console.log(`Listening on port ${PORT}`)); //


