const fetch = require("node-fetch");
const jpath = require("JSONPath");
const _ = require("lodash");

"use strict";


const order = (data) => _.orderBy(data, "timestamp", "asc");

const reverse = (data) => _.reverse(data);

const filter = (sensorID) => (data) => _.filter(data, (item) => item.sensor.id === sensorID);

const extract = (data, expr) => _.last(jpath({json: data, path: expr}));

const mapData = (sensorID) => (data) => {

    if (data.length === 0) {
        return {};
    } else {

        const id = extract(data, "$..sensor.id");
        const timestamp = extract(data, "$..timestamp");
        const pm10 = extract(data, "$..sensordatavalues[?(@.value_type=='P1')]/.value");
        const pm2_5 = extract(data, "$..sensordatavalues[?(@.value_type=='P2')]/.value");
        const temperature = extract(data, "$..sensordatavalues[?(@.value_type=='temperature')]/.value");
        const humidity = extract(data, "$..sensordatavalues[?(@.value_type=='humidity')]/.value");

        const answer = {
            id: sensorID || id,
            location: {
                longitude: parseFloat(extract(data, "$..location.longitude")),
                latitude: parseFloat(extract(data, "$..location.latitude"))
            },
            timestamp: timestamp
        };

        if (pm10 !== undefined) {
            answer.type = "PM";
            answer.PM10 = parseFloat(pm10);
            answer.PM2_5 = parseFloat(pm2_5);

        } else if (temperature !== undefined) {
            answer.type = "temperature";
            answer.temperature = parseFloat(temperature);
            answer.humidity = parseFloat(humidity);
        } else {
            answer.type = "void";
        }

        return answer;
    }
};

const fetchSensorData = (sensorID) => fetch("http://api.luftdaten.info/v1/sensor/" + sensorID + "/")
    .then((res) => res.json())
    .then(order)
    .then(mapData(sensorID));

const fetchSensorDataAvg = (sensorID) => fetch("http://api.luftdaten.info/static/v2/data.24h.json ")
    .then((res) => res.json())
    .then(filter(sensorID))
    .then(order)
    .then(mapData(sensorID));

const fetchSensorDataOfArea = (longitude, latitude, distance) => fetch("http://api.luftdaten.info/v1/filter/area=" + longitude + "," + latitude + "," + distance)
    .then((res) => res.json())
    .then(order)
    .then(reverse)
    .then((data) => _.uniqBy(data, (it) => it.sensor.id))
    .then((data) => _.map(data, (value) => [value]))
    .then((data) => _.map(data, mapData()));

module.exports = {
    lookup: fetchSensorData,
    lookupArea: fetchSensorDataOfArea,
    lookup24hAvg: fetchSensorDataAvg
};
