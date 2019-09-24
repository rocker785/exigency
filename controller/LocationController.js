const LocationModel = require('../model/LocationModel');
const http = require('https');
const express = require('express');
const router = express.Router();
const GoogleMapsAPI = require('googlemaps');
const request = require('sync-request');

router.get('/allLocations', (req, res) => {
    LocationModel.find((err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            res.send(err);
        }
    })
});



router.post('/', async(req, res) => {
    var phone_number, name;

    var location = new LocationModel({
        latitude: req.body.latitude,
        longitude: req.body.longitude
    });

    location.save((err, docs) => {
        if (err) {
            res.send(JSON.stringify(err, undefined, 0));
        }
    })

    latitude = req.body.latitude;
    longitude = req.body.longitude;
    // 85.82736819029014    20.338958274723307


    //searching for hospitals nearby
    var hospitals = request('GET', `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=10000&type=hospitals&keyword=hospital&key=AIzaSyCMSaVefKTK1g01PuzUe9SO3ROleovzxvQ`);
    var data = JSON.parse(hospitals.getBody());
    var place_id = data.results[0].place_id;
    console.log("place_id = " + place_id);


    //searching for the details of the first hospitals
    var Details = request('GET', `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,rating,formatted_phone_number&key=AIzaSyCMSaVefKTK1g01PuzUe9SO3ROleovzxvQ`);
    var det = JSON.parse(Details.getBody());
    console.log(det);

    name = det.result.name;
    phone_number = det.result.formatted_phone_number;

    console.log("NAME = " + name);
    console.log("Phone = " + phone_number);

});

module.exports = router;