'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');


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
    const geoData = require('./data/geo.json');
    const city = request.query.city;
    const locationData = new Location(city, geoData);
    response.send(locationData);
  }
  catch(error){
    errorHandler('Error 500! Something has gone wrong with the website server!', request, response);
  }
});

app.get('/weather', (request, response) => {
  try{
    const weatherData = require('./data/darksky.json');
    const forecastData = [];
    weatherData.daily.data.forEach( item => {
      let time =  new Date(item.time * 1000).toString().slice(0,15);
      let forecast = item.summary;
      let weatherObject = new Weather(time, forecast);
      forecastData.push(weatherObject);
    });
    response.send(forecastData);
  }
  catch(error){
    errorHandler('Error 500! Something has gone wrong with the website server!', request, response);
  }
});
// this.time = new Date(day.time * 1000).toString().slice(0,15);
function Weather(time, forecast) {
  this.time = time;
  this.forecast = forecast;
}

function Location(city, geoData){
  this.searchQuery = city;
  this.formattedQuery = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

function errorHandler(error, request, response) {

  response.status(500).send(error);
}

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
