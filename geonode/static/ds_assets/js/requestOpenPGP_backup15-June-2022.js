//03-May-2022 ..Prepares data and calls OpenPGP Enryption and Decryption 
//These functions are called directly from html. Thus, is independent of, and no need to involve dstool.js script. 
//Layer_Uploads.html calls 'callOpenPGPEncrypt' and Comments.html calls 'callOpenPGPDecrypt' for decrption

//modified version of the recursive decrypt function to call OpenPGP as we now only have single level encryption
//For OpenPGP, we just encrypt the original layer - the unmasked one - and zip that with some text files   
async function callOpenPGPEncrypt()  { //v_ciphertextInFile, levelToDecrypt, currentLevel){ //v_objFile
  console.log("Inside callOpenPGPEncrypt() function ");
  //console.log("Decryption levelToDecrypt "+  levelToDecrypt + " currentLevel " + currentLevel); 
  var downloadFile = false;
  var level = 1;  //in OpenPGP we just have one level, so save after that 
  //if (currentLevel == levelToDecrypt)
  //    downloadFile = true;

  var startTime = new Date();
  console.log("Level Zipped and Encryption: ");
  var originalmap_jsonString = JSON.stringify(sensitive.data, circularReplacer());
  
  global_originalmap_jsonString = originalmap_jsonString;
  //for the below functions, currently we are using the same passphrase - from textbox in the form. This will change
  
  //Only one level encryption in OpenPGP
  var zipLevel1 = new JSZip();
  zipLevel1.file("original.geojson", originalmap_jsonString);  //add original map file to zip file
  zipLevel1.file("Metadata.txt", //above has values here
             "Masking parameters of Level 2 \nRandDist: " + randDist + "\nRandAngle: " + randAngle +
          "\nNote this level contains the fine level (original map) - no masked map " +
          "\n(but contains the masking parameters of the medium map - which is masked first, from one level outside ");
  zipLevel1.file("folder/placeholderfile.txt", "placeholderfile in folder"); 
  /*
  try {                                                                     //in OpenPGP we just have one level, so save after that                                                            
      encryptedZipFileData_Level1 = await zip_callOpenPGPEncryption(zipLevel1, 1);  // Await for the first function to complete
      }
  catch (error) { console.error(error); } 
  */    
  zipLevel1.generateAsync({type:"blob"})
    .then(function(content) {
        console.log('contents: ' + content);
        encryptedZipFile = OpenPGPEncryptDataZipFile(false, content, downloadFile, level);
    });  
}

// This was a function we called instead of the above function, just to design a function for a dummy zip file we created on the fly
// encrytion and the next function are temporary functions to see if we can make the zip encryption work
/* This works fine, but we want to call the code in here via the '' function
function openpgp_encryptZIPFile(){
  console.log("Inside openpgp_encryptZIPFile() function ");
  var downloadFile = false;
  var level = 1;
  
  var zip = new JSZip();
  zip.file("Hello.txt", "Hello World\n");
  var img = zip.folder("images");
  //img.file("smile.gif", imgData, {base64: true});
  zip.generateAsync({type:"blob"})
  .then(function(content) {
      console.log('contents: ' + content);
      //This works. saveAs(content, 'test.zip' ); 

      // const message = await openpgp.createMessage({ text: content }); //plainTextString  //str //plaintextbytes
      // const encrypted = await openpgp.encrypt({        
      //     message, //plaintextbytes, //message, // input as Message object          
      //     encryptionKeys: publicKeys //,
      // });      
      // //07-May-2022 ...temp code block
      // var encryptedBlob = new Blob([encrypted],{type: 'text/plain'}); //{type: 'text/plain'} );  //cipherbytes        
      // //08-May-2022..store it as global variable so that it can later be sent to geonode document endpoint
      // global_finalEncryptedZipFile = encryptedBlob;
      // finalFilename = fileName + "." + documentExtension + ".enc";  //finalFilename is a global variable which will be soon used to upload the document
      // saveAs(encryptedBlob, finalFilename ); //"test"+level+".enc"); //fileName2); 
      // console.log('encrypted file saved: ' + finalFilename ); //"test"+level+".enc"); //fileName2) 
      
      encryptedZipFile = OpenPGPEncryptDataZipFile(false, content, downloadFile, level);
  });  
}
*/

//parameter 'level' is not used
async function OpenPGPEncryptDataZipFile(isDocument, zipBlob, downloadFile, level) 
{   
  console.log("OpenPGPEncryptDataZipFile() fn Now:");  
  //This is my public key
  const key1 = textFromFileLoaded;  
    //This is the testuser public key
const key2 = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.10
Comment: https://openpgpjs.org

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
=DCgM
-----END PGP PUBLIC KEY BLOCK-----`;
//$$$ key1 to key2
  const publicKeysArmored = [key1, key2];
  //create a combined key
  const publicKeys = await Promise.all(publicKeysArmored.map(armoredKey => openpgp.readKey({ armoredKey }))); 

  //https://github.com/openpgpjs/openpgpjs/blob/main/README.md
  //OpenPGP.js v4
  //const message = openpgp.Message.fromBinary(binary); //fileInput.files[0]);   //binary //.message.fromBinary(binary);
  //OpenPGP.js v5
  //const message2 = await openpgp.createMessage({ binary: binaryData });

  //var binaryData = new Uint8Array(zipBlob);  
  var binaryData = new Uint8Array(await zipBlob.arrayBuffer())
        //{data: encrypted}
        // or const { message }
        //or encrypted
  const  encrypted  = await openpgp.encrypt({
    message: await openpgp.createMessage({ binary: binaryData }),      //({ text: 'Hello, World!' }), // input as Message object
    encryptionKeys: publicKeys,
    //signingKeys: privateKey // optional
    format: 'binary'
  });
  console.log('encrypted: ' + encrypted);
  var encryptedBlob = new Blob([encrypted],{type: 'text/plain'}); //{type: 'text/plain'} );  //cipherbytes   
  //var encryptedBlob = new Blob([encrypted], {type: "octet/stream"});
  //main 
  saveAs(encryptedBlob, 'test.zip.enc' ); 
  //const encryptedFile = encrypted.packets.write()
  //saveAs(encryptedFile, 'test.zip.enc' ); 

  //add this as decryption option
  //format: 'binary' // output as Uint8Array

  var pri = `-----BEGIN PGP PRIVATE KEY BLOCK-----
  Version: OpenPGP.js v4.10.10
  Comment: https://openpgpjs.org
  
  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
  rCAVFIwQQPgXLG7pykPrFjPntEWiw9wx8g==
  =6qOL
  -----END PGP PRIVATE KEY BLOCK-----`;

  // https://github.com/unbilth/skylin/blob/bddec8587411e9f8122234832fef797f7a214090/encryption.js
  /*
  const passphrase = document.getElementById("pass").value;

  if (passphrase) {
    await privKeyObj.decrypt(passphrase).catch((err) => {
      //document.getElementById("result").value = err.message;document.getElementById("progressbar").className = "progress-bar bg-danger";
      console.log('err' + err)
    })
  }
  */

  /*
  // { data: decrypted }
  const decrypted = await openpgp.decrypt({
        //message: await openpgp.message.read(encrypted), //encryptedFile),
        message: await openpgp.createMessage({ binary: encrypted }), //encryptedFile),
        //const message = await openpgp.readMessage({ armoredMessage: fileBuffer });
        decryptionKeys: [pri],  //privateKey
        format: 'binary'
  });
  var decryptedBlob = new Blob([decrypted],{type: 'text/plain'}); //{type: 'text/plain'} );  //cipherbytes   
  saveAs(decryptedBlob, 'test.zip' );
*/

//const message = await createMessage({ binary: fileInput.files[0] });
  //const encrypted = await encrypt({ encryptionKeys: publicKeys, message, format: 'binary' });
  //console.log(encrypted); // Uint8Array
/*   
  var file_reader = new FileReader();
  file_reader.onload = function() {
    var binaryData = new Uint8Array(file_reader.result);  
    //const message = openpgp.Message.fromBinary(binary); //fileInput.files[0]);   //binary //.message.fromBinary(binary);
    const message = await openpgp.createMessage({ binary: binaryData });
    const encrypted =  openpgp.encrypt({
      message: message,
      publicKeys: publicKeys
    });  
  }
  file_reader.readAsArrayBuffer(zipBlob);
  console.log(file_reader);
*/

/*
  //const file = fs.readFileSync('/tmp/file-to-be-encryped');
    const fileArray = new Uint8Array(zipfile);
    //const fileStream = FileReaderStream(file)
    const options = {
        message: openpgp.message.fromBinary(fileStream), //zipfile //data: fileForOpenpgpjs,
        encryptionKeys: publicKeys, //openpgpPublicKey.keys,
        armor: false
    };
    const encryptionResponse = await openpgp.encrypt(options); // note the await here - this is async
    //const encryptedFile = encryptionResponse.message.packets.write();
    var encryptedBlob = new Blob([encryptionResponse],{type: 'text/plain'}); //{type: 'text/plain'} );  //cipherbytes 
    saveAs(encryptedBlob, 'test.zip.enc' ); 
*/

/*
  console.log('file_contents: ' + file_contents);
  var plaintextbytes = new Uint8Array(file_contents);
  console.log('plaintextbytes:  ' + plaintextbytes);
  var plainTextString = new TextDecoder().decode(plaintextbytes);  
  console.log('plainTextString: ' + plainTextString);
  //const message = await openpgp.createMessage({ text: plaintext });  
  var str = JSON.stringify(file_contents);
//    console.log('str: ' + str);    
  const message = await openpgp.createMessage({ text: str }); //file_contents //plainTextString  //str //plaintextbytes
  //saveAs(str, 'test.zip' ); 
  //console.log('plainTextString: ' + plainTextString);
  //const stream = fileReadableStream(file_contents)
  const encrypted = await openpgp.encrypt({        
      message, //plaintextbytes, //message, // input as Message object
      //message: openpgp.message.fromBinary(stream),
      encryptionKeys: publicKeys //,
      //signingKeys: privateKey // optional
  });
//    console.log('encrypted: ' + encrypted); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
  //var cipherbytes=new Uint8Array(encrypted);
  //07-May-2022 ...temp code block
  var encryptedBlob = new Blob([encrypted],{type: 'text/plain'}); //{type: 'text/plain'} );  //cipherbytes   
  //08-May-2022..store it as global variable so that it can later be sent to geonode document endpoint
  global_finalEncryptedZipFile = encryptedBlob; 
  finalFilename = fileName + "." + documentExtension + ".enc";  //finalFilename is a global variable which will be soon used to upload the document
  saveAs(encryptedBlob, finalFilename ); //"test"+level+".enc"); //fileName2); 
  console.log('encrypted file saved: ' + finalFilename ); //"test"+level+".enc"); //fileName2) 
  //compute hash of the final encrypted volume file (level 3).
  //https://stackoverflow.com/questions/21761453/create-sha-256-hash-from-a-blob-file-in-javascript
  const hashHex = await getHash("SHA-256", encryptedBlob)
  hash_value = hashHex;          //finally UPDATE THE GLOBAL VARIABLE 'HASH'
  console.log('hashHex: ' + hashHex);
  waitingDialog.hide();
 */ 
}

//parameter 'level' is not used

async function OpenPGPEncryptDataTextFile(isDocument, zipfile, downloadFile, level) 
{   
  console.log("OpenPGPEncryptDataTextFile() fn Now:");  
  //This is my public key
  const key1 = textFromFileLoaded;  
    //This is the testuser public key
const key2 = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.10
Comment: https://openpgpjs.org

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
=DCgM
-----END PGP PUBLIC KEY BLOCK-----`;

  const publicKeysArmored = [key1, key2];
  //create a combined key
  const publicKeys = await Promise.all(publicKeysArmored.map(armoredKey => openpgp.readKey({ armoredKey }))); 

  var file_reader = new FileReader();
  file_reader.onload = function() {
    let binary = new Uint8Array(file_reader.result);  
    const message = openpgp.Message.fromBinary(binary);
    const encrypted =  openpgp.encrypt({
      message: message,
      publicKeys: publicKeys
    });
  }
  file_reader.readAsArrayBuffer(zipfile);
  console.log(file_reader);


/*
  //const file = fs.readFileSync('/tmp/file-to-be-encryped');
    const fileArray = new Uint8Array(zipfile);
    //const fileStream = FileReaderStream(file)
    const options = {
        message: openpgp.message.fromBinary(fileStream), //zipfile //data: fileForOpenpgpjs,
        encryptionKeys: publicKeys, //openpgpPublicKey.keys,
        armor: false
    };
    const encryptionResponse = await openpgp.encrypt(options); // note the await here - this is async
    //const encryptedFile = encryptionResponse.message.packets.write();
    var encryptedBlob = new Blob([encryptionResponse],{type: 'text/plain'}); //{type: 'text/plain'} );  //cipherbytes 
    saveAs(encryptedBlob, 'test.zip.enc' ); 
*/

  
  console.log('file_contents: ' + file_contents);
  var plaintextbytes = new Uint8Array(file_contents);
  console.log('plaintextbytes:  ' + plaintextbytes);
  var plainTextString = new TextDecoder().decode(plaintextbytes);  
  console.log('plainTextString: ' + plainTextString);
  //const message = await openpgp.createMessage({ text: plaintext });  
  var str = JSON.stringify(file_contents);
//    console.log('str: ' + str);    
  const message = await openpgp.createMessage({ text: str }); //file_contents //plainTextString  //str //plaintextbytes
  //saveAs(str, 'test.zip' ); 
  //console.log('plainTextString: ' + plainTextString);
  //const stream = fileReadableStream(file_contents)
  const encrypted = await openpgp.encrypt({        
      message, //plaintextbytes, //message, // input as Message object
      //message: openpgp.message.fromBinary(stream),
      encryptionKeys: publicKeys //,
      //signingKeys: privateKey // optional
  });
//    console.log('encrypted: ' + encrypted); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
  //var cipherbytes=new Uint8Array(encrypted);
  //07-May-2022 ...temp code block
  var encryptedBlob = new Blob([encrypted],{type: 'text/plain'}); //{type: 'text/plain'} );  //cipherbytes   
  //08-May-2022..store it as global variable so that it can later be sent to geonode document endpoint
  global_finalEncryptedZipFile = encryptedBlob; 
  finalFilename = fileName + "." + documentExtension + ".enc";  //finalFilename is a global variable which will be soon used to upload the document
  saveAs(encryptedBlob, finalFilename ); //"test"+level+".enc"); //fileName2); 
  console.log('encrypted file saved: ' + finalFilename ); //"test"+level+".enc"); //fileName2) 
  //compute hash of the final encrypted volume file (level 3).
  //https://stackoverflow.com/questions/21761453/create-sha-256-hash-from-a-blob-file-in-javascript
  const hashHex = await getHash("SHA-256", encryptedBlob)
  hash_value = hashHex;          //finally UPDATE THE GLOBAL VARIABLE 'HASH'
  console.log('hashHex: ' + hashHex);
  waitingDialog.hide();  
}


// Takes the zip file object, generates a blob, zips it, calls encryption and returns it 
// syntax based on ``doJob'' example from  https://techbrij.com/javascript-async-await-parallel-sequence
// 03-May-2022 Modified to call the the OpenPGP encryption
/* 15June2022. This approach wil not work 
async function zip_callOpenPGPEncryption(zipFile, level) {
  return new Promise((resolve, reject)  => {
      console.log('zipping_callOpenPGPEncryption function')             
      var encryptedZipFile, encryptedZipFileData;
      var downloadFile = false;
      if(level == 1) downloadFile = true;  //07-May-2022 changed so that we encrypt at level 1
      //create a zip file of the coarse data and then save it    
      zipFile.generateAsync({type: "blob"})  //https://stuk.github.io/jszip/
          .then(function (content) {  
              console.log('Processing middle.')           
              var arrayBuffer, fileReader = new FileReader();        
              //this function is needed as we want to first create a file using the blob and then encrypt that 
              //You can use FileReader to read the Blob as an ArrayBuffer
              fileReader.onload = function (event) { 
                  arrayBuffer = fileReader.result;
                  console.log("here fileReader.result: " + fileReader.result);
                  //Web.Crypto Commented 03-May-2022
                  //encryptedZipFile = encryptData(false, fileReader.result, downloadFile, level);  //data passed is in arraybuffer format, but later should now be converted to blob again
                  //OpenPGP encryption
                  encryptedZipFile = OpenPGPEncryptData(false, fileReader.result, downloadFile, level);
                  encryptedZipFile.then((value) => {                            
                      encryptedZipFileData = value
                      resolve(encryptedZipFileData);
                  }); 
              };
              //actually, accoding to documentation, this gets called almost as soon as fileReader has been created
              fileReader.readAsArrayBuffer(content); //content = blob
              fileReader.result; // also accessible this way once the blob has been read                    
          }); 
      var str = JSON.stringify(encryptedZipFileData, circularReplacer());      
  })    
}
*?

//parameter 'level' is not used
async function OpenPGPEncryptData(isDocument, file_contents, downloadFile, level) 
{   
  console.log("OpenPGP Encrypting Now:");
  
  //This is my public key
  const key1 = textFromFileLoaded;

  //key2 was here
    //This is the testuser public key
const key2 = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.10
Comment: https://openpgpjs.org

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
=DCgM
-----END PGP PUBLIC KEY BLOCK-----`;

  const publicKeysArmored = [key1, key2];
  //create a combined key
  const publicKeys = await Promise.all(publicKeysArmored.map(armoredKey => openpgp.readKey({ armoredKey }))); 

  console.log('file_contents: ' + file_contents);

  var plaintextbytes = new Uint8Array(file_contents);
  console.log('plaintextbytes:  ' + plaintextbytes);

  var plainTextString = new TextDecoder().decode(plaintextbytes);  
  console.log('plainTextString: ' + plainTextString);

  //const message = await openpgp.createMessage({ text: plaintext });
  
  var str = JSON.stringify(file_contents);
//    console.log('str: ' + str);    
  const message = await openpgp.createMessage({ text: file_contents }); //plainTextString  //str //plaintextbytes
  //console.log('plainTextString: ' + plainTextString);
  //const stream = fileReadableStream(file_contents)
  const encrypted = await openpgp.encrypt({        
      message, //plaintextbytes, //message, // input as Message object
      //message: openpgp.message.fromBinary(stream),
      encryptionKeys: publicKeys //,
      //signingKeys: privateKey // optional
  });
//    console.log('encrypted: ' + encrypted); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'

  //var cipherbytes=new Uint8Array(encrypted);

  //07-May-2022 ...temp code block
  var encryptedBlob = new Blob([encrypted],{type: 'text/plain'}); //{type: 'text/plain'} );  //cipherbytes  
  
  //08-May-2022..store it as global variable so that it can later be sent to geonode document endpoint
  global_finalEncryptedZipFile = encryptedBlob; 
  
  finalFilename = fileName + "." + documentExtension + ".enc";  //finalFilename is a global variable which will be soon used to upload the document
  saveAs(encryptedBlob, finalFilename ); //"test"+level+".enc"); //fileName2); 
  console.log('encrypted file saved: ' + finalFilename ); //"test"+level+".enc"); //fileName2) 
  
  //compute hash of the final encrypted volume file (level 3).
  //https://stackoverflow.com/questions/21761453/create-sha-256-hash-from-a-blob-file-in-javascript
  const hashHex = await getHash("SHA-256", encryptedBlob)
  hash_value = hashHex;          //finally UPDATE THE GLOBAL VARIABLE 'HASH'
  console.log('hashHex: ' + hashHex);
  waitingDialog.hide();

/*  07-May-2022 ..commented out as we not using three level encryption and mainly because I need to make this work   
  //do we need this line of code below?
  var blob=new Blob([cipherbytes], {type: 'application/download'}); //resultbytes instead of plaintext    
  
  //we only download/display link when the level is right
  
  if(downloadFile){
      //save the blob file
      //https://github.com/eligrey/FileSaver.js/issues/357
      //var fileData2 = JSON.stringify(resultbytes, undefined, 4); // first use JSON.stringify 
      var blob2 = new Blob([cipherbytes],{type: 'text/plain'} ); // save as Blob 
      
      //18-02-2022..store it as global variable so that it can be sent to geonode document endpoint, if user wants
      global_finalEncryptedZipFile = blob2; 
      
      //compute hash of the final encrypted volume file (level 3).
      //https://stackoverflow.com/questions/21761453/create-sha-256-hash-from-a-blob-file-in-javascript
      const hashHex = await getHash("SHA-256", blob2)
      hash_value = hashHex;          //finally UPDATE THE GLOBAL VARIABLE 'HASH'
      console.log('hashHex: ' + hashHex); 

      //if we have the 'doc' extension, we take it is a document, else a map
      //var fileName2; ///filename to save  
      if(isDocument) //for documents  
          finalFilename = fileName + "." + documentExtension + ".enc";  //e.g. 'legislation.doc.enc'
      else           //for maps
          finalFilename = fileName + "." + documentExtension + ".enc";  //we should put in the zip extension - check 'documentExtension' - why same code for both cases?

      saveAs(blob2, finalFilename); //fileName2); 
      console.log('encrypted file saved: ' + finalFilename); //fileName2)         
  }   
  encryptedFileData = blob;   //do we need this line of code ??
  return Promise.resolve(cipherbytes);
*/
}

//modified version of the recursive decrypt function to call OpenPGP as we now only have single level encryption 
//maybe we dont need this functiona dn can call the 'decryptOpenPGP' function directly
async function callOpenPGPDecrypt(v_ciphertextInFile, levelToDecrypt, currentLevel){ //v_objFile
  console.log("Inside callOpenPGPDecrypt() function ");
  console.log("Decryption levelToDecrypt "+  levelToDecrypt + " currentLevel " + currentLevel); 
  var downloadFile = false;
  if (currentLevel == levelToDecrypt)
      downloadFile = true;

   //10-May-2022. we donyt need this cponversion as we difectly read the body while doing the fetch from geonode   
   //get content from file object. The `big encrypted zip file'
   /*var cipherbytes=await readfile(v_objFile)
   .catch(function(err){
       console.error(err);
   });*/ 

  //var encrypted_maskedData=new Uint8Array(cipherbytes);
  //let decrypted_file_data = await decryptOpenPGP(encrypted_maskedData, currentLevel, downloadFile); //will automatically use the 'objFile' global variable

  //for zip files
  //$$$ let decrypted_file_data = await decryptOpenPGP(v_ciphertextInFile, currentLevel, downloadFile); //cipherbytes//will automatically use the 'objFile' global variable
  //for text files
  let decrypted_file_data = await decryptOpenPGP_textFile(v_ciphertextInFile, currentLevel, downloadFile); //cipherbytes//will automatically use the 'objFile' global variable

  /*
  //`big encrypted zip file' is encrypted. So here we Decrypt it into file content into fileobject so we can iterate over each file
  var decfile = new File([decrypted_file_data], "decrypted.txt", {
      type: "text/plain",
  });
  //v_objFile = file; //assign to variable used below
     
  //save decrypted file (in zipped form) to see the details in the file at this point
  saveAs(decfile, "decryptedVolume_"+currentLevel+".zip");
  */
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

/*
https://github.com/openpgpjs/openpgpjs/discussions/1394
if the encrypted data is in string format (armored), then you can just check that it starts 
with -----BEGIN PGP MESSAGE-----. If you are working over a binary input, I'd just try to parse 
it as a message with openpgp.readMessage({ binaryMessage: ... }). 
If it succeeds, then it must be OpenPGP data.
*/

/*
//https://github.com/unbilth/skylin/blob/bddec8587411e9f8122234832fef797f7a214090/encryption.js
await privateKey.decrypt(passphrase)
      const encryptedFile = fs.readFileSync(filePath)

      const { data: decrypted } = await openpgp.decrypt({
        message: await openpgp.message.read(encryptedFile),
        privateKeys: [privateKey],
        format: 'binary'
      });

*/

//13-June-2022 ..Decryt text file
async function decryptOpenPGP_textFile(cipherTextInFile, currentLevel, downloadFile) //cipherbytes
{    
  console.log('Decrypting encrypteed Layer using OpenPGP');
  //document.getElementById("progressbar").className = "progress-bar progress-bar-striped progress-bar-animated";
  // put keys in backtick (``) to avoid errors caused by spaces or tabs
  //Retrieve user's uploaded public key
  const privkey = document.getElementById("inputTextToSave").value  //textFromFileLoaded; //document.getElementById("privKey").value
  //const passphrase = document.getElementById("pass").value
  //const encrypted = cipherbytes; // document.getElementById("pgpMsg").value

//    console.log('cipherbytes: ' + cipherbytes);

  //console.log('textFromFileLoaded: ' + textFromFileLoaded);
  console.log('privkey: ' + privkey);
  console.log('cipherTextInFile: ' + cipherTextInFile);
  //var enc = new TextDecoder("utf-8");
  //var encrypted_maskedData=new Uint8Array([cipherTextInFile]);
  //console.log('decoded: ' + enc.decode(encrypted_maskedData));
  //console.log('encrypted_maskedData: ' + encrypted_maskedData);

  //data conversion needed
//    var encrypted_maskedData=new Uint8Array(cipherbytes);

  /*
  const privKeyObj = (await openpgp.key.readArmored(privkey).catch((err) => 
  { 
    //document.getElementById("result").value = err.message;
    //document.getElementById("progressbar").className = "progress-bar bg-danger";
    console.log('err: ' + err.message);
  })).keys[0]
  */
  //const privKeyObj = openpgp.key.readArmored(privkey).keys[0]
  //const privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0]
  const privKeyObj = await openpgp.readKey({armoredKey: privkey})
  /* We dont use passphrase
  if (passphrase) {
    await privKeyObj.decrypt(passphrase).catch((err) => {document.getElementById("result").value = err.message;document.getElementById("progressbar").className = "progress-bar bg-danger";})
  } */
  
  //encrypted_maskedData  
  //const encrypted_message = await openpgp.createMessage({ text: cipherTextInFile });

  const options = {                                  //encrypted_message
      message: await openpgp.readMessage({armoredMessage: cipherTextInFile }).catch((err) => 
      {
        //document.getElementById("result").value = err.message;
        //document.getElementById("progressbar").className = "progress-bar bg-danger";
        console.log('err: ' + err.message);
      }),    // parse armored message
      decryptionKeys: [privKeyObj]       //privateKeys                          // for decryption
  }

  var plaintextbytes;

  openpgp.decrypt(options).then(plaintext => {
    //document.getElementById("result").value = plaintext.data;
    //document.getElementById("progressbar").className = "progress-bar bg-success";
     //plaintextbytes = new Uint8Array(plaintext.data);
     //console.log('plaintextbytes: ' + plaintextbytes);
     console.log('Decrypted data: ' + plaintext.data);
    console.log('plaintext.data2: ' + plaintext.data);
    //var blob = new Blob([plaintext.data],{type: 'application/zip'} ); // save as Blob 
    var blob = new Blob([plaintext.data], {type: 'text/plain'}); //{type: 'text/plain'} ); // save as Blob 
    //var fileName2 = fileName + "_level"+ currentLevel +".zip"; ..no longer using levels
//     var fileName2 = fileName + ".zip";

    var file = new File([blob], "decrypted.zip", { type: "text/plain", });
    
    

    saveAs(blob, fileName); // + ".zip"); 
//     console.log('Decrypted file saved, filename: ' + fileName2) 
  }).catch(function(error){
    //document.getElementById("result").value = error.message;
    //document.getElementById("progressbar").className = "progress-bar bg-danger";
    console.log('err: ' + error.message);
  });

  /*
  if(downloadFile) { //we only download/display link at the right level
    //save the blob file https://github.com/eligrey/FileSaver.js/issues/357        
    var blob = new Blob([plaintextbytes],{type: 'text/plain'} ); // save as Blob 
    //var fileName2 = fileName + "_level"+ currentLevel +".zip"; ..no longer using levels
    var fileName2 = fileName + ".zip";
    saveAs(blob, fileName2); 
    console.log('Decrypted file saved, filename: ' + fileName2)  
  }
  */

  return plaintextbytes;
}

//OpenPGP decrypt function .for zip files
//async function decryptOpenPGP(encrypted_maskedData, currentLevel, downloadFile) 
async function decryptOpenPGP(cipherTextInFile, currentLevel, downloadFile) //cipherbytes
{    
  console.log('Decrypting encrypteed Layer using OpenPGP');
  //document.getElementById("progressbar").className = "progress-bar progress-bar-striped progress-bar-animated";
  // put keys in backtick (``) to avoid errors caused by spaces or tabs
  //Retrieve user's uploaded public key
  const privkey = document.getElementById("inputTextToSave").value  //textFromFileLoaded; //document.getElementById("privKey").value
  //const passphrase = document.getElementById("pass").value
  //const encrypted = cipherbytes; // document.getElementById("pgpMsg").value

//    console.log('cipherbytes: ' + cipherbytes);

  //console.log('textFromFileLoaded: ' + textFromFileLoaded);
  console.log('privkey: ' + privkey);
  console.log('cipherTextInFile: ' + cipherTextInFile);
  //var enc = new TextDecoder("utf-8");
  //var encrypted_maskedData=new Uint8Array([cipherTextInFile]);
  //console.log('decoded: ' + enc.decode(encrypted_maskedData));
  //console.log('encrypted_maskedData: ' + encrypted_maskedData);

  //data conversion needed
//    var encrypted_maskedData=new Uint8Array(cipherbytes);

  /*
  const privKeyObj = (await openpgp.key.readArmored(privkey).catch((err) => 
  { 
    //document.getElementById("result").value = err.message;
    //document.getElementById("progressbar").className = "progress-bar bg-danger";
    console.log('err: ' + err.message);
  })).keys[0]
  */
  //const privKeyObj = openpgp.key.readArmored(privkey).keys[0]
  //const privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0]
  const privKeyObj = await openpgp.readKey({armoredKey: privkey})
  /* We dont use passphrase
  if (passphrase) {
    await privKeyObj.decrypt(passphrase).catch((err) => {document.getElementById("result").value = err.message;document.getElementById("progressbar").className = "progress-bar bg-danger";})
  } */
  
  //encrypted_maskedData  
  //const encrypted_message = await openpgp.createMessage({ text: cipherTextInFile });

  const options = {                                  //encrypted_message
      message: await openpgp.readMessage({armoredMessage: cipherTextInFile }).catch((err) => 
      {
        //document.getElementById("result").value = err.message;
        //document.getElementById("progressbar").className = "progress-bar bg-danger";
        console.log('err: ' + err.message);
      }),    // parse armored message
      decryptionKeys: [privKeyObj]       //privateKeys                          // for decryption
  }

  var plaintextbytes;

  openpgp.decrypt(options).then(plaintext => {
    //document.getElementById("result").value = plaintext.data;
    //document.getElementById("progressbar").className = "progress-bar bg-success";
     //plaintextbytes = new Uint8Array(plaintext.data);
     //console.log('plaintextbytes: ' + plaintextbytes);
     console.log('Decrypted data: ' + plaintext.data);
    console.log('plaintext.data2: ' + plaintext.data);
    //var blob = new Blob([plaintext.data],{type: 'application/zip'} ); // save as Blob 
    var blob = new Blob([plaintext.data], {type: 'text/plain'}); //{type: 'text/plain'} ); // save as Blob 
    //var fileName2 = fileName + "_level"+ currentLevel +".zip"; ..no longer using levels
//     var fileName2 = fileName + ".zip";

    var file = new File([blob], "decrypted.zip", { type: "text/plain", });
    
    //trying to unzip
    
    var jsZip = new JSZip();
    jsZip.loadAsync(file).then(function (zip) {
      Object.keys(zip.files).forEach(function (filename) {
        zip.files[filename].async('string').then(function (fileData) {
          console.log(fileData) // These are your file contents      
          saveAs(fileData, 'apple.txt'); // + ".zip"); 
        })
      })
    })
    

    saveAs(blob, fileName); // + ".zip"); 
//     console.log('Decrypted file saved, filename: ' + fileName2) 
  }).catch(function(error){
    //document.getElementById("result").value = error.message;
    //document.getElementById("progressbar").className = "progress-bar bg-danger";
    console.log('err: ' + error.message);
  });

  /*
  if(downloadFile) { //we only download/display link at the right level
    //save the blob file https://github.com/eligrey/FileSaver.js/issues/357        
    var blob = new Blob([plaintextbytes],{type: 'text/plain'} ); // save as Blob 
    //var fileName2 = fileName + "_level"+ currentLevel +".zip"; ..no longer using levels
    var fileName2 = fileName + ".zip";
    saveAs(blob, fileName2); 
    console.log('Decrypted file saved, filename: ' + fileName2)  
  }
  */

  return plaintextbytes;
}


//temp test function
/*
async function FileEncrypt()
{	
  const fileInput = document.getElementById('singleFileInput');
  
    //const file = e.target.files[0];		
  
  //fileInput.onchange = () => {
    const selectedFile = fileInput.files[0];
    console.log(selectedFile);
    
    const message = await openpgp.createMessage({ binary: selectedFile.stream() });
    const encrypted = await openpgp.encrypt({
    message, // input as Message object
      passwords: ['secret stuff'], // multiple passwords possible
      format: 'binary' // don't ASCII armor (for Uint8Array output)
    });

    console.log('encrypted' + encrypted);
    var encryptedBlob = new Blob([encrypted],{type: 'text/plain'}); //{type: 'text/plain'} );  //cipherbytes   
    saveAs(encryptedBlob,'test.enc');
  //}  
}
*/

//07-Jun-2022 temp function
/* Function works
function openpgp_encryptTextFile(){
  console.log("Inside openpgp_encryptTextFile() function ");
  var downloadFile = false;
  var level = 1;

  var blob = new Blob(["Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."], { type: "text/plain;charset=utf-8" });

  //create a file of the blob.//we are basically trying to encrypt files  //var file = fileInput.files.item(0);
  var file = new File([blob], "plaintext.txt", { type: "text/plain", });
  //this works
  //saveAs(blob,'encrypted.txt');

  //here we read the file contents
  var fileReader = new FileReader();
  fileReader.onload = function() {
    //callback(reader.result);
    console.log('fileReader.result:  ' + fileReader.result);
    encryptedZipFile = OpenPGPEncryptDataTextFile(false, fileReader.result, downloadFile, level);
  }
  fileReader.readAsText(file);
}
*/