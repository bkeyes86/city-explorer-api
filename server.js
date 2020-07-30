'use strict';

// Application Dependencies
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg =require('pg');
const cors = require('cors');



// Application Setup
const app = express(); //
const PORT = process.env.PORT || 3004; //
app.use(cors());
if(!process.env.DATABASE_URL) {
  throw new Error('Missing database URL.');
}
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {throw err; });


// Route Definition
app.get('/', rootHandler);
app.get('/location', locationHandler);
app.get('/yelp', restaurantHandler);
app.get('/weather', weatherHandler);
app.use(errorHandler);
app.use('*', notFoundHandler);

// Route handlers
function rootHandler(request, response) {
  response.status(200).send('City Explorer back-end')

}
function locationHandler(request, response) {
  const city = request.query.city;
  const url = 'https://us1.locationiq.com/v1/search.php';
  superagent.get(url)
    .query({
      key: process.env.LOCATION_KEY,
      q: city,
      format: 'json'
    })
    .then(locationIQResponse => {
      const topLocation = locationIQResponse.body[0];
      const myLocationResponse = new Location(city, topLocation);
      response.status(200).send(myLocationResponse);
    })
    .catch(err => {
      console.log(err);
      errorHandler(err, request, response);
    });
}
function restaurantHandler(request, response) {
  const queryString = request.query;
  console.log(queryString);
  const lat = parseFloat(request.query.latitude);
  const lon = parseFloat(request.query.longitude);
  const currentPage = request.query.page;
  const numPerPage = 4;
  const start = ((currentPage - 1) + numPerPage + 1);
  const url = 'https://api.yelp.com/v3/businesses/search';
  superagent.get(url)
    .query({
      latitude: lat,
      longitude: lon,
      limit: numPerPage,
      offset: start
    })
    .set('Authorization', `Bearer ${process.env.Yelp_Key}`)
    .then(yelpResponse => {
      const arrayOfRestaurants = yelpResponse.body.businesses;
      const restaurantsResults = [];
      arrayOfRestaurants.forEach(restaurantObj => {
        restaurantsResults.push(new Restaurant(restaurantObj));
      });
      response.send(restaurantsResults);
    })
    .catch(err => {
      console.log(err);
      errorHandler(err, request, response);
    });
}

function trailsHandler(request, response) {
 
  const url = `https://www.hikingproject.com/data/get-trails/${queryParams.lng},${queryParams.lat}.json`;

  const queryParams = {
    access_token: process.env.TOKEN_KEY,
    types: 'poi',
    limit: 10,
    const lat = request.query.latitude;
    const lng = request.query.longitude;
  };


  superagent.get(url)
    .query(queryParams)
    .then((data) => {
      const results = data.body;
      const places = [];
      results.features.forEach(entry => {
        places.push(new places(entry));
      });
      response.send(places);
    })

    .catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('So sorry, something went wrong.');

    });

}

function Place(data) {
  this.name = data.text;
  this.type = data.properties.category;
  this.address = data.place_name;
}

function weatherHandler(request, response) {

  const url = `https://api.weatherbit.io/v2.0/current/${queryParams.lng},${queryParams.lat}.json`;
  const queryParams = {
    lat: request.query.latitude,
    lng: request.query.longitude,
  };
  superagent.get(url)
    .set('user-key', process.env.WEATHER_KEY)
    .query(queryParams)
    .then((data) => {
      const weatherResults = data.body;
      weatherResults.locations.map((location) => new Weather(location));

      response.send(weatherResults);

    })
    .catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('oops, it\s not working');
    });





}




function notFoundHandler(request, response) {
  response.status(404).send('404 - Not Found');
}
function errorHandler(error, request, response, next) {
  response.status(500).json({error: true, message:error.message});

}

function Location(city, locationData) {
  this.search_query = city;
  this.formatted_query = locationData.display_name;
  this.latitude = parseFloat(locationData.lat);
  this.longitude = parseFloat(locationData.lon);
}
function Restaurant(obj) {
  this.name = obj.name;
  this.url = obj.url;
  this.rating = obj.rating;
  this.price = obj.price;
  this.image_url = obj.image_url;
}
function Weather(conditions) {
  this.time = conditions.valid_date;
  this.forecast = conditions.weather.description;
}

client.connect()
.then(() => {
console.log('Postgres connected.');
app.listen((PORT,() => console.log('Listening on port ${PORT}'));
})
.catch(err => {
throw `Postgres error: ${err.message}`;
});
