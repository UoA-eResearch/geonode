/*
    Warning: I'm really bad at coding. Side effects of viewing this document may include depression, insomina, eye strain, and sudden outbursts of laughter. Continue viewing source at your own risk.
        
    Copyright (c) 2019 David Swanlund
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* Four arguments: the div ID from the input, the div ID of the output (where geoJSON will be injected into), the name for the output variable, and the name of the variable that will store the projection of the original data */

// Create empty projection variable to fill later
var projection = [];

//29 July 2021 ..hve these as global variables
// Create local random distance and angle variables
var randDist, randDistMed, randDistCoarse;
var randAngle,randAngleMed, randAngleCoarse;;

var sensitive_Data_try; //store the transformed data in this variable
var formatted_masked_reprojected; ///to later store the formatted masked map 'masked.reprojected'


//Reads a zipped shapefile and injects it into the html as a geojson variable based on input layerName
loadShapeFile = function(sourceID, outputID, layerName) {
    var fileInput = document.getElementById(sourceID);
    var reader = new FileReader();
    reader.onload = function (event) {
            var blob = event.target.result;
            var projFileName;
            JSZip.loadAsync(blob).then(function(result){ 
                myKeys = Object.keys(result.files);
                myKeys.forEach(function(i){if (i.endsWith('prj') == true ) {projFileName = i;}})
            });
            JSZip.loadAsync(blob).then(function(result){ 
                projectionPromise = result.files[projFileName].async('text');
                projectionPromise.then(function(proj){projection[layerName] = proj; console.log('proj: '+proj + 'proj.definition' + proj.oProj.PROJECTION);}) //Add the projection text to the projection array and name it based on the input layer name
            });
        shp(event.target.result).then(function (geojson) {
            $("#" + outputID).html(layerName + ".data = " + JSON.stringify(geojson) + ";");
            console.log(layerName + " Loaded");
            //11-Oct-2021..we just assign the medium and coarse layer to the same values
            //these would be changed with a cerain offset in the masking function
            /* not needed here
            $("#" + outputID).html(layerName + "Med.data = " + JSON.stringify(geojson) + ";");
            console.log(layerName + "Med Loaded");
            $("#" + outputID).html(layerName + "Coarse.data = " + JSON.stringify(geojson) + ";");
            console.log(layerName + "Coarse Loaded");
            */
        });
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
};

//Adds a geojson layer to the map, using the selected OpenLayers style
toMap = function(sourceGeoJSON, styleChoice) {
		//console.log("here 1");
        map.removeLayer(sourceGeoJSON.layer);
        var source = new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(sourceGeoJSON, { featureProjection: 'EPSG:3857' })
        });
		//console.log("here 2");
        sourceGeoJSON.layer = new ol.layer.Vector({
            zIndex: 9,
            renderMode: 'image',
            source: source,
            style: styleChoice
        });
		//console.log("here 3");
        map.addLayer(sourceGeoJSON.layer);
        var extent = sensitive.data.layer.getSource().getExtent();
        map.getView().fit(extent, { size: map.getSize(), maxZoom: 13 });
		//console.log("here 4");
}

//Create sensitive data layer and add styling
var sensitive = {
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color: '#FF8078'
            }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: .5
            })
        })
    }),
};

//11-10-2021 ..medium level sensitive
//Create sensitive data layer and add styling
var sensitiveMed = {
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color: '#FF8078'
            }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: .5
            })
        })
    }),
};

var sensitiveCoarse = {
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color: '#FF8078'
            }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: .5
            })
        })
    }),
};

//Create boundary data layer and add styling, including variable for whether the boundary is loaded or not, and a function to give each row an ID 
var boundary = {
    isLoaded: false,
    assignID: function () {
        for (var i = 0; i < boundary.data.features.length; i++) {
            boundary.data.features[i].properties.newID = i;
        }
    },
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#00acce'
        })
    })
};

//Create masked data layer and add styling, as well as some empty array variables such that they are cleared every time the masking procedure is started
var masked = {
    rawdata: [],
    rawReprojected: [],
    reprojected: [],
    data: [],
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color: '#5FAFFF'
            }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: .5
            })
        })
    }),
};

// 11-10-2021. Medium level masked 
// Create masked data layer and add styling, as well as some empty array variables such that they are cleared every time the masking procedure is started
var maskedMed = {
    rawdata: [],
    rawReprojected: [],
    reprojected: [],
    data: [],
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color: '#5FAFFF'
            }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: .5
            })
        })
    }),
};

/* 14-10-2021. No longer need masking for fine level, as we only need two levsl. So this further level is not needed.
var maskedCoarse = {
    rawdata: [],
    rawReprojected: [],
    reprojected: [],
    data: [],
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color: '#5FAFFF'
            }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: .5
            })
        })
    }),
};
*/

//Create a layer for the points that are identified as being part of clusters from the sensitive layer, add styling, and variables to again be cleared when masking is started
var sensitiveClusters = {
    data: [],
    cluster: [],
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color: '#FF241F'
            }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: 1.5
            })
        })
    }),
};

var sensitiveMedClusters = {
    data: [],
    cluster: [],
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color: '#FF241F'
            }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: 1.5
            })
        })
    }),
};

//Create a layer for the points that are identified as being part of clusters from the masked, add styling, and variables to again be cleared when masking is started
var maskedClusters = {
    data: [],
    cluster: [],
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color: '#0593FF'
            }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: 1.5
            })
        })
    }),
};

//Create empty variable to hold stuff related to spruill's measure calculation
var spruill = [];

//Main masking procedure
var xyz = {
    //Define random number generator function
    getRandom: function (min, max) {
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        let randomNumber = randomBuffer[0] / (0xffffffff + 1);
        randomResult = (randomNumber * (max - min)) + min;
        return randomResult;
    },
    getRandomCurved: function(min, max) {
        while (true) {
            randomAttempt = this.getRandom(min, max);
            probability = randomAttempt;
            randomQualifier = this.getRandom(min, max);
            if (randomQualifier < probability) {
                return randomAttempt;
            }
        }
    },
    //Displace function is the main donut masking procedure
    displace: function () {
        //console.log('here 2 sensitive.data: ' + sensitive.data);
        //console.log('here 2 sensitiveMed.data: ' + sensitiveMed.data);

        var startTime = new Date();
        //If masking has already been performed, clear any generated variables
        if (masked.data.layer !== null) {
            map.removeLayer(masked.data.layer);
            map.removeLayer(maskedClusters.cluster.layer);
            map.removeLayer(sensitiveClusters.cluster.layer);
            masked.data = [];
            masked.rawdata = [];
            masked.rawReprojected = [];
            masked.reprojected = [];
            maskedClusters.data = [];
            sensitiveClusters.data = [];
            maskedClusters.cluster = [];
            sensitiveClusters.cluster = [];
            maskedClusters.cluster = [];
            sensitiveClusters.cluster = [];
            spruill.length = [];
            sensitive.length = [];
        }
        //Test if boundary is loaded or not, and if it is then give each row an ID
        if (typeof boundary.data !== 'undefined') {
            boundary.isLoaded = true;
            boundary.assignID();
        }
        //Get the user-defined distance values and convert them to meters
        this.minDist = document.getElementById("minDistInput").value;
        this.maxDist = document.getElementById("maxDistInput").value;
        this.minDist = this.minDist / 1000;
        this.maxDist = this.maxDist / 1000;
        
        //11-Oct-2021. Medium and coarse level masking
        //change the variable that is to be processed
        //if(level==1){
            //this.minDistMed = this.minDist;            this.maxDistMed = this.maxDist;
            //v = sensitive.data;
        //}
        //else if(level==2){
            this.minDistMed = this.minDist + 50;       this.maxDistMed = this.maxDist + 50;
            //v = sensitiveMed.data; //change the variable that is to be processed
        //}
        //else if(level==3){
            this.minDistCoarse = this.minDist + 100;   this.maxDistCoarse = this.maxDist + 100;
           // v = sensitiveCoarse.data;
        //}

        console.log('sensitive.data: ' + sensitive.data);

        //Masking time!
        turf.featureEach(sensitive.data, function (currentFeature, featureIndex) {
            // 29 July -- have these as global
            // //Create local random distance and angle variables
            // var randDist;
            // var randAngle;
            do {
                var isWithinBoundary = false; //Set the boundary checker to false
                randDist = xyz.getRandomCurved((xyz.minDist), (xyz.maxDist)); //generate a random distance based on user inputs
                //console.log(randDist*1000)
                randAngle = xyz.getRandom(0.000000, 360.000000); //generate a random angle
                //transform each feature
                var currentFeatureMasked = turf.transformTranslate(currentFeature, randDist, randAngle); //move the current point according to the random distance and angle that were generated
                var currentFeatureReprojected = jQuery.extend(true, {}, currentFeatureMasked); //add the now masked feature to the reprojected object (where it will get reprojected). Must do this first to add the whole object, rather than just the reprojected coordinates
                //03June2022. Following line commented so that the GoeJSON stays in WJS-84 projection - needed for map displaying in Geonode    
                //currentFeatureReprojected.geometry.coordinates = proj4(projection['sensitive'], currentFeatureMasked.geometry.coordinates); //reproject the coordinates based on the projection of the original sensitive input data

                // Boundary Checking
                if (boundary.isLoaded == true) {
                    var p1 = turf.tag(currentFeature, boundary.data, "newID", "bID"); //spatial join the sensitive point to the boundary its in
                    var p2 = turf.tag(currentFeatureMasked, boundary.data, "newID", "bID"); //spatial join the masked point to the boundary its in
                    turf.tag(currentFeatureReprojected, boundary.data, "newID", "bID"); //not entirely sure this line is even necessary or does anything
                    //Test whether the boundary ID that was assigned to the sensitive and masked location are the same, and if so then set the boundary checker variable to true, add the masked feature and its reprojected version to their respective arrays, otherwise, keep the boundary checker variable false
                    if (p1.properties.bID == p2.properties.bID) { 
                        isWithinBoundary = true;
                        masked.rawdata.push(currentFeatureMasked);
                        masked.rawReprojected.push(currentFeatureReprojected);
                    }
                    else {
                        isWithinBoundary = false;
                    };
                }
                else { //if no boundary layer is loaded, then just push the masked data into the appropriate arrays
                    masked.rawdata.push(currentFeatureMasked);
                    masked.rawReprojected.push(currentFeatureReprojected);
                };
                
                // Spruill's Measure Calculation
                nearestPoint = turf.nearestPoint(currentFeatureMasked, sensitive.data)
                actualDist = turf.nearestPoint(currentFeatureMasked, currentFeature)
                if (nearestPoint.properties.distanceToPoint == actualDist.properties.distanceToPoint) {
                    spruill.push("yes");
                }

            } while (boundary.isLoaded == true && isWithinBoundary == false); //this keeps the procedure looping until the boundary variable is true. If no boundary is loaded, then it'll just run it once and be done.
        });
        masked.data = turf.featureCollection(masked.rawdata); //turn the masked data array of features into a Feature Collection
        masked.reprojected = turf.featureCollection(masked.rawReprojected); //do the same as above for the reprojected version
        console.log('masked.reprojected: ' + masked.reprojected);

        //April 2022 ... just to see if we can format this data as soon as it is created
        formatted_masked_reprojected = JSON.stringify(masked.reprojected, null, 4); // Indented 4 spaces
        //console.log('formatted_masked_reprojected: ' + formatted_masked_reprojected);
        /*
        var fileData_new1 = JSON.stringify(masked.reprojected, null, "\t"); // Indented with tab
        console.log('fileData_new1: ' + fileData_new1);
        var fileData_new2 = JSON.stringify(masked.reprojected, undefined, 4); // first use JSON.stringify 
        console.log('fileData_new2: ' + fileData_new2);
        var jsonString_new3 = JSON.stringify(masked.reprojected, circularReplacer());
        console.log('jsonString_new3: ' + jsonString_new3); 
        */

        sensitiveMed.data = sensitive.data; //to start with the coarse data is assigned to be the same 
        console.log('sensitiveMed.data: ' + sensitiveMed.data);
        console.log('xyz.minDistMed: ' + xyz.minDistMed);

        //11-Oct-2021...Masking time for medium data!
        turf.featureEach(sensitiveMed.data, 
            function (currentFeature, featureIndex) {
            // 29 July -- have these as global
            // //Create local random distance and angle variables
            // var randDist;
            // var randAngle;
            do {
                var isWithinBoundary = false; //Set the boundary checker to false
                randDistMed = xyz.getRandomCurved((xyz.minDistMed), (xyz.maxDistMed)); //generate a random distance based on user inputs
                //console.log(randDist*1000)
                randAngleMed = xyz.getRandom(0.000000, 360.000000); //generate a random angle
                //transform each feature
                var currentFeatureMasked = turf.transformTranslate(currentFeature, randDistMed, randAngleMed); //move the current point according to the random distance and angle that were generated
                var currentFeatureReprojected = jQuery.extend(true, {}, currentFeatureMasked); //add the now masked feature to the reprojected object (where it will get reprojected). Must do this first to add the whole object, rather than just the reprojected coordinates
                //03June2022. Following line commented so that the GoeJSON stays in WJS-84 projection - needed for map displaying in Geonode
                //currentFeatureReprojected.geometry.coordinates = proj4(projection['sensitive'], currentFeatureMasked.geometry.coordinates); //reproject the coordinates based on the projection of the original sensitive input data

                // Boundary Checking
                if (boundary.isLoaded == true) {
                    var p1 = turf.tag(currentFeature, boundary.data, "newID", "bID"); //spatial join the sensitive point to the boundary its in
                    var p2 = turf.tag(currentFeatureMasked, boundary.data, "newID", "bID"); //spatial join the masked point to the boundary its in
                    turf.tag(currentFeatureReprojected, boundary.data, "newID", "bID"); //not entirely sure this line is even necessary or does anything
                    //Test whether the boundary ID that was assigned to the sensitive and masked location are the same, and if so then set the boundary checker variable to true, add the masked feature and its reprojected version to their respective arrays, otherwise, keep the boundary checker variable false
                    if (p1.properties.bID == p2.properties.bID) { 
                        isWithinBoundary = true;
                        maskedMed.rawdata.push(currentFeatureMasked);
                        maskedMed.rawReprojected.push(currentFeatureReprojected);
                    }
                    else {
                        isWithinBoundary = false;
                    };
                }
                else { //if no boundary layer is loaded, then just push the masked data into the appropriate arrays
                    maskedMed.rawdata.push(currentFeatureMasked);
                    maskedMed.rawReprojected.push(currentFeatureReprojected);
                };
                
                // Spruill's Measure Calculation
                nearestPoint = turf.nearestPoint(currentFeatureMasked, sensitiveMed.data)
                actualDist = turf.nearestPoint(currentFeatureMasked, currentFeature)
                if (nearestPoint.properties.distanceToPoint == actualDist.properties.distanceToPoint) {
                    spruill.push("yes");
                }

            } while (boundary.isLoaded == true && isWithinBoundary == false); //this keeps the procedure looping until the boundary variable is true. If no boundary is loaded, then it'll just run it once and be done.
        });
        maskedMed.data = turf.featureCollection(maskedMed.rawdata); //turn the masked data array of features into a Feature Collection
        maskedMed.reprojected = turf.featureCollection(maskedMed.rawReprojected); //do the same as above for the reprojected version

        sensitiveCoarse.data = sensitive.data;  //to start with the coarse data is assigned to be the same 
        console.log('sensitiveCoarse.data: ' + sensitiveCoarse.data);
        console.log('xyz.minDistCoarse: ' + xyz.minDistCoarse);

        //14-10-2021. No longer need masking for fine level, as we only need two levsl. So this further level is not needed.
        //11-Oct-2021.. Masking time for coarse data!        
        /*
        turf.featureEach(sensitiveCoarse.data, function (currentFeature, featureIndex) {
            // 29 July -- have these as global
            // //Create local random distance and angle variables
            // var randDist;
            // var randAngle;
            do {
                var isWithinBoundary = false; //Set the boundary checker to false
                randDistCoarse = xyz.getRandomCurved((xyz.minDistCoarse), (xyz.maxDistCoarse)); //generate a random distance based on user inputs
                //console.log(randDist*1000)
                randAngleCoarse = xyz.getRandom(0.000000, 360.000000); //generate a random angle
                //transform each feature
                var currentFeatureMasked = turf.transformTranslate(currentFeature, randDistCoarse, randAngleCoarse); //move the current point according to the random distance and angle that were generated
                var currentFeatureReprojected = jQuery.extend(true, {}, currentFeatureMasked); //add the now masked feature to the reprojected object (where it will get reprojected). Must do this first to add the whole object, rather than just the reprojected coordinates
                currentFeatureReprojected.geometry.coordinates = proj4(projection['sensitive'], currentFeatureMasked.geometry.coordinates); //reproject the coordinates based on the projection of the original sensitive input data

                // Boundary Checking
                if (boundary.isLoaded == true) {
                    var p1 = turf.tag(currentFeature, boundary.data, "newID", "bID"); //spatial join the sensitive point to the boundary its in
                    var p2 = turf.tag(currentFeatureMasked, boundary.data, "newID", "bID"); //spatial join the masked point to the boundary its in
                    turf.tag(currentFeatureReprojected, boundary.data, "newID", "bID"); //not entirely sure this line is even necessary or does anything
                    //Test whether the boundary ID that was assigned to the sensitive and masked location are the same, and if so then set the boundary checker variable to true, add the masked feature and its reprojected version to their respective arrays, otherwise, keep the boundary checker variable false
                    if (p1.properties.bID == p2.properties.bID) { 
                        isWithinBoundary = true;
                        //14-10-2021. No longer need masking for fine level, as we only need two levsl. So this further level is not needed.
                        maskedCoarse.rawdata.push(currentFeatureMasked);
                        maskedCoarse.rawReprojected.push(currentFeatureReprojected);
                    }
                    else {
                        isWithinBoundary = false;
                    };
                }
                else { //if no boundary layer is loaded, then just push the masked data into the appropriate arrays
                    maskedCoarse.rawdata.push(currentFeatureMasked);
                    maskedCoarse.rawReprojected.push(currentFeatureReprojected);
                };
                
                // Spruill's Measure Calculation
                nearestPoint = turf.nearestPoint(currentFeatureMasked, sensitiveCoarse.data)
                actualDist = turf.nearestPoint(currentFeatureMasked, currentFeature)
                if (nearestPoint.properties.distanceToPoint == actualDist.properties.distanceToPoint) {
                    spruill.push("yes");
                }

            } while (boundary.isLoaded == true && isWithinBoundary == false); //this keeps the procedure looping until the boundary variable is true. If no boundary is loaded, then it'll just run it once and be done.
        });
        maskedCoarsedata = turf.featureCollection(maskedCoarse.rawdata); //turn the masked data array of features into a Feature Collection
        maskedCoarse.reprojected = turf.featureCollection(maskedCoarse.rawReprojected); //do the same as above for the reprojected version
        */

        // //assign them to the right volumes
        // if(level==1){            
        //     v = sensitive.data;
        // }
        // else if(level==2){            
        //     v = sensitiveMed.data; //change the variable that is to be processed
        // }
        // else if(level==3){            
        //     v = sensitiveCoarse.data;
        // }

        //PS. 02 Aug2021.
        //sensitive_Data_try = turf.featureCollection(sensitive.data);

    /*
        // Process Center Calculations
        beforeCenter = turf.getCoord(turf.center(sensitive.data)); //find the center of the sensitive data
        afterCenter = turf.getCoord(turf.center(masked.data)); //find the center of the masked data
        centerMove = turf.distance(beforeCenter, afterCenter)*1000 //calculate the distance between the sensitive and masked centers, times 1000 to get meters
        $("#centerMove").html("Mean Center Displacement Distance: " + Math.round(centerMove * 100)/100 + " meters"); //update the html with the distance the center mvoed


        // Cluster Analysis Begins Here
        if (clustersEnabled == true){
            // Process Sensitive Clusters
            sensitiveClusters.data = turf.clustersDbscan(sensitive.data, bandwidth.value/1000); 
            sensitiveClusters.data.max = [];
            turf.featureEach(sensitiveClusters.data, function (currentFeature, featureIndex){
                if (currentFeature.properties.cluster > 0) {
                    sensitiveClusters.cluster.push(currentFeature);
                } 
                sensitiveClusters.data.max.push(currentFeature.properties.cluster);
            });
            sensitiveClusters.cluster = turf.featureCollection(sensitiveClusters.cluster);
            sensitiveClusters.data.max.filter = sensitiveClusters.data.max.filter(function (el) {
                return el != null;
                });
            sensitiveClusterCount = Math.max(...sensitiveClusters.data.max.filter);
            $("#infoDiv").show();
            $("#beforeMasking").html("Before Masking: " + sensitiveClusterCount);
            
            // Process Masked Clusters
            maskedClusters.data = turf.clustersDbscan(masked.data, bandwidth.value/1000);
            maskedClusters.data.max = [];
            turf.featureEach(maskedClusters.data, function (currentFeature, featureIndex){
                if (currentFeature.properties.cluster > 0) {
                    maskedClusters.cluster.push(currentFeature);
                } 
                maskedClusters.data.max.push(currentFeature.properties.cluster);
                });
            maskedClusters.cluster = turf.featureCollection(maskedClusters.cluster);
            maskedClusters.data.max.filter = maskedClusters.data.max.filter(function (el) {
                return el != null;
                });
            maskedClusterCount = Math.max(...maskedClusters.data.max.filter)
            $("#afterMasking").html("After Masking: " + maskedClusterCount);
            $("#addLoss").html("Clusters Lost/Added: " + (maskedClusterCount - sensitiveClusterCount));
        };


        //Do Spruill's Measure and turn on stats divs
        sensitive.length = Object.keys(sensitive.data.features).length; //find the number of points in the sensitive layer
        spruill.measure = (100 - ((spruill.length / sensitive.length)*100)); //calculate spruill's measure
        //Do HTML edits to insert spruill's measure, show the privacy rating element, show the center movement element, and edit the text in the masking button
        $("#privacyRating").html((Math.round(spruill.measure))+"/100 (higher is better)");
        $("#privacyRatingDiv").show();
        $("#centerMoveDiv").show();
*/

        $("#mask").html("Mask Again!");
        
        endTime = new Date();
        executionTime = ((endTime - startTime) / 1000);
        console.log(executionTime);
    },
};