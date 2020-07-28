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
app.get('/', rootHandler);
app.get('/location', locationHandler);
app.get('/yelp', restaurantHandler);
app.get('/weather', weatherHandler);

// Route handlers
function rootHandler(request, response) {
  response.status(200).send('City Explorer back-end')

}
function locationHandler(request, response) {
  const city = request.query.city;
  const locationData = require('./data/location.json');
  const location = new Location(city, locationData)
  response.status(200).send(location);
}

function restaurantHandler(request, response) {
  const restaurantsData = require('./data/restaurants.json');
  const arrayOfRestaurants = restaurantsData.nearby_restaurants;
  const restaurantsResults = [];
  arrayOfRestaurants.forEach(restaurantObj => {
    restaurantsResults.push(new Restaurant(restaurantObj));
  });
  response.send(restaurantsResults)
}

function weatherHandler(request, response) {
  const weatherData = require('./data/weather.json');
  const arrayOfWeatherData = weatherData.data;
  const weatherResults = [];
  arrayOfWeatherData.forEach(location => {
    weatherResults.push(new Weather(location));
  });
  response.send(weatherResults)
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
  this.latitude = parseFloat(locationData[0].lat);
  this.longitude = parseFloat(locationData[0].lon);
}
function Restaurant(obj) {
  this.name = obj.restaurant.name;
  this.url = obj.restaurant.url;
  this.rating = obj.restaurant.user_rating.aggregate_rating;
  this.price = obj.restaurant.price_range;
  this.image_url = obj.restaurant.featured_image;
}
function Weather(conditions) {
  this.time = conditions.valid_date;
  this.forecast = conditions.weather.description;
}

// App listener
app.listen(PORT,() => console.log(`Listening on port ${PORT}`)); //


