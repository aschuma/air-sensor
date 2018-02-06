# air-sensor 

[![travis build](https://img.shields.io/travis/aschuma/air-sensor.svg?style=flat-square)](https://travis-ci.org/aschuma/air-sensor)
[![version](https://img.shields.io/npm/v/air-sensor.svg?style=flat-square)](http://npm.im/air-sensor)
[![downloads](https://img.shields.io/npm/dm/air-sensor.svg?style=flat-square)](http://npm-stat.com/charts.html?package=air-sensor&from=2018-01-04)
[![dependencies](https://img.shields.io/david/aschuma/air-sensor.svg?style=flat-square)](https://david-dm.org/aschuma/air-sensor)
[![dev dependencies](https://img.shields.io/david/dev/aschuma/air-sensor.svg?style=flat-square)](https://david-dm.org/aschuma/air-sensor#info=devDependencies)
[![MIT License](https://img.shields.io/npm/l/air-sensor.svg?style=flat-square)](http://opensource.org/licenses/MIT)

Looks up a single particulate-matter sensors of the [luftdaten network](http://luftdaten.info/en/home-en). 
You may zoom in the [map](http://maps.luftdaten.info/#2/0.0/0.0) to obtain the id of a sensor next to you. 

```
var sensor = require("air-sensor");

var sensorId = 9322;
sensor.lookup( sensorId ).then( 
   data => console.log( data ) 
);
```

In case the sensor is a PM sensor the subsequent structure is returned: 
```
{ 
   id: 9322,
   type: 'PM'
   location: { 
      longitude: 9.228, 
      latitude: 48.804
   },
   PM10: 6.4,
   PM2_5: 5.9,
   timestamp: '2018-02-04 14:38:08' 
}
```


In case the sensor is a temperature (celsius) sensor the subsequent structure is returned: 
```
{ 
   id: 9322,
   type: 'temperature',
   location: { 
      longitude: 9.228, 
      latitude: 48.804
   },
   temperature: 1.9,
   humidity: 85.7,
   timestamp: '2018-02-04 14:38:08' 
}
```

There is also a method returning a 24h average value. The output format remains the same as above.

```
var sensor = require("air-sensor");

var sensorId = 9322;
sensor.lookup24hAvg( sensorId ).then( 
   data => console.log( data ) 
);
```

In addition its also possible to fetch all current sensor data of an area. This will return an array of objects having the same structure as above.

```
var sensor = require("air-sensor");

var longitude = 49.1355; 
var latitude = 9.228;
var distance = 0.5;

sensor.lookupArea(longitude,latitude,distance).
   data => console.log( data ) 
);
```
