//The main Data Sovereignty tool 

var objFile=null;       //upload encrypted file for decryption
var hash_value;         //maybe dont need this variable
var encryptedZIPFileData_fine, encryptedZIPFileData_medium, encryptedZIPFileData_coarse; //for each encryption level, store returned encrypted blob eac time
var fileInput = null;   //uploaded file 
var isDocument = false; //if uploaded file is document
var documentExtension = null; //file extension of uploaded file
var fileName = null;    // firstpart of original filename will be used as part of encrypted filename
var finalFilename = null;  //final filename of the encrypted zip file
var csrftoken = $('[name="csrfmiddlewaretoken"]').attr('value');

//import geojson2h3 from 'geojson2h3';

// 26-01-2022 ..the global geojson, later used to send to geoserver
var global_originalmap_jsonString = null;
//18-02-2022 ..the final encrypted zip file containing all encrypted volumes
var global_finalEncryptedZipFile = null;

//09-11-2021...save transaction receipt								
function saveReceipt(){
    /*
    Before Clicking the submit mint
        Should the user choose the minting priorty? low, medium, or high?
        Here are the fees:
            gas fees:
            priority fees:
            our charges: 

    After clicking the submit mint
        Here is a record of the transaction
        You have paid us X.XX for the trsnaction
        We expect that your transaction will be put/minted on the blockchain in X amount time.
        The transaction number is
        You can find the hash o fthe encrypted file stpored on the bloachain at the following address, 
        once its minted

    Save this record as a pdf file.
    */
    var txnNumber = 32;
    //import { jsPDF } from "jspdf";  
    // Default export is a4 paper, portrait, using millimeters for units
    console.log('saveReceipt 21 ()');
    const doc = new jsPDF();
    doc.text("Transaction Record!", 25, 10);
    doc.setFontSize(12);
    doc.setFontType('normal');
    doc.text(25, 73.60, 'Lastname');
    doc.text(25, 81, 'Firstname');
    doc.text(25, 91, 'You have paid us X.XX for the transaction');
    doc.text(25, 101, 'Transaction Number' + txnNumber);
    doc.text(25, 111, 'You can find the hash of the encrypted file at the following address, once its minted');

    var date = new Date()
	doc.text("Date: " + date, 25, 151)

    // generate pdf    
    doc.save("receipt"+ txnNumber +".pdf");
}

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

// input file validation
//https://www.geeksforgeeks.org/file-type-validation-while-uploading-it-using-javascript/
function fileValidation(flow) {
    var firstNextButton = document.getElementById("firstnextaction-button");
    var secondNextButton = document.getElementById("secondNextAction-button");

    console.log('fileValidation');
    if(flow == 1){       //safeguarding
        fileInput = document.getElementById('sensitiveInput');    //store first and only file as global variable                   
    }
    else if(flow == 2){  //verification
        console.log('verification: ');
        fileInput = document.getElementById('encryptedInput');    //store first and only file as global variable  
    } 
    var filePath = fileInput.value;  //var fileItself = fileInput.files[0];
    
    // Allowable file types
    var allowedDocExtensions = /(\.doc|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd)$/i;
    var allowedMapExtensions = /(\.zip|\.wpd)$/i;
    var allowedEncryptedExtensions = /(\.enc)$/i;                

     //get the filename firstpart for both safeguarding and verification
     //var fpath = this.value; //https://stackoverflow.com/questions/20323999/how-to-get-file-name-without-extension-in-file-upload-using-java-script?noredirect=1&lq=1
     var fpath = filePath.replace(/\\/g, '/');
     fileName = fpath.substring(fpath.lastIndexOf('/')+1, fpath.lastIndexOf('.'));
     console.log('fname firstpart: ' + fileName);
     
    //validate..safeguarding
    if(flow == 1) {   //if file is document
        //get file extension for documents
        documentExtension = filePath.split('.').pop();
        console.log('documentExtension: (' + documentExtension + ')'); 
          
        if (allowedDocExtensions.exec(filePath)) {  
            console.log('Valid doc filetype');               
            firstNextButton.disabled = false;
            isDocument = true;  console.log('Set isDocument == true'); //set if it's a document or map - as a global variable
            //hide the ''leveltodecrypt' option in decrypt step within the verification flow
            document.getElementById("ChooseVolumeToDecrypt").style.display = "none"; 
        } 
        else if (allowedMapExtensions.exec(filePath)){  //if file is map
            console.log('Valid map filetype');
            firstNextButton.disabled = false;
            document.getElementById("ChooseToEncrypt").style.display = "none"; 
        }
        else { //!allowedDocExtensions.exec(filePath) && !allowedMapExtensions.exec(filePath)			
            alert('Invalid file type');
            firstNextButton.disabled = true;				
        } 
        
    }
    //in decryption, we cannot know the file type unless we decrypt, so we just make sure the file extension is '.enc'
    else if(flow == 2) { //verification
        //repeat the code from above as .zip is stil not removed during verification
        fileName = fileName.substring(fileName.lastIndexOf('/')+1, fileName.lastIndexOf('.'));
        
        //if file has '.enc' extension
        if (allowedEncryptedExtensions.exec(filePath)) {  
            console.log('Valid encrypted filetype, filePath:' + filePath);               
            secondNextButton.disabled = false; //enable next button
            //hide the 'leveltodecrypt' option in decrypt step within the verification flow
            //document.getElementById("ChooseVolumeToDecrypt").style.display = "none"; 
            
            //lets check if it has the document extension we assigned in the middle of the filename
            filePath = filePath.replace('.enc',''); //remove the '.enc' extension ofr the below checking functions to work
            if (allowedDocExtensions.exec(filePath)) 
                isDocument = true;              
            else
                isDocument = false;
        }
        else {			
            alert('Invalid file type');
            secondNextButton.disabled = true;	//just making sure, but it should alrady be disabled			
        } 
    }    
}

//var skipButton = $("#hangout-giLkojRpuK");
		//continue button
//const continueButton = document.querySelector('continue');
//continueButton.disabled = true; //initially the button should be disabled

function preparePassphrase(str, level){
    var return_passphrase;
    if(level == 1){             //use all 15 terms for fine level
        return_passphrase = str;//passphrase = passphrase.split(' ');
    }
    else if(level == 2){         
        var terms = str.split(' ');
        //passphrase = terms[0] + ' ' + terms[1] + ' ' + terms[2] + ' ' +  terms[3] + ' ' + terms[4] + ' ' + terms[5] + ' ' +  terms[6] + ' ' + terms[7] + ' ' + terms[8]; 
        return_passphrase = terms[0];
        for (let i = 1; i < 10; i++){ return_passphrase = return_passphrase + ' ' + terms[i]; } //get the first 10 terms for medium level
    }
    else if(level == 3){  //get the first 5 terms for coarse level
        var terms = str.split(' ');
        return_passphrase = terms[0];
        for (let i = 1; i < 5; i++){ return_passphrase = return_passphrase + ' ' + terms[i];  }                 
    }
    return_passphrase = return_passphrase.trim();  //making sure preceding and trailing spaces are removed
    console.log("Passphrase for encryption/decryption level : " + level + " = (" + return_passphrase + ")");
    return return_passphrase;
}

// main function to zip the map and encrypt implements three-level volume encryption
async function zipEncrypt(maskedData_string, maskedMedData_string){ 
    var startTime = new Date();
    console.log("Level Zipped and Encryption: ");
    var originalmap_jsonString = JSON.stringify(sensitive.data, circularReplacer());
    
    global_originalmap_jsonString = originalmap_jsonString;
    //for the below functions, currently we are using the same passphrase - from textbox in the form. This will change

    //Volume encryption
    // LEVEL 1. = fine-level = innermost level zip made first. if its level 1, add these files and send zip for encryption and then it will be used as as part of the next zip file
    console.log('Level 1 begins');
    var zipLevel1 = new JSZip();
    zipLevel1.file("original.geojson", originalmap_jsonString);  //add original map file to zip file
    zipLevel1.file("Metadata.txt", //above has values here
            "Masking parameters of Level 2 \nRandDist: " + randDist + "\nRandAngle: " + randAngle +
            "\nNote this level contains the fine level (original map) - no masked map " +
            "\n(but contains the masking parameters of the medium map - which is masked first, from one level outside ");
    zipLevel1.file("folder/placeholderfile.txt", "placeholderfile in folder");
    
    //The zip file is now ready in a blob format. Need to encrypt and save it. encrypt this zip file again before saving
    //we have to encrypt it using certain number of terms in passphrases
    var encryptedZipFileData_Level1, encryptedZipFileData_Level2, encryptedZipFileData_Level3;
    
    try { 
        encryptedZipFileData_Level1 = await firstFunction2(zipLevel1, 1); // Await for the first function to complete
    }
    catch (error) { console.error(error); }  
    
    // Level 2. Medium-level zip should contain the medium level map, metadata and encrypted zip of fine-level (level 1)  - then zip it and then encrypt
    // parameters .... masking distance, angle
    console.log('Level 2 begins');
    var zipLevel2 = new JSZip();    
    zipLevel2.file("fine_level.enc", encryptedZipFileData_Level1);   //add the encrypted fine-level zip containing the map and metadata 
    zipLevel2.file("mediumMap_maskedOnceUsingOneOffset.map", maskedData_string);      //map is masked using one offset      
    zipLevel2.file("Metadata.txt",
            "Masking parameters of Level 3 (Coarse) \nRandDistCoarse: " + randDistMed + "\nRandAngleCoarse: " + randAngleMed +    //ignore the `Med' in variable names - will change        
            + "\nNote this level contains the medium level map - which is masked once. The masking parameters is in one level inside, i.e. the fine level) "
            );
   
    try {
         encryptedZipFileData_Level2 = await firstFunction2(zipLevel2, 2); //second parameter is the level 
    }
    catch (error) { console.error(error);  } 

    console.log('Level 3 begins');
    // 3. Coarse-level zip contains the coarse level map, metadata and encrypted zip of medium-level - then zip the resultant file and encrypt it
    var zipLevel3 = new JSZip();
    //add the encrypted fine level zip containing the data/map and metadata 
    zipLevel3.file("medium_level.enc", encryptedZipFileData_Level2);   //add the encrypted medium-level zip containing the map and metadata 
    zipLevel3.file("coarseMap_maskedUsingTwoOffsets.map", maskedMedData_string);  //map is masked using two offsets
    zipLevel3.file("metadata.txt",             
                + "\nNo Masking parameters here. "
                + "\nNote this level contains the masked map of medium level (of which the masking parameters is in one level inside "
                + "Thus no masking parameters at this level): " );                        //add medium level data/map
    //encrypt this zip file again before saving. Note, we have to encrypt it using certain number of terms in passphrases
    
    //create a zip file of the coarse data and encrypt it. At this level, the encrypted file will be automatically saved. See code inside fn.
    try {
        encryptedZipFileData_Level3 = await firstFunction2(zipLevel3, 3);
    }
    catch (error) { console.error(error); }

    endTime = new Date();
    executionTime = ((endTime - startTime) / 1000);
    console.log("Three levels of encryption complete. Exceution Time: " + executionTime);
}

// This function takes the zip file object, generates a blob out of it, encrypts it and return its 
// syntax based on ``doJob'' example from  https://techbrij.com/javascript-async-await-parallel-sequence
async function firstFunction2(zipFile, level) {
    return new Promise((resolve, reject)  => {
            console.log('Processing start.')             
            var encryptedZipFile, encryptedZipFileData;
            var downloadFile = false;
            if(level == 3) downloadFile = true;
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
                        encryptedZipFile = encryptData2(false, fileReader.result, downloadFile, level);  //data passed is in arraybuffer format, but later should now be converted to blob again
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

//recursive unzip, decrypt and verify. keep on decrypting the encrypted file until we reach the level required by the user. Note encrypted file would be of a zip 
//level 3 = coarse, level 2 = medium, level 1 = fine. Fine indside medium which would be inside coarse
async function recursiveDecrypt(v_objFile, levelToDecrypt, currentLevel){ // when this function is called at first the value for `currentLevel' should be 1, then when called recursively it increases
    console.log("Decryption levelToDecrypt "+  levelToDecrypt + " currentLevel " + currentLevel);    
    
    //get content from file object. The `big encrypted zip file'
    var cipherbytes=await readfile(v_objFile)
    .catch(function(err){
        console.error(err);
    }); 
    
    var encrypted_maskedData=new Uint8Array(cipherbytes);
    console.log("Original encrypted_maskedData: " + encrypted_maskedData);  //get file data 
    //console.log("Console: Uploaded encrypted masked data for decryption: " + convertStringToArrayBuffer(encrypted_maskedData));
    
    var jsonString = JSON.stringify(encrypted_maskedData, circularReplacer());
    console.log(jsonString);
    
    var downloadFile = false;
    if (currentLevel == levelToDecrypt)
        downloadFile = true;

    //1. Compute and Verify hash of `big encrypted zip file'. First would come the Coarse level     
    //(a) Compute Hash values for the bigfile - coarse level. Once computed, this will be used in the verification screen
    //First and we want to verify the encrypted file.
    console.log("Computing Hash for verification:");
    //let encryptedmasked_data_hash_value = await digestMessageHex(jsonString); //originalData_string);
    //console.log("encryptedmasked_data_hash_value: " + encryptedmasked_data_hash_value);
    //let masked_data_hash_value = await digestMessageHex(maskedData_string);
    //console.log("masked_data_hash_value: " + masked_data_hash_value);
    //hash_value = encryptedmasked_data_hash_value; //set the global variable   

    //first decrypt the file data of the `big encrypted zip file'. Remember we would be passed with a file with a '.enc' extension
    //(b) Decrypt. We need to decrypt this coarse level first and store it in a variable ..02-08-2021
    //coarse level decryption
    console.log("Decrypting Now:");
    let decrypted_file_data = await decryptData(encrypted_maskedData, currentLevel, downloadFile); //will automatically use the 'objFile' global variable
    //let original_file_hash_value = await digestMessageHex(decrypted_file_data);
    //console.log("original_file_hash_value: " + original_file_hash_value);
    
    //console.log("decrypted_file_data: " + decrypted_file_data); 

    //`big encrypted zip file' is encrypted. So here we Decrypt it into file content into fileobject so we can iterate over each file
    var file = new File([decrypted_file_data], "decrypted.txt", {
        type: "text/plain",
    });
    v_objFile = file; //assign to variable used below
       
    //save decrypted file (in zipped form) to see the details in the file at this point
    //saveAs(v_objFile, "decryptedVolume_"+currentLevel+".zip");
    
    //From the decrypted zip file object, we unzip each file 
    console.log("Unzipping now: "); 
    var jsZip = new JSZip();
    var fileNum =0;
    jsZip.loadAsync(v_objFile).then(function (zip) {
        Object.keys(zip.files).forEach(function (filename){
                //now we iterate over each zipped file 
                zip.files[filename].async('string').then(function (fileData){
                    console.log("\t filename: " + filename);                             
                        //if we found the map file and this is the level of which we want to show/decrypt the volume                
                    if (filename.endsWith('.geojson') == true){ //&& currentLevel == levelToDecrypt){
                        console.log("\t file to decrypt: " + filename); // decrypt the file here //projFileName = i;                        
                        //we decrypt the encrypted volume at that level, display and allow user to save the decrypted file
                        
                        console.log("\t For verification. We can display the map here");                            
                        //create a file out of the `decrypted_file_data' variable
                        
                        //savezipfile(fileData, filename); //if we want to save..this works
                        console.log("\t FineNum:" + fileNum + " FileData now: " + fileData) // These are your file contents      
                    }
                    //contents of the metadata txt file
                    if (filename.endsWith('.txt') == true){
                        //console.log("\t txtfile contents: " + filename); 
                    }
                    //we look for the encrypted volume. It has an `.enc' file extension. 
                    //keep going one level down for decrypt if this is not the right level of decryption 
                    else if (filename.endsWith('.enc') == true && currentLevel != levelToDecrypt) //havent reaced the required level, we keep on decrypting
                    {
                        currentLevel = currentLevel - 1; // decrement the current level
                        //decrypt ... https://stackoverflow.com/questions/65491311/extracted-files-from-zip-using-jszip-return-plain-text-files
                        zip.file(filename).async('blob').then( (blob) => {                            
                            //call the recursive decryption 
                            recursiveDecrypt(blob, levelToDecrypt,currentLevel); 
                        });                        
                    }
                })           
        })
    })

}

//This is the main encryption caller function. This function call the encryption procedure
//Parameters: the 'file_contents' can be the zipped map file or a document
async function encryptData2(isDocument, file_contents, downloadFile, level) {
    //if document or map we read the file content
    var plaintextbytes = new Uint8Array(file_contents);
    console.log("isDocument plaintextbytes:" + plaintextbytes );
        
    //#### main idea is to save it this way first
    //saveAs(zip_file_contents, "example.zip");

    //get passphrase
    var mainPassphrase = document.getElementById("passphraseOutput").value;
    console.log("Main passphrase: " + mainPassphrase);

    var passphrase = preparePassphrase(mainPassphrase, level);  //prepare/reduce passphrase for the different levels
    console.log("Passphrase to use for decryption: " + passphrase);
    //
    var pbkdf2iterations=10000;
    var passphrasebytes=new TextEncoder("utf-8").encode(passphrase);
    console.log('passphrasebytes' + passphrasebytes);
    var pbkdf2salt=window.crypto.getRandomValues(new Uint8Array(8));
    console.log('pbkdf2salt' + pbkdf2salt);

    var passphrasekey=await window.crypto.subtle.importKey('raw', passphrasebytes, {name: 'PBKDF2'}, false, ['deriveBits'])
        .catch(function(err){
            console.error(err);
        });
    console.log('passphrasekey imported');

    var pbkdf2bytes=await window.crypto.subtle.deriveBits({"name": 'PBKDF2', "salt": pbkdf2salt, "iterations": pbkdf2iterations, "hash": 'SHA-256'}, passphrasekey, 384)
        .catch(function(err){
            console.error(err);
        });
    console.log('pbkdf2bytes derived');
    pbkdf2bytes=new Uint8Array(pbkdf2bytes);

    keybytes=pbkdf2bytes.slice(0,32);
    ivbytes=pbkdf2bytes.slice(32);

    var key=await window.crypto.subtle.importKey('raw', keybytes, {name: 'AES-CBC', length: 256}, false, ['encrypt'])
        .catch(function(err){
            console.error(err);
        });
    console.log('key imported');

    var cipherbytes=await window.crypto.subtle.encrypt({name: "AES-CBC", iv: ivbytes}, key, plaintextbytes)
        .catch(function(err){
            console.error(err);
        });

    if(!cipherbytes) {
        console.error("Error encrypting file.  See console log.");
    }

    cipherbytes=new Uint8Array(cipherbytes);

    //cipherbytes=new Uint8Array(cipherbytes);
    var resultbytes=new Uint8Array(cipherbytes.length+16)
    resultbytes.set(new TextEncoder("utf-8").encode('Salted__'));
    resultbytes.set(pbkdf2salt, 8);
    resultbytes.set(cipherbytes, 16);
    
    //do we need this line of code below?
    var blob=new Blob([resultbytes], {type: 'application/download'}); //resultbytes instead of plaintext    
    
    //we only download/display link when the level is right
    if(downloadFile){
        //save the blob file
        //https://github.com/eligrey/FileSaver.js/issues/357
        //var fileData2 = JSON.stringify(resultbytes, undefined, 4); // first use JSON.stringify 
        var blob2 = new Blob([resultbytes],{type: 'text/plain'} ); // save as Blob 
        
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
    return Promise.resolve(resultbytes);
}

//17-10-2021. lets try a new function
///https://stackoverflow.com/questions/21761453/create-sha-256-hash-from-a-blob-file-in-javascript
async function getHash(algorithm, data) { 
    //console.log("inside getHash() function");
    const main = async (msgUint8) => { // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
      const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    }

    //check if data is blob, processes and returns
    if (data instanceof Blob) {
      //console.log("data instanceof Blob");
      const arrayBuffer = await data.arrayBuffer()
      const msgUint8 = new Uint8Array(arrayBuffer)
      return await main(msgUint8)
    }
    const encoder = new TextEncoder()
    const msgUint8 = encoder.encode(data)
    return await main(msgUint8)
  } 

// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
// is also on msdn
function readfile(file){
    return new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result )
        };
        fr.readAsArrayBuffer(file);
    });
}

function parseZipFile(zipFile) {
    console.log('Parsing zip file ' + zipFile.name + ' ...');
    console.log(' -> data ' + zipFile.data);

    JSZip.loadAsync(zipFile).then(function (zip) {
        Object.keys(zip.files).forEach(function (filename) {
            zip.files[filename].async('string').then(function (fileData) {
                console.log(fileData) // These are your file contents
            })
        })
    })
}

// This function is not used for opening files all the time. It is only used in the case when user is trying on directly encrypt 
// i.e. line 186 in index.html <p><strong>Optional: Encrypt file directly</strong> without masking.
// It is also used for decryption
var openFile = function(event) {
    console.log("hello a");
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
        var arrayBuffer = reader.result;
        console.log(arrayBuffer.byteLength);
    };    
    objFile = input.files[0];

    //file validation for the verification flow (2). Parameter is needed as ....why??? $$$$ 
    console.log("File Validation (2)");
    fileValidation(2); 
};

// Main function used to decrypt files 
async function decryptData(encryptedBytes, level, download){
    console.log("Decryption");
    //Can also read the File directly. Its in another function now
    
    if(isDocument){
        console.log("File to decrypt is a Document, not a map");
    }
    else if (!isDocument) {
        console.log("File to decrypt is a map, not a document");
    }

    var cipherbytes = encryptedBytes; //

    //get passphrase
    var mainPassphrase = document.getElementById("txtDecpassphrase").value;
    console.log("Main passphrase: " + mainPassphrase);

    var passphrase = preparePassphrase(mainPassphrase, level);  //prepare/reduce passphrase for the different levels
    console.log("Chosen passphrase: " + passphrase);

    var pbkdf2iterations=10000;
    var passphrasebytes=new TextEncoder("utf-8").encode(passphrase);
    var pbkdf2salt=cipherbytes.slice(8,16);

    var passphrasekey=await window.crypto.subtle.importKey('raw', passphrasebytes, {name: 'PBKDF2'}, false, ['deriveBits'])
        .catch(function(err){
            console.error(err);

        });
    console.log('passphrasekey imported');

    var pbkdf2bytes=await window.crypto.subtle.deriveBits({"name": 'PBKDF2', "salt": pbkdf2salt, "iterations": pbkdf2iterations, "hash": 'SHA-256'}, passphrasekey, 384)
        .catch(function(err){
            console.error(err);
        });
    console.log('pbkdf2bytes derived');
    pbkdf2bytes=new Uint8Array(pbkdf2bytes);

    keybytes=pbkdf2bytes.slice(0,32);
    ivbytes=pbkdf2bytes.slice(32);
    cipherbytes=cipherbytes.slice(16);

    var key=await window.crypto.subtle.importKey('raw', keybytes, {name: 'AES-CBC', length: 256}, false, ['decrypt'])
        .catch(function(err){
            console.error(err);
        });
    console.log('key imported');


    var plaintextbytes=await window.crypto.subtle.decrypt({name: "AES-CBC", iv: ivbytes}, key, cipherbytes)
        .catch(function(err){
            console.error(err);
        });

    if(!plaintextbytes) {
        console.log("Error during Decryption");
    }
        
    if(download) { //we only download/display link at the right level
        //save the blob file https://github.com/eligrey/FileSaver.js/issues/357        
        var blob = new Blob([plaintextbytes],{type: 'text/plain'} ); // save as Blob 
        var fileName2 = fileName + "_level"+ level +".zip";
        saveAs(blob, fileName2); 
        console.log('Decrypted file Level'+ level + 'saved, filename: ' + fileName2)  
    }
    return plaintextbytes;
}

function saveStaticDataToFile(ha, filename) {
    var blob = new Blob([ha],
        { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
}

//used to display hash 
function display_hash() {
    console.log("displaying hash: " + hash_value); 
    hashOutput.textContent = hash_value; 
}

//This function is currently used. It saves one file only - ciphertext
function savezipfile(data,filename) {
    var zip = new JSZip();
    zip.file(filename+".zip", data); //encoded, "Hello World\n"
    console.log("Console: Save zip file " + filename);
    zip.generateAsync({type: "blob"})
        .then(function (content) {
            // see FileSaver.js
            saveAs(content, filename + ".zip");
        });
}

function savezipfilecontent(data,filename) {
    var blob = new Blob(data, {type: "application/zip"}); 
    saveAs(blob, filename + ".zip");
}

function convertStringToArrayBuffer(str) {
    var encoder = new TextEncoder("utf-8");
    return encoder.encode(str);
}
function convertArrayBuffertoString(buffer) {
    var decoder = new TextDecoder("utf-8");
    return decoder.decode(buffer);
}

const circularReplacer = () => {
    // Creating new WeakSet to keep
    // track of previously seen objects
    const seen = new WeakSet();

    return (key, value) => {
        // If type of value is an
        // object or value is null
        if (typeof(value) === "object"
            && value !== null) {

            // If it has been seen before
            if (seen.has(value)) {
                return;
            }
            // Add current value to the set
            seen.add(value);
        }

        // return the value
        return value;
    };
};

function str2bytes (str) {
   var bytes = new Uint8Array(str.length);
   for (var i=0; i<str.length; i++) {
      bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}

function saveToZip (filename, urls) {
    console.log('Inside saveToZip fn()');      
    const zip = new JSZip()
    //const folder = zip.folder('project')
    urls.forEach((url)=> {
        const blobPromise = fetch(url).then(r => {
            if (r.status === 200) return r.blob()
            return Promise.reject(new Error(r.statusText))
        })
        const name = url.substring(url.lastIndexOf('/'))
        zip.file(name, blobPromise) //folder.file(name, blobPromise)
    })

    //lets first download... works fine..do not change a bit
    //zip.generateAsync({type:"blob"}).then(blob => saveAs(blob, filename))
    //   .catch(e => console.log(e));
        
    console.log('Going to send data');     
    zip.generateAsync({type:"blob"}).then(function(content) {       
          var xhr = new XMLHttpRequest();          
          console.log("XHR.Open");
          xhr.open('PUT', 'https://datasovereignty.cloud.edu.au/geoserver/rest/workspaces/geonode/datastores/my_geonode_data/file.shp', true); //all_clusters_kamloops
          xhr.setRequestHeader('Content-Type', 'application/zip');  //;type=geojson   application/json;charset=UTF-8
          //xhr.setRequestHeader('Content-Length', body.length);
          xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      		xhr.setRequestHeader("Authorization", "Basic " + btoa("admin:geoserver"));          
          xhr.onload = function () {              
              console.log('responseText: ' + this.responseText);              
          };
          xhr.send(content); //shpBuffer4); //content); //blob4); //blob 99 shpBuffer4); //content); //shapeFile2); //formData); // shapeFile2) ;// data); //shapeFile2); //body);
          var responseObject2 = xhr.responseText;
          console.log('responseObject' + responseObject2); // ------- Test status of upload        
    });    
}

function status(res) {
    if (!res.ok) {
        return Promise.reject()
    }
    return res;
}

//26-jan-2022 
function postGeoJSON(){
		console.log("Uploading geonode layer");	
   
    //lets try using the library
    var sendDoc = true;
    
    if(sendDoc)
    {    
        //document 
        /*
        var geoJSON = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [102.0, 0.5]
                },
                "properties": {
                  "prop0": "value0"
                }
              },
              {
                "type": "Feature",
                "geometry": {
                  "type": "LineString",
                  "coordinates": [
                    [102.0, 0.0],
                    [103.0, 1.0],
                    [104.0, 0.0],
                    [105.0, 1.0]
                  ]
                },
                "properties": {
                  "prop0": "value0",
                  "prop1": 0.0
                }
              },
              {
                "type": "Feature",
                "geometry": {
                  "type": "Polygon",
                  "coordinates": [
                    [
                      [100.0, 0.0],
                      [101.0, 0.0],
                      [101.0, 1.0],
                      [100.0, 1.0],
                      [100.0, 0.0]
                    ]
                  ]
          
                },
                "properties": {
                  "prop0": "value0",
                  "prop1": {
                    "this": "that"
                  }
                }
              }
            ]
          }
      */
      
      console.log("Now Trying to upload Layer")   
      upload_layer(masked.reprojected, "sample.geojson", csrftoken)   //'masked.reprojected' is the masked dataset //geoJSON
        
    }        
}	

//weupload the masked layer as a geonode layer
function upload_layer(geoJSON, filename = "sample.geojson", csrftoken) {
  var headers = new Headers();
  headers.set('X-CSRFToken', csrftoken);

  var formData = new FormData()
  formData.set("time", false)

  var fileStringArray = [JSON.stringify(geoJSON)];
  var blobAttrs = {
    type: "application/octet-stream"
  };
  var file = new File(fileStringArray, filename, blobAttrs);
  formData.set("base_file", file)
  formData.set("geojson_file", file)
  formData.set("permissions", '{"users":{"AnonymousUser":["view_resourcebase","download_resourcebase"]},"groups":{}}')
  formData.set("charset", "UTF-8")

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
      // Get layer ID
      var name = data.url.split(":").pop()
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
      upload_document(layer_id, csrftoken)
    } else {
      // It doesn't exist yet, wait 1 second, then check again
      setTimeout(function() {
        check_layer(name)
      }, 1000)
    }
  })
}

//upload the 'global_finalEncryptedZipFile' (the final encrypted zip file resulting from the three volume encryption) as a Geonode document
//we can't upload it as a layer because Geoserver only accepts files with spatial content - and the encrypted file canot be read of ts contents.
function upload_document(layer_id) {
  
  var formData = new FormData()
  formData.set("csrfmiddlewaretoken", csrftoken)
  
  if (csrftoken === undefined)
     console.error('csrftoken undefined');
  
  //var filename = finalFilename;  //"test2.txt"
  formData.set("title", finalFilename); //using global variable //filename) 
  formData.set("links", layer_id)
  console.log(`Linking to ${layer_id}`)

  /*
  var fileStringArray = ["It works!"];
  var blobAttrs = {
    type: "text/plain"
  }; */
  
  //var file = new File(fileStringArray, filename, blobAttrs);
  formData.set("doc_file", global_finalEncryptedZipFile) //file) //upload the 'global_finalEncryptedZipFile' (the final encrypted zip file resulting from the three volume encryption)
  formData.set("doc_url", "")
  formData.set("permissions", '{"users":{"AnonymousUser":["view_resourcebase","download_resourcebase"]},"groups":{}}')

  var result = fetch("/documents/upload/", {
    "credentials": "include",
    "body": formData,
    "method": "POST",
    "mode": "cors"
  }).then(function(result) {
    console.log('New document uploaded, its URL is ' + result.url)
  })
  
  if (result.status == 200) {
    	console.log('New document uploaded, its URL is ' + result.url)
    } else {
      console.error('error uploading: ' + result)
    }
  
}


//https://github.com/iCarto/utentes-api/blob/f984a377f5460e5a9e710e204e22d2c518278a2b/utentes/static/views/search/ButtonExportSHPView.js

function dataURItoBlob(dataURI) {
        // https://stackoverflow.com/a/12300351/930271
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(",")[1]);

        // separate out the mime component
        var mimeString = dataURI
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        var ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});
        return blob;
    }



