'use strict';

require('dotenv').config();

//Global variables for server.js
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const PORT = process.env.PORT;
const app = express();
app.use(cors());

//this is our grouping of .get's that will grab our information

app.get('/', (request, response) => {
  response.send('This is our Home Page');
});

app.get('/wrong', (request, response) => {
  response.send('OOPS! You did it again. Wrong route.');
});

app.get('/location', (request, response) => {
  try{
    // const geoData = require('./data/geo.json');
    const city = request.query.city;
    let key = process.env.GEOCODE_API_KEY;
    let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;

    // const locationData = new Location(city, geoData);
    superagent.get(url)
      .then( data => {
        const geoData = data.body[0]; //this is the first item
        const locationData = new Location(city, geoData);
        response.send(locationData);
      })
      .catch( () => {
        errorHandler('location broke', request, response);
      })

  }
  catch(error){
    errorHandler('Error 500! Something has gone wrong with the website server!', request, response);
  }
});

// ALL THINGS WEATHER
const weatherData = require('./data/darksky.json');

app.get('/weather', (request, response) => {
  try{
    const forecastData = weatherData.daily.data.map( obj => {
      let time =  new Date(obj.time * 1000).toString().slice(0,15);
      let forecast = obj.summary;
      // new Weather(time, forecast);
      let weatherObject = new Weather(time, forecast);
      return weatherObject;});
    response.send(forecastData);
  }
  catch(error){
    errorHandler('Error 500! Something has gone wrong with the website server!', request, response);
  }
});

// function convertWeatherData (weather) {
//   // const weatherData = require('./data/darksky.json');
//   // weather.daily.data.forEach( item => {
//   let time =  new Date(weather.time * 1000).toString().slice(0,15);
//   let forecast = weather.summary;
//   // new Weather(time, forecast);
//   let weatherObject = new Weather(time, forecast);
//   return weatherObject;
//   // forecastData.push(weatherObject);
// }
// This is our weather constructor function
function Weather(time, forecast) {
  this.time = time;
  this.forecast = forecast;
}
// This is our location constructor function
function Location(city, geoData){
  this.searchQuery = city;
  this.formattedQuery = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

function errorHandler(error, request, response) {

  response.status(500).send(error);
}

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
