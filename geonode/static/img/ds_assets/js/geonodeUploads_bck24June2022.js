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

/*
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
  }; */ 

//pass the 'masked_reprojected'
async function generateShapeFileFromGeoJSON(geoJSON, v_fileName){   
    var options = {
      //folder: v_fileName,
      types: {
          point: v_fileName, polygon: v_fileName, line: v_fileName
      }
    }
    var shpBuffer = shpwrite.zip(geoJSON, options); //console.log('shapeFile ' + shpBuffer)
    return shpBuffer;
}

//05-Jun-2022. Converts and saves the returned shapefile from generateShapeFileFromGeoJSON() function, used to download the masked data
async function saveShapeFile(geoJSON){
  var shpBuffer = await generateShapeFileFromGeoJSON(geoJSON, fileName); 
  var base64String = Uint8Array.from(window.atob(shpBuffer), (v) => v.charCodeAt(0));
  var shapeFileBlob = new Blob([ base64String ], {type:"application/zip"});
  saveAs(shapeFileBlob, fileName + ".zip");   // see FileSaver.js
}
  
//this works great. Basically was used to test of we can create and download shapefile from memory
async function GenerateZipOfAll(){  
    var shpBuffer = await generateShapeFileFromGeoJSON(masked.reprojected, fileName); 
    var base64String = Uint8Array.from(window.atob(shpBuffer), (v) => v.charCodeAt(0));
    var shapeFileBlob = new Blob([ base64String ], {type:"application/zip"});

    var zip = new JSZip();
    //zip.file("hello.txt", "Hello[p my)6cxsw2q");
    zip.file(fileName + ".zip", shapeFileBlob );
    
    zip.generateAsync({  //generate zip
        type: "blob"
        }).then(function(content) {          
        saveAs(content, fileName + ".zip");   // see FileSaver.js
    });
}

/*
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
    const shpBuffer = shpwrite.zip(geoJson2);
    const shpFile = new File([new Blob([shpBuffer])], 'geo.zip', {
        type: 'application/zip',
        lastModified: new Date()
    });  
    */

//we upload the masked layer as a geonode layer
async function upload_layer(masked_reprojected){ //maskedGeoJSON_string) {   //filename = "sample.geojson",
  showFileUploadSuccessMessage('Masked and encrypted datasets are being uploaded!','info'); // as a Layer and Masked Encrypted Layer being uploaded as document');
  console.log("Uploading geonode layer");  
  
  if(formatted_masked_reprojected === null)
      console.error('formatted_masked_reprojected is null');
  
  var fileStringArray = [ formatted_masked_reprojected ]; //formatted_masked_reprojected; //masked_reprojected; //jsonString_new3; //maskedGeoJSON_string; //[JSON.stringify(geoJSON)];
  var blobAttrs = {
     type: "application/octet-stream"
  };
  console.log('fileStringArray: ' + fileStringArray);
  fileName = fileName + '.geojson'; 
  console.log('Layer fileName: ' + fileName);
  
  //main line to change, if we are adding a geojson or shapefile
  //geoJSON
  var file = new File(fileStringArray, fileName, blobAttrs);
  //shapeFile 05-June-2022  
  // probably not working as I have to set the right headers for shapefile, instead of the ones for geoJSON
  
  /*
  var shpBuffer = await generateShapeFileFromGeoJSON(masked.reprojected, fileName); 
  var base64String = Uint8Array.from(window.atob(shpBuffer), (v) => v.charCodeAt(0));
  var shapeFileBlob = new Blob([ base64String ], {type:"application/zip"});
  console.log('shapeFileBlob : ' + JSON.stringify(shapeFileBlob) );
  var file = new File([shapeFileBlob], 'all_clusters_kamloops.zip');  //fileName +
  console.log('Uploading shapefile: ' + fileName + 'all_clusters_kamloops.zip');
  */

  //var shapefile = fileInput.files[0];
  //saveAs(decryptedBlob, fileName2); 

  /*
  var shapefile = fileInput.files[0]; //$('#load-file').files[0];
  var fileReader = new FileReader();
  fileReader.onloadend = function (e) {
    var arrayBuffer = e.target.result;
    var fileType = $('#file-type').value;
    var blob = blobUtil.arrayBufferToBlob(arrayBuffer, fileType)
    console.log('here is a blob', blob);
    console.log('its size is', blob.size);
    console.log('its type is', blob.type);
    saveAs(blob, 'shapefile.zip');
  };
  fileReader.readAsArrayBuffer(shapefile); 
  */

  //const fileInputX = document.querySelector('#avatar') ;
/*  
  var fileInputX = document.getElementById('avatar');   
  var filename = fileInputX.files[0].name;
  console.log('filename: ' + filename);
*/

  var headers = new Headers();
  headers.set('X-CSRFToken', csrftoken);
  var formData = new FormData()
  formData.set("time", false)
  formData.set("base_file", file) //file 
  //$$formData.set("base_file", fileInputX.files[0])
  formData.set("geojson_file", file)
  //formData.set("geojson_file", fileInputX.files[0])
  //$$$formData.set("zip_file", fileInputX.files[0]) //file 
  //this line of code needed to be changed to ensure that the uploaded layer is only visible to logged-in users
  //formData.set("permissions", '{"users":{"AnonymousUser":["view_resourcebase","download_resourcebase"]},"groups":{}}')
  formData.set("permissions", '{"users":{},"groups":{}}')
  //$$formData.set("charset", "UTF-8")
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
  //  "Content-Type": multipart/form-data, //   "Content-Type": "application/zip;charset=UTF-8",
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

/* 
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

  //01-June-2022...we add the crs information, based on answers from 
  //https://gis.stackexchange.com/questions/80785/how-could-i-generate-a-crs-field-inside-the-geojson-object-created-by-leaflet-la

  formatted_masked_reprojected.crs =  {
    "type": "name",
    "properties": {
      "name": "epsg:26717"  //this needs to be '4326' for any geojson
      }
    }   
  console.log('crs added:  formatted_masked_reprojected' + formatted_masked_reprojected);

    //var file = new File(maskedGeoJSON_string, fileName, blobAttrs);

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

  //filename = "sample.geojson", //console.log('fileName: ' + fileName);

  //uncomment if we want to use the masked layer - this just overwrites that variable
  //formatted_masked_reprojected = [JSON.stringify(geoJson2)];

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
      waitingDialog.hide();
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
  