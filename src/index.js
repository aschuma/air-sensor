const fetch = require("node-fetch");
const jpath = require("JSONPath");
const _ = require("lodash");

"use strict";

const fetchSensorData = (sensorID) => {

    const order = (data) => _.orderBy(data, "timestamp", "asc");

    const last = (data, expr) => _.last(jpath({json: data, path: expr}));

    const mapData = function (data) {

        if (data.length === 0) {
            return {};
        } else {

            const timestamp = last(data, "$..timestamp");
            const pm10 = last(data, "$..sensordatavalues[?(@.value_type=='P1')]/.value");
            const pm2_5 = last(data, "$..sensordatavalues[?(@.value_type=='P2')]/.value");
            const temperature = last(data, "$..sensordatavalues[?(@.value_type=='temperature')]/.value");
            const humidity = last(data, "$..sensordatavalues[?(@.value_type=='humidity')]/.value");

            const answer = {
                id: sensorID,
                location: {
                    longitude: parseFloat(last(data, "$..location.longitude")),
                    latitude: parseFloat(last(data, "$..location.latitude")),
                    altitude: parseFloat(last(data, "$..location.altitude")),
                    country: last(data, "$..location.country")
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

    return fetch("http://api.luftdaten.info/v1/sensor/" + sensorID + "/")
        .then((res) => res.json())
        .then(order)
        .then(mapData);
};

module.exports = {
    lookup: fetchSensorData
};
