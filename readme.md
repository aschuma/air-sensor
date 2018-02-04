# air-sensor 

Lookups a single particulate-matter sensors of the [luftdaten network](http://luftdaten.info/en/home-en). 
You may zoom in the [map](http://maps.luftdaten.info/#2/0.0/0.0) to obtain the id of a sensor next to you. 

```
var sensor = require("air-sensor");

var sensorId = 9322;
sensor.lookup( sensorId ).then( 
   data => console.log( data ) 
);
```

````
{ 
   id: 9322,
   location: { 
      longitude: 9.228, 
      latitude: 48.804, 
      altitude: 234.1 
   },
   PM10: 6.4,
   PM2_5: 5.9,
   timestamp: '2018-02-04 14:38:08' 
}
```