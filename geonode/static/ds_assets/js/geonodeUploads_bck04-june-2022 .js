//Layer and document upload functions in GeoNode
//10 May 2022

function download_shapefile(){
   //$("#citation").load();
   var options = {
    folder: 'MaskedData',
    types: {  point: 'MaskedPoints',  }
  }
  console.log("Download Masked");
  shpwrite.download(masked.reprojected, options);
}

async function generateShapeFile_FromMaskedGeoJSON(){
  const geoJson2 = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [47, -11]
      },
      properties: {
        song: 'If you have ghosts'
      }
    }]
  };
  var options = {
    folder: 'myshapes',
    types: {
        point: 'mypoints',
        polygon: 'mypolygons',
        line: 'mylines'
    }
  }
  var outer_variable;
  var shpBuffer = shpwrite.zip(geoJson2, options); //.then(function(content) {  //passing `geoJson2' works as well //sampleGeojson //JSON.stringify(sampleGeojson)
/*
    console.log('content: ' + content) 
  console.log('string: ' + string)
  var base64String = Uint8Array.from(window.atob(content), (v) => v.charCodeAt(0));
  var shapeFileBlob = new Blob([ base64String ], {type:"application/zip"});
  global_variable =  shapeFileBlob;
  console.log('shapeFileBlob ' + JSON.stringify(shapeFileBlob))

    //from docs at https://github.com/eligrey/FileSaver.js/
    //var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    //FileSaver.saveAs(blob, "hello world.txt");

    //works
    //saveAs(shapeFileBlob , "test.zip");    
  }); 
 */ 
  console.log('shapeFile ' + shpBuffer)
  return shpBuffer;
}

//this works great
async function GenerateZipOfAll(){  
  var shpBuffer = await generateShapeFile_FromMaskedGeoJSON(); 
  var base64String_outer = Uint8Array.from(window.atob(shpBuffer), (v) => v.charCodeAt(0));
  var shapeFileBlob_outer = new Blob([ base64String_outer ], {type:"application/zip"});
  
  var zip = new JSZip();
  zip.file("hello.txt", "Hello[p my)6cxsw2q");
  zip.file("test55.zip",shapeFileBlob_outer);
  //generate zip
  zip.generateAsync({
      type: "blob"
    })
    .then(function(content) {
      // see FileSaver.js
      saveAs(content, "example34.zip");
    });
}

function testagain(){
  const geoJson2 = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [47, -11]
      },
      properties: {
        song: 'If you have ghosts'
      }
    }]
  };

  //new try - this works
  var blob6 = new Blob([ JSON.stringify(geoJson2) ],{type:"text/plain;charset=utf-8"});
  saveAs(blob6,"sampleGeojson.json");
  //saveAs(shpFile, "geo.json"); 
  

  const base64_string = shpwrite.zip(geoJson2);  //shpBuffer
  /*const shpFile = new File([new Blob([shpBuffer])], 'geo.zip', {
      type: 'application/zip',
      lastModified: new Date()
  }); */
  console.log('base64_string ' + JSON.stringify(base64_string));

  //The result of zip(geojson) isn't ArrayBuffer but Base64 by deafult. https://github.com/mapbox/shp-write/issues/86
  //convert from base64 to arraybuffer
  var shpBuffer = Uint8Array.from(atob(base64_string), c => c.charCodeAt(0));
  //var base64String = Uint8Array.from(window.atob(content), (v) => v.charCodeAt(0));
    //var blob = new Blob([ arrayBuffer ], {type:"application/zip"});
  console.log('shpBuffer ' + shpBuffer);

  const shpFile = new File([new Blob([shpBuffer])], 'geo.zip', {
      type: 'application/zip',
      lastModified: new Date()
  });
  console.log('shpFile ' + shpFile);
  //var shapeFileBlob = new Blob([ base64String ], {type:"application/zip"}); 
  
  

  //start creating zip file
  var zip = new JSZip();
  zip.file("hello.txt", "Hello[p my)6cxsw2q");
  var photoZip = zip.folder("photos");
  photoZip.file("README", "a folder with photos");
  //get the online file
  var promise = $.get("https://www.w3.org/TR/PNG/iso_8859-1.txt");  
  /*var promise = new Promise(function (resolve, reject) {
    request('https://www.w3.org/TR/PNG/iso_8859-1.txt', function (error, response, body) {
        if (error) {
            reject(error);
        } else {
          resolve(body);
        }
    });
  }); */
  zip.file("file.txt", promise); 
  //console.log('JSON.stringify(shpFile)' + JSON.stringify(shpFile))
  zip.file("test.geojson",JSON.stringify(shpFile))
  //generate zip
  zip.generateAsync({
      type: "blob"
    })
    .then(function(content) {
      // see FileSaver.js
      saveAs(content, "example34.zip");
    });
}

//03-June-2022. This is a function I wrote to see if we can upload the shapefile. 
//Currently, we can create a shapefile - zipped in memory and download it. We can then upload this in geonode
function upload_layer_testShapeFileUpload(){ //masked_reprojected
 /* 
  var sampleGeojson = { "type": "FeatureCollection",
  "features": [
    { "type": "Feature",
      "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
      "properties": {"prop0": "value0"}
      },
    { "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
          ]
        },
      "properties": {
        "prop0": "value0",
        "prop1": 0.0
        }
      },
    { "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
            [100.0, 1.0], [100.0, 0.0] ]
          ]

      },
      "properties": {
        "prop0": "value0",
        "prop1": {"this": "that"}
        }
      }
    ]
  }
  //This works    
  var blob = new Blob([ JSON.stringify(sampleGeojson) ],{type:"text/plain;charset=utf-8"});
    saveAs(blob,"sampleGeojson.json");
  
*/

/*  //https://github.com/terrestris/ol-util/blob/0cf3282e0ddcadf4b143e4d4ae527e6262b5e69f/src/FileUtil/FileUtil.spec.js
  const geoJson2 = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [47, -11]
      },
      properties: {
        song: 'If you have ghosts'
      }
    }]
  };


  var options = {
    folder: 'myshapes',
    types: {
        point: 'mypoints',
        polygon: 'mypolygons',
        line: 'mylines'
    }
  }

  console.log('geoJson2: ' + geoJson2)  //returns ->  geoJson2: [object Object]
  const geoJsonFile = new File([JSON.stringify(geoJson2)], 'geo.json', {
    type: 'application/json',
    lastModified: new Date()
  });
  //this works, and saves a geojson file
  //saveAs(geoJsonFile, "geo.json"); 

  const shpBuffer = shpwrite.zip( geoJson2 );   
  console.log('shpBuffer: ' + shpBuffer)      //returns ->  shpBuffer: [object Promise]
  console.log('shpBuffer: ' + JSON.stringify(shpBuffer))   //returns ->  shpBuffer: {} 
  const shpFile = new File([new Blob([shpBuffer])], 'geo.zip', {
    type: 'application/zip',
    lastModified: new Date()
  });
  //This does not work
  //saveAs(shpFile, "test.zip"); 

  
  var shpfile = shpwrite.zip(geoJson2,options); //sampleGeojson
*/
  var options = {
    folder: 'myshapes',
    types: {
        point: 'mypoints',
        polygon: 'mypolygons',
        line: 'mylines'
    }
  }
  //31-May-2022 Contrary to documentation, this function actually returns the result in base64, rather than in an arraybuffer 
  //https://github.com/mapbox/shp-write/issues/86
  //this is how we convert from base64 to unit8array: https://gist.github.com/borismus/1032746
  // Uint8Array.from(window.atob(base64), (v) => v.charCodeAt(0));
  //01-Jun-2022 .. we should be able to use this generated shapefile instead of the geojson
  //For both the 'shpwrite.write' and 'shpwrite.zip' functions, the projection information is added via an added line in the shapefile.write file - line 17786
  //var shapeFileBlob;
  var shpBuffer = shpwrite.zip(masked.reprojected, options).then(function(content) {  //passing `geoJson2' works as well //sampleGeojson //JSON.stringify(sampleGeojson)
    //saveAs(content, 'test.zip');
    console.log('content: ' + content)
 //   var blob2 = new Blob([content],{type: 'application/zip'} );
 //   var fileObject = new File([blob2], "filename.zip")
 //   saveAs(fileObject, "test.zip"); 
    //var string = new TextDecoder().decode(content);  //error
    console.log('string: ' + string)
//    var arrayBuffer = new Uint8Array(content); 
    var base64String = Uint8Array.from(window.atob(content), (v) => v.charCodeAt(0));
    //var blob = new Blob([ arrayBuffer ], {type:"application/zip"});
    var shapeFileBlob = new Blob([ base64String ], {type:"application/zip"}); 
    saveAs(shapeFileBlob , "test.zip");    
  }); 
  console.log('shapeFile ' + shpBuffer)
  /* var base64String2 = Uint8Array.from(window.atob(shpBuffer), (v) => v.charCodeAt(0));
    //var blob = new Blob([ arrayBuffer ], {type:"application/zip"});
  var shapeFileBlob2 = new Blob([ base64String2 ], {type:"application/zip"}); 
  saveAs(shapeFileBlob2 , "test.zip");  
  */  
  /*
  var arrayBuffer = new Uint8Array(shpBuffer);
  var blob7 = new Blob([ arrayBuffer ], {type:"application/zip"});
  saveAs(blob7 , "test.zip");  
  */
  /*
  const shpFile = new File([new Blob([shpBuffer])], 'geo.zip', {
    type: 'application/zip',
    lastModified: new Date()
  });
  saveAs(shpFile , "test.zip");  
  */
}

//we upload the masked layer as a geonode layer
function upload_layer(masked_reprojected){ //maskedGeoJSON_string) {   //filename = "sample.geojson",
  showFileUploadSuccessMessage('Masked and encrypted datasets are being uploaded!','info'); // as a Layer and Masked Encrypted Layer being uploaded as document');
  console.log("Uploading geonode layer");  
  var headers = new Headers();
  headers.set('X-CSRFToken', csrftoken);

  var formData = new FormData()
  formData.set("time", false)

  //here we just overrite this global variable 'formatted_masked_reprojected' //geoJson2
  const geoJson2 = { 
    type: 'FeatureCollection',
 //   "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [47, -11]
      },
      properties: {
        song: 'If you have ghosts'
      }
    }]
  };

  //uncomment if we want to use the masked layer - this just overwrites that variable
//  formatted_masked_reprojected = [JSON.stringify(geoJson2)];

  if(formatted_masked_reprojected === null)
      console.error('formatted_masked_reprojected is null');

  //01-June-2022...we add the crs information, based on answers from 
  //https://gis.stackexchange.com/questions/80785/how-could-i-generate-a-crs-field-inside-the-geojson-object-created-by-leaflet-la
  
  formatted_masked_reprojected.crs =  {
    "type": "name",
    "properties": {
      "name": "epsg:26717"  //this needs to be '4326' for any geojson
      }
    }   
  console.log('crs added:  formatted_masked_reprojected' + formatted_masked_reprojected);

  var fileStringArray = [ formatted_masked_reprojected ]; //formatted_masked_reprojected; //masked_reprojected; //jsonString_new3; //maskedGeoJSON_string; //[JSON.stringify(geoJSON)];
  var blobAttrs = {
    type: "application/octet-stream"
  };
  console.log('fileStringArray: ' + fileStringArray);

 /* 
 // 22-May-2022..Added code - here we want to upload a shapefile based on the 'masked.reprojected' geojson
 const geoJson2 = {
    type: 'FeatureCollection',
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [47, -11]
      },
      properties: {
        song: 'If you have ghosts'
      }
    }]
  };

  var options = {
    folder: 'myshapes',
    types: {
        point: 'mypoints',
        polygon: 'mypolygons',
        line: 'mylines'
    }
  }
  //refer to the coded function 'upload_layer' for how to code this block
  var shpBuffer = shpwrite.zip(fileStringArray, options); //.then(function(content) {
                    //}); 
  var file = new File([new Blob([shpBuffer])], 'geo.zip', {
    type: 'application/zip',
    lastModified: new Date()
  });   
  //end added code 
  */
             

      //filename = "sample.geojson",
      //console.log('fileName: ' + fileName);
      fileName = fileName + '.geojson';
      console.log('Layer fileName: ' + fileName);
            
      //main line to change, if we are adding a geojson or shapefile
      var file = new File(fileStringArray, fileName, blobAttrs);
      
      //var file = new File(maskedGeoJSON_string, fileName, blobAttrs);
      formData.set("base_file", file)
      formData.set("geojson_file", file)
      //this line of code needed to be changed to ensure that the uploaded layer is only visible to logged-in users
      //formData.set("permissions", '{"users":{"AnonymousUser":["view_resourcebase","download_resourcebase"]},"groups":{}}')
      formData.set("permissions", '{"users":{},"groups":{}}')
      formData.set("charset", "UTF-8")

      //when we want to get the users and groups specified in the bob
      //var chkBox = document.getElementById('view_anonymous');  //'checkAddress' is the name of checkbox, not id
      //if (chkBox.checked)
      //    formData.set("view_anonymous", true)     
      //else
        //    formData.set("view_anonymous", false)           
    

      fetch("/upload/", {
        "credentials": "include",
        "body": formData,
        "headers": headers,
        "method": "POST",
        "mode": "cors"
      }).then(result => result.json()).then(function(data) {
        console.log(data)
        fetch(data.redirect_to).then(result => result.json()).then(function(data) {
          console.log(data)  
          //Sample html link =  <a href="https://www.w3schools.com/">Visit W3Schools.com!</a>                                            //  ' + data.url + '
          showFileUploadSuccessMessage('Uploaded masked dataset as a Geonode <a href=https://datasovereignty.cloud.edu.au' + data.url + ' target="_blank" class="alert-link">layer</a>','success'); //show message to user 
          //showFileUploadSuccessMessage('New document uploaded, its URL is <a href=' + result.url + ' target="_blank" class="alert-link"> ' + result.url + ' </a>'); //show message to user   
          var name = data.url.split(":").pop()  // Get layer ID
          check_layer(name)
        })
      })

}
  
  function check_layer(name) {
    // Check if layer exists with this name
    fetch("/api/v2/layers/?filter{name}=" + name).then(result => result.json()).then(function(result) {
      console.log(result)
      if (result.layers.length) {
        var layer = result.layers[0]
        var layer_id = `type:${layer.polymorphic_ctype_id}-id:${layer.pk}`
        
        console.log("Now Trying to upload Document")   
        //showFileUploadSuccessMessage('Masked encrypted layer Uploaded'); //show message to user

        upload_document(layer_id, csrftoken)
      } else {
        // It doesn't exist yet, wait 1 second, then check again
        setTimeout(function() {
          check_layer(name)
        }, 1000)
      }
    })
  }
  
  //upload the 'global_finalEncryptedZipFile' blob (the final encrypted zip file resulting from the three volume encryption) as a Geonode document
  //we can't upload it as a layer because Geoserver only accepts files with spatial content - and the encrypted file canot be read of ts contents.
  function upload_document(layer_id) {
    
    var formData = new FormData()
    formData.set("csrfmiddlewaretoken", csrftoken)
    
    if (csrftoken === undefined)
       console.error('csrftoken undefined');
    
    if (global_finalEncryptedZipFile === null)
       console.error('encrypted file is null ');
  
    if (finalFilename === null)
       console.error('encrypted filename is null ');
    else
       console.log('finalFilename ' + finalFilename);
    
    formData.set("title", finalFilename); //using global variable //filename) 
    formData.set("links", layer_id)
    console.log(`Linking to ${layer_id}`)
  
    var file = new File([global_finalEncryptedZipFile], finalFilename); //blob to file
    formData.set("doc_file", file) //upload the 'global_finalEncryptedZipFile' (the final encrypted zip file resulting from the three volume encryption)
    formData.set("doc_url", "")
    //formData.set("permissions", '{"users":{"AnonymousUser":["view_resourcebase","download_resourcebase"]},"groups":{}}')
    formData.set("permissions", '{"users":{},"groups":{}}')
  
    var result = fetch("/documents/upload/", {
      "credentials": "include",
      "body": formData,
      "method": "POST",
      "mode": "cors"
    }).then(function(result) {
      console.log('New document uploaded, ' + result.url) //<a href="#" class="alert-link">an example link</a>.
      showFileUploadSuccessMessage('Uploaded encrypted layer as a Geonode <a href=' + result.url + ' target="_blank" class="alert-link"> document </a>', 'success'); //' + result.url + ' //show message to user
    })
    
    if (result.status == 200) {
          console.log('New document uploaded, ' + result.url)
          showFileUploadSuccessMessage('Error Uploading encrypted layer as a Geonode <a href=' + result.url + ' target="_blank" class="alert-link"> document </a>', 'error'); //' + result.url + '//show message to user
      } else {
        //XXX console.error('error uploading: ' + result)
      }
    
  }

  /*
  <div class="alert alert-warning alert-dismissible fade in" role="alert"> 
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
    </button> 
    <strong>Holy guacamole!</strong> Best check yo self, you're not looking too good. 
  </div> */

  function showFileUploadSuccessMessage(msg, type){
    const alertPlaceholder = document.getElementById('fileUploads')

    const alert = (message, type) => {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade in" role="alert">`,
        `   <div>${message}</div>`,
        //'   <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>',
        '</div>'
      ].join('')

      alertPlaceholder.append(wrapper)
    }

    /*const alertTrigger = document.getElementById('liveAlertBtn')
    if (alertTrigger) {
      alertTrigger.addEventListener('click', () => {
        alert('Nice, you triggered this alert message!', 'success')
      })
    } */
    alert(msg, type) // 'success') //'Nice, you triggered this alert message!'
  }
  