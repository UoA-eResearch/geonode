//03-May-2022 ..Prepares data and calls OpenPGP Enryption and Decryption 
//These functions are called directly from html. Thus, is independent of, and no need to involve dstool.js script. 
//Layer_Uploads.html calls 'callOpenPGPEncrypt' and Comments.html calls 'callOpenPGPDecrypt' for decrption

const key1 = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.10
Comment: https://openpgpjs.org

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
57RFosPcMfI=
=2eZA
-----END PGP PUBLIC KEY BLOCK-----`;  //This is my public key

//This is the testuser public key
const key2 = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.10
Comment: https://openpgpjs.org

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
=DCgM
-----END PGP PUBLIC KEY BLOCK-----`;


const privkey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v4.10.10
Comment: https://openpgpjs.org

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
rCAVFIwQQPgXLG7pykPrFjPntEWiw9wx8g==
=6qOL
-----END PGP PRIVATE KEY BLOCK-----`;



// Creates the zip file and calls OpenPGP encryption. We now only have single level encryption in OpenPGP
// For OpenPGP, we just encrypt the original layer - the unmasked one - and zip that with some text files   
async function callOpenPGPEncrypt()  { //v_ciphertextInFile, levelToDecrypt, currentLevel){ //v_objFile
  console.log("Inside callOpenPGPEncrypt() function ");
  //console.log("Decryption levelToDecrypt "+  levelToDecrypt + " currentLevel " + currentLevel); 
  var downloadFile = true;
  var level = 1;  //in OpenPGP we just have one level, so save after that 

  var startTime = new Date();  
  var originalmap_jsonString = JSON.stringify(sensitive.data, circularReplacer());
  
  global_originalmap_jsonString = originalmap_jsonString;
  //for the below functions, currently we are using the same passphrase - from textbox in the form. This will change
  
  var zipLevel1 = new JSZip();  //Only one level encryption in OpenPGP
  zipLevel1.file("original.geojson", originalmap_jsonString);  //add original map file to zip file
  zipLevel1.file("Metadata.txt", //above has values here
             "Masking parameters of Level 2 \nRandDist: " + randDist + "\nRandAngle: " + randAngle +
          "\nNote this level contains the fine level (original map) - no masked map " +
          "\n(but contains the masking parameters of the medium map - which is masked first, from one level outside ");
  zipLevel1.file("folder/placeholderfile.txt", "placeholderfile in folder"); 
  
  zipLevel1.generateAsync({type:"blob"})
    .then(function(content) {
        console.log('contents: ' + content);
        console.log("Level Zipped and Calling Encryption:");
        encryptedZipFile = OpenPGPEncryptData_ZipFile(content, downloadFile, level);
    });  
}

//parameter 'level' is not used
async function OpenPGPEncryptData_ZipFile(zipBlob, downloadFile, level) 
{   
  console.log("OpenPGPEncryptDataZipFile() fn Now:");      
/*  const key1 = textFromFileLoaded;  //This is my public key
    //This is the testuser public key
const key2 = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.10
Comment: https://openpgpjs.org

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
=DCgM
-----END PGP PUBLIC KEY BLOCK-----`; */
//$$$ key1 to key2
  const publicKeysArmored = [key1, key2];
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
  console.log('encrypted: ' + encrypted);
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
  console.log('Decrypting Now');
  //var c = await callOpenPGPDecrypt_zipFile(encrypted, encryptedBlob, 1, 1);
 
  console.log('privkey: ' + privkey);

  await newFunction(encrypted); 

}

async function newFunction(encrypted) {
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
}

//modified version of the recursive decrypt function to call OpenPGP as we now only have single level encryption 
//maybe we dont need this functiona dn can call the 'decryptOpenPGP' function directly
//async function callOpenPGPDecrypt_zipFile(v_ciphertextInFile, levelToDecrypt, currentLevel){ //v_objFile
                                        //encrypted, 
async function callOpenPGPDecrypt_zipFile(encrypted_Blob, levelToDecrypt, currentLevel){ //v_objFile
  console.log("Inside callOpenPGPDecrypt() function ");
  console.log("Decryption levelToDecrypt "+  levelToDecrypt + " currentLevel " + currentLevel); 
  var downloadFile = false;
  if (currentLevel == levelToDecrypt)
      downloadFile = true;

  downloadFile = true;

  var binaryData = new Uint8Array(await encrypted_Blob.arrayBuffer());

   //10-May-2022. we donyt need this cponversion as we difectly read the body while doing the fetch from geonode   
   //get content from file object. The `big encrypted zip file'
   /*var cipherbytes=await readfile(v_objFile)
   .catch(function(err){
       console.error(err);
   });*/ 

  //var encrypted_maskedData=new Uint8Array(cipherbytes);
  //let decrypted_file_data = await decryptOpenPGP(encrypted_maskedData, currentLevel, downloadFile); //will automatically use the 'objFile' global variable

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
                            //encrypted_maskedData, cipherTextInFile,
                            //encrypted, encryptedZIPBlob
async function decryptOpenPGP(binaryData, currentLevel, downloadFile) //cipherbytes
{    
  console.log('Decrypting encrypted Layer using OpenPGP');
  //document.getElementById("progressbar").className = "progress-bar progress-bar-striped progress-bar-animated";
  // put keys in backtick (``) to avoid errors caused by spaces or tabs
  //Retrieve user's uploaded public key
  //const privkey = document.getElementById("inputTextToSave").value  //textFromFileLoaded; //document.getElementById("privKey").value
  
/*  const privkey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
  Version: OpenPGP.js v4.10.10
  Comment: https://openpgpjs.org
  
  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
  rCAVFIwQQPgXLG7pykPrFjPntEWiw9wx8g==
  =6qOL
  -----END PGP PRIVATE KEY BLOCK-----`;

  console.log('privkey: ' + privkey);
*/
  //const privkey = document.getElementById("inputTextToSave").value  //textFromFileLoaded; //document.getElementById("privKey").value
  
  //const privKeyObj = openpgp.key.readArmored(privkey).keys[0]
  //const privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0]
  //$$$const privKeyObj = await openpgp.readKey({armoredKey: privkey})
  //const privKeyObj = await readPrivateKey({ armoredKey: privkey });
 
  const privKeyObj = ( await openpgp.readKey( { armoredKey: privkey } ) .catch( (err) => 
  { 
    console.log(err);
  } ) )  //.keys[0]

  /* We dont use passphrase
  if (passphrase) {
    await privKeyObj.decrypt(passphrase).catch((err) => {document.getElementById("result").value = err.message;document.getElementById("progressbar").className = "progress-bar bg-danger";})
  } */
  console.log('here 1 ');

  //saveAs(encryptedZIPBlob,'testencrypted.enc');

  //var binaryData = new Uint8Array(await encryptedZIPBlob.arrayBuffer());  console.log('here 2 ');
  const { data: decrypted } = await openpgp.decrypt({
    message: await openpgp.readMessage({ binaryMessage: binaryData }),  //encrypted //binaryData    //({ text: 'Hello, World!' }), // input as Message object
    decryptionKeys: [privKeyObj], // privkey, //[privKeyObj], // publicKeys,
    //signingKeys: privateKey // optional
    format: 'binary'
  }); 
  console.log('here 3 ');
  
  if(downloadFile) { //we only download/display link at the right level
    //save the blob file https://github.com/eligrey/FileSaver.js/issues/357        
    var decryptedBlob = new Blob([decrypted],{type: 'text/plain'} ); // save as Blob 
    //var fileName2 = fileName + "_level"+ currentLevel +".zip"; ..no longer using levels
    var fileName2 = fileName + ".zip";
    saveAs(decryptedBlob, fileName2); 
    console.log('Decrypted file saved, filename: ' + fileName2)  
  } 
  return binaryData; //plaintextbytes;
}