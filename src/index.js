const fetch = require("node-fetch");
const jpath = require("JSONPath");
const _ = require("lodash");

"use strict";

const fetchSensorData = (sensorID) => {

    const order = (data) => _.orderBy(data, "timestamp", "asc");

    const last = (data, expr) => _.last(jpath({json: data, path: expr}));

    const lastFloat = (data, expr) => parseFloat(last(data, expr));

    return fetch("http://api.luftdaten.info/v1/sensor/" + sensorID + "/")
        .then((res) => res.json())
        .then(order)
        .then((data) => ({
            id: sensorID,
            location: {
                longitude: lastFloat(data, "$..location.longitude"),
                latitude: lastFloat(data, "$..location.latitude"),
                altitude: lastFloat(data, "$..location.altitude"),
            },
            PM10: lastFloat(data, "$..sensordatavalues[?(@.value_type=='P1')]/.value"),
            PM2_5: lastFloat(data, "$..sensordatavalues[?(@.value_type=='P2')]/.value"),
            timestamp: last(data, "$..timestamp")
        }));
}

module.exports = {
    lookup : fetchSensorData
};
