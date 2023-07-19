//import * as h3 from "h3-js";
//import geojson2h3 from 'geojson2h3';
//import * as h3 from "h3-js";

//const geojson2h3 = require('geojson2h3')

  //geojson to h3 and then back to geojson
  function h3binning (sensitive)
  {
    console.log('hexagons ')                                              
    const hexagons = geojson2h3.featureToH3Set(sensitive.data, 10); //the last parameter is the binning level.
    console.log('hexagons ' + hexagons)
    const featuresCollection = geojson2h3.h3SetToFeatureCollection(hexagons);
    console.log('hexagons ' + featuresCollection)
/*
    //GeoJSON data is simply JSON, so you just need to convert String to JSON:
    //const parsedGeoJson = JSON.parse(geoJsonString);
    //The feature collection is GeoJSON  ...https://gis.stackexchange.com/questions/163225/converting-esri-leaflet-featurecollection-to-json
    var myGeoJSON = JSON.stringify(featuresCollection)
    console.log(myGeoJSON)
*/
    return sensitive;
}

/* //polygon ...pass instead of the sensitive.data
    const polygon = {
      type: 'Feature',
      geometry: {
          type: 'Polygon',
          coordinates: [[
          [-122.47485823276713, 37.85878356045377],
          [-122.47504834087829, 37.86196795698972],
          [-122.47845104316997, 37.86010614563313],
          [-122.47485823276713, 37.85878356045377]
          ]]
      }
      }; */


/*
function testing27(sensitive){
    
    const geojson2h3 = require('geojson2h3')

    //const hexagons = geojson2h3.featureToH3Set(sensitive.data, 10); //level is one of the options
    // -> ['8a2830855047fff', '8a2830855077fff', '8a283085505ffff', '8a283085506ffff']
    console.log('hexagons 12');// + hexagons)

    //var h3 = require('h3-js');
    //const geojson2csv = require('geojson2csv');
    //function testing27(sensitive){
    const hexagons = geojson2h3.featureToH3Set(sensitive.data, 10); //level is one of the options
      // -> ['8a2830855047fff', '8a2830855077fff', '8a283085505ffff', '8a283085506ffff']
      console.log('hexagons');// + hexagons)
  
    const feature = geojson2h3.h3SetToFeature(hexagons);
    // -> {type: 'Feature', properties: {}, geometry: {type: 'Polygon', coordinates: [...]}}
  
    const polygon = {
    type: 'Feature',
    geometry: {
        type: 'Polygon',
        coordinates: [[
        [-122.47485823276713, 37.85878356045377],
        [-122.47504834087829, 37.86196795698972],
        [-122.47845104316997, 37.86010614563313],
        [-122.47485823276713, 37.85878356045377]
        ]]
    }
    };

//const hexagons = geojson2h3.featureToH3Set(polygon, 10);
// -> ['8a2830855047fff', '8a2830855077fff', '8a283085505ffff', '8a283085506ffff']

//const feature = geojson2h3.h3SetToFeature(hexagons);
// -> {type: 'Feature', properties: {}, geometry: {type: 'Polygon', coordinates: [...]}}

} */