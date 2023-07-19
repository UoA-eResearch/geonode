//03-May-2022 ..Prepares data and calls OpenPGP Enryption and Decryption 
//These functions are called directly from html. Thus, is independent of, and no need to involve dstool.js script. 
//Layer_Uploads.html calls 'callOpenPGPEncrypt' and Comments.html calls 'callOpenPGPDecrypt' for decrption

var decryptedGEOJSON; //once decrypted, hold the geojson 

var to_encrypt_users_array; //global array to hold the selected users in the combo box for encryption 

var fileToEncrypt;

//This is the public key of the test maori girl user 'aihe' which will be used for openpgp encryption 
const publicKey_aihe = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.10
Comment: https://openpgpjs.org

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
=DCgM
-----END PGP PUBLIC KEY BLOCK-----`; 

// Creates the zip file and calls OpenPGP encryption. We now only have single level encryption in OpenPGP
// For OpenPGP, we just encrypt the original layer - the unmasked one - and zip that with some text files   
async function callOpenPGPEncrypt()  { //v_ciphertextInFile, levelToDecrypt, currentLevel){ //v_objFile
  console.log("Inside callOpenPGPEncrypt() function ");
  //console.log("Decryption levelToDecrypt "+  levelToDecrypt + " currentLevel " + currentLevel); 
  var downloadFile = true;
  var level = 1;  //in OpenPGP we just have one level, so save after that 
  //just to show user the spinner, we delay half second - spinner doesnt work without this wait facility
  //await new Promise(resolve => setTimeout(resolve, 500));
  var originalmap_jsonString = JSON.stringify(sensitive.data, circularReplacer());
  global_originalmap_jsonString = originalmap_jsonString;
  //for the below functions, currently we are using the same passphrase - from textbox in the form. This will change
 
  //if(sampleShapeFileUploaded)
  //  fileToEncrypt = original_shapefile;
  //else
  //  fileToEncrypt = fileInput.files[0];

  /* 09 June 2023 We  dont include these many files anymore - we just encrypt the shapefile
  var zipLevel = new JSZip();  //Only one level encryption in OpenPGP
  zipLevel.file("original.geojson", originalmap_jsonString);  //add original map file in geojson format to zip file
  zipLevel.file(fileName + ".zip", fileToEncrypt);       //add the original uploaded shapefile (the original file loaded by user)
  zipLevel.file("Metadata.txt", //above has values here
             "Masking parameters of Level 2 \nRandDist: " + randDist + "\nRandAngle: " + randAngle +
          "\nNote this level contains the fine level (original map) - no masked map " +
          "\n(but contains the masking parameters of the medium map - which is masked first, from one level outside ");
  zipLevel.file("folder/placeholderfile.txt", "placeholderfile in folder"); 
  
  //waitingDialog.show('Encrypting Layer...');
  
  //waitingDialog.show('Encrypting Layer...',{
	//  //headerText: 'Data Sovereignty',
	//			//dialogSize: 'sm',
	//			progressType: 'danger'
	//  }); 
  
  //zipLevel.generateAsync({type:"blob"})
  zipLevel.generateAsync({type: "blob", compression: "DEFLATE"}, )  //https://stuk.github.io/jszip/
    .then(function(content) {
        console.log('contents: ' + content);
        console.log("Level Zipped and Calling Encryption:");
        encryptedZipFile = OpenPGPEncryptData_ZipFile(content, downloadFile, level);
    }); 
  */   
  //we just encrypt the shapefile
  OpenPGPEncryptData_ZipFile(fileToEncrypt, downloadFile, level); 
  
  //stop the spinner
  $(".loading-icon").addClass("hide");
  $(".button").attr("disabled", false);
  $(".btn-txt-enc").text("Encrypt"); 
}

//parameter 'level' is not used
async function OpenPGPEncryptData_ZipFile(zipBlob, downloadFile, level) 
{   
  var startTime = new Date();
  console.log("OpenPGP EncryptData ZipFile");      
  const publicKey1 = textFromFileLoaded;  //This is my public key
  console.log('textFromFileLoaded' + textFromFileLoaded) 
  
  //$$$ key1 to key2
  const publicKeysArmored = [publicKey1, publicKey_aihe]; //[publicKey1, publicKey_aihe];
  //ideally all the users will be from the database and captured via javascript
  
  //console.log('publicKey2' + publicKey2)
  
  //but we make do with just two users now - two maori users 'Manaaki' and 'aihe'  
/*
  var to_encrypt_users_array;
  for (var val of to_encrypt_users_array)              {                  
    console.log('user ' + val);
    if (val == 'aihe') 
      publicKeysArmored.push(publicKey_aihe);//   add 'publicKey_aihe' to publicKeysArmored array
    //else if  (val == 'manaaki')   
    //  publicKeysArmored.push(publicKey_manaaki);//   add 'publicKey_aihe' to publicKeysArmored array
    //publicKey_user2                  
  }  
*/

  //create a combined key
  const publicKeys = await Promise.all(publicKeysArmored.map(armoredKey => openpgp.readKey({ armoredKey }))); 

  //var binaryData = new Uint8Array(zipBlob);  
  var binaryData = new Uint8Array(await zipBlob.arrayBuffer());
        //{data: encrypted} // or const { message }//or encrypted
  const  encrypted  = await openpgp.encrypt({
    message: await openpgp.createMessage({ binary: binaryData }),      //({ text: 'Hello, World!' }), // input as Message object
    encryptionKeys: publicKeys,
    //signingKeys: privateKey // optional
    format: 'binary'
  });

  var endTime = new Date(); 
  var difference = (endTime - startTime) / 1000;
  console.log("OpenPGP Encryption Time : " + difference + " seconds");

//  console.log('encrypted: ' + encrypted);
  var encryptedBlob = new Blob([encrypted],{type: 'text/plain'}); //{type: 'text/plain'} );  //cipherbytes   
  //var encryptedBlob = new Blob([encrypted], {type: "octet/stream"}); 
  //saveAs(encryptedBlob, 'test.zip.enc' ); 
  
  // temp commneted 
  //08-May-2022..store it as global variable so that it can later be sent to geonode document endpoint
  global_finalEncryptedZipFile = encryptedBlob; 
  finalFilename = fileName + ".zip" + ".enc";  //finalFilename is a global variable which will be soon used to upload the document
  if (downloadFile){
    saveAs(encryptedBlob, finalFilename ); //"test"+level+".enc"); //fileName2); 
    console.log('encrypted file saved: ' + finalFilename ); //"test"+level+".enc"); //fileName2) 
  }
  
  //compute hash of the final encrypted volume file (level 3).
  //https://stackoverflow.com/questions/21761453/create-sha-256-hash-from-a-blob-file-in-javascript
  const hashHex = await getHash("SHA-256", encryptedBlob)
  hash_value = hashHex;          //finally UPDATE THE GLOBAL VARIABLE 'HASH'
  console.log('hashHex: ' + hashHex);
  waitingDialog.hide(); 

  //lets see of decryption works with this blob
  //console.log('Decrypting Now');
  //var c = await callOpenPGPDecrypt_zipFile(encrypted, encryptedBlob, 1, 1); 
  //console.log('privkey: ' + privkey);
  //await testDecryption(encrypted); 
}

//modified version of the recursive decrypt function to call OpenPGP as we now only have single level encryption 
//maybe we dont need this functiona dn can call the 'decryptOpenPGP' function directly
//async function callOpenPGPDecrypt_zipFile(v_ciphertextInFile, levelToDecrypt, currentLevel){ //v_objFile
                                        //encrypted, 
async function callOpenPGPDecrypt_zipFile(encrypted_Blob, levelToDecrypt, currentLevel){ //v_objFile
  console.log("Inside callOpenPGPDecrypt() function ");
  console.log("Decryption levelToDecrypt "+  levelToDecrypt + " currentLevel " + currentLevel); 
  
  console.log('Decrypting encrypted Layer using OpenPGP');
  //waitingDialog.show('Decrypting Layer...');
  waitingDialog.show('Decrypting Layer...',{
	  //headerText: 'Data Sovereignty',
				//dialogSize: 'sm',
				progressType: 'danger'
	  }); 

  var downloadFile = false;
  if (currentLevel == levelToDecrypt)
      downloadFile = true;

  downloadFile = true;
  var binaryData = new Uint8Array(await encrypted_Blob.arrayBuffer());
  //for zip files                             //v_ciphertextInFile
                                              //encrypted, encrypted_Blob
  let decrypted_file_data = await decryptOpenPGP(binaryData, currentLevel, downloadFile); //cipherbytes//will automatically use the 'objFile' global variable
  //for text files..works
  //let decrypted_file_data = await decryptOpenPGP_textFile(v_ciphertextInFile, currentLevel, downloadFile); //cipherbytes//will automatically use the 'objFile' global variable

   return decrypted_file_data;
}

/*
//13-June-2022 browserPGP.github.io/decrypt.html
// Will need to add this to the decryption 
  const passphrase = document.getElementById("pass").value
  const privKeyObj = (
							await openpgp.key.readArmored(privkey)
								.catch(	(err) => 	{
											document.getElementById("result").value = err.message;
											document.getElementById("progressbar").className = "progress-bar bg-danger";
										} ) ).keys[0]

    if (passphrase) {
      await privKeyObj.decrypt(passphrase).catch((err) => {document.getElementById("result").value = err.message;document.getElementById("progressbar").className = "progress-bar bg-danger";})
    }

    const options = {
        message: await openpgp.message.readArmored(encrypted).catch((err) => {document.getElementById("result").value = err.message;document.getElementById("progressbar").className = "progress-bar bg-danger";}),    // parse armored message
        privateKeys: [privKeyObj]                                 // for decryption
    }

    openpgp.decrypt(options).then(plaintext => {
      document.getElementById("result").value = plaintext.data;
      document.getElementById("progressbar").className = "progress-bar bg-success";
    }).catch(function(error){
      document.getElementById("result").value = error.message;
      document.getElementById("progressbar").className = "progress-bar bg-danger";
    });
*/

//OpenPGP decrypt function .for zip files
//First argument trials: encrypted_maskedData, cipherTextInFile, //encrypted, encryptedZIPBlob
async function decryptOpenPGP(binaryData, currentLevel, downloadFile) //cipherbytes
{    
  var startTime = new Date();
  //document.getElementById("progressbar").className = "progress-bar progress-bar-striped progress-bar-animated";
  // put keys in backtick (``) to avoid errors caused by spaces or tabs
  //Retrieve user's uploaded public key
  const privkey = textFromFileLoaded; //document.getElementById("inputTextToSave").value  //textFromFileLoaded; //document.getElementById("privKey").value
  console.log('privkey: ' + privkey);
  const passphrase = document.getElementById("pass").value
  console.log('passphrase: ' + passphrase)

  //const privkey = document.getElementById("inputTextToSave").value  //textFromFileLoaded; //document.getElementById("privKey").value 
  //const privKeyObj = openpgp.key.readArmored(privkey).keys[0]
  //const privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0]
  //$$$const privKeyObj = await openpgp.readKey({armoredKey: privkey})
  //const privKeyObj = await readPrivateKey({ armoredKey: privkey });
   
  const privKeyObj = ( await openpgp.readKey( { armoredKey: privkey } ) .catch( (err) => 
  { 
    console.log(err);
  } ) ); //.keys[0]
  

  //using passphrase. Executes only of passphrase textbox is populated
  /*if (passphrase) {
    console.log('Decrypting passphrase');
    await privKeyObj.decrypt(passphrase).catch((err) => {      console.log('err.message' + err.message)    })    
  } */
  const privateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: privkey }), //privateKeyArmored
    passphrase
  });
  console.log('Completed decryption of private key')
    
  const { data: decrypted } = await openpgp.decrypt({
    message: await openpgp.readMessage({ binaryMessage: binaryData }),  //encrypted //binaryData    //({ text: 'Hello, World!' }), // input as Message object
    //decryptionKeys: [privKeyObj], // privkey, //[privKeyObj], // publicKeys,
    decryptionKeys: privateKey, //privateKeys: [privKeyObj],  
    //signingKeys: privateKey // optional
    format: 'binary'
  }).catch(function(error){
    console.log('Error decrypting');
    alert('Error decrypting');
  }); 
  
//  console.log('Decrypted data ' + decrypted);
  decryptedZipFile = decrypted;
  //this does not work
  //var base64String = Uint8Array.from(window.atob(decrypted), (v) => v.charCodeAt(0));
  //this works
  //var geojson_string = convertArrayBuffertoString(decrypted)
  unzipFile_DisplayMap(decryptedZipFile)

  //have to unzip the zip file and then display the 
  
  //console.log('Decrypted data - base64String' + geojson_string);
  
  var endTime = new Date(); 
  var difference = (endTime - startTime) / 1000;
  console.log("OpenPGP Decryption Time : " + difference + " seconds");


  if(downloadFile) { //we only download/display link at the right level
    //save the blob file https://github.com/eligrey/FileSaver.js/issues/357        
    var decryptedBlob = new Blob([decrypted],{type: 'text/plain'} ); // save as Blob 
    //var fileName2 = fileName + "_level"+ currentLevel +".zip"; ..no longer using levels
    var fileName2 = fileName + ".zip";
    saveAs(decryptedBlob, fileName2); 
    console.log('Decrypted file saved, filename: ' + fileName2)  
  } 
  waitingDialog.hide();
  return binaryData; //plaintextbytes;
}

function unzipFile_DisplayMap(decrypted_file_data){
    //`big encrypted zip file' is encrypted. So here we Decrypt it into file content into fileobject so we can iterate over each file
    var file = new File([decrypted_file_data], "decrypted.txt", {
      type: "text/plain",
    });
    v_objFile = file; //assign to variable used below

    //From the decrypted zip file object, we unzip each file 
    console.log("Unzipping now: "); 
    var jsZip = new JSZip();
    var fileNum =0;
    jsZip.loadAsync(v_objFile).then(function (zip) {
        Object.keys(zip.files).forEach(function (filename){
            //now we iterate over each zipped file 
            zip.files[filename].async('string').then(function (fileData){
                console.log("\t filename: " + filename);                             
                    //if we found the shapefile file and this is the level of which we want to show/decrypt the volume                
                if (filename.endsWith('.zipR') == true){ // && currentLevel == levelToDecrypt){ //&& currentLevel == levelToDecrypt){
                    console.log("\t file to decrypt: " + filename); // decrypt the file here //projFileName = i;                        
                    //we decrypt the encrypted volume at that level, display and allow user to save the decrypted file
                    
                    console.log("\t For verification. We can display the map here");                            
                    //create a file out of the `decrypted_file_data' variable
                    decryptedGEOJSON = fileData;
                    //08-dec-2022 we use the same function. never mind the paramaters 
                    //we just has to update the fileInput parameter and later the displayMap() fun will use that variable to display
                    console.log("Calling loadShapeFile")
                    //loadShapeFileFromVariable(zip.files[filename], "sensitiveTag", "sensitive")
                    
                    //refer to 'multiLevelDecrypt' function in dstools.js file in mapsafe for much commented code in this block
                    zip.file(filename).async('blob').then( (blob) => { 
                        console.log("Downloading File")                           
                        //saveAs(blob, filename);                          
                        //const buf = blob.arrayBuffer();
                        const buffer = new Response(blob).arrayBuffer();
                        
                        (async () => {
                            //const blob = new Blob(['hello']);
                            const buf = await blob.arrayBuffer();
                            console.log( buf.byteLength ); // 5
                            
                            //06-Jan-2023, create geojson from shapefile for diplay during verification. We should only create a geojson from shapefile, like below. 
                            //However, as shapefile is a zip file, while decrypting there are two sets of zip files (the shapefile and 
                            //the (decrypted) zip file). Thus, until we find a way to differentiate between the two, we have to store a geojson along for display later on
                            shp(buf).then(function (geojson) {
                                console.log(" Loaded geojson "); // + JSON.stringify(geojson));
                                    sensitive.data  = JSON.stringify(geojson); //removeEmpty(JSON.stringify(geojson, undefined, 4)) // first use JSON.stringify ); 
                                    console.log('sensitive.data 2 '+ sensitive.data )                                    
                            });
                          })();    
                    }); 
                    console.log("Called loadShapeFile")                    
                }
                if (filename.endsWith('.geojson') == true){ // && currentLevel == levelToDecrypt){
                    zip.file(filename).async('string').then( (str) => {                           
                        $("#sensitiveTag").html("sensitive.data = " + str + ";"); // fileData + ";"); //JSON.stringify(geojson) + ";");    
                        decryptedGEOJSON = str;
                    });
                }
                //contents of the metadata txt file
                if (filename.endsWith('.txt') == true){
                    //console.log("\t txtfile contents: " + filename); 
                }                
            })           
        })
    }).catch(err => window.alert(err)) 

}

function convertStringToArrayBuffer(str) {
  var encoder = new TextEncoder("utf-8");
  return encoder.encode(str);
}
function convertArrayBuffertoString(buffer) {
  var decoder = new TextDecoder("utf-8");
  return decoder.decode(buffer);
}

/*
async function testDecryption(encrypted) {
  const privKeyObj = (await openpgp.readKey({ armoredKey: privkey }).catch((err) => {
    //document.getElementById("progressbar").className = "progress-bar bg-danger";
    console.log(err);
  })); //.keys[0]

  //var binaryData = new Uint8Array(await encryptedZIPBlob.arrayBuffer());  console.log('here 2 ');
  const { data: decrypted } = await openpgp.decrypt({
    message: await openpgp.readMessage({ binaryMessage: encrypted }),
    decryptionKeys: [privKeyObj],

    //signingKeys: privateKey // optional
    format: 'binary'
  });
  console.log('here 3 ');
  var decryptedBlob = new Blob([decrypted], { type: 'text/plain' });
  //var encryptedBlob = new Blob([encrypted], {type: "octet/stream"});
  saveAs(decryptedBlob, 'testdecrypted.zip');
} */