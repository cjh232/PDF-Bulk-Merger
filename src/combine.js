const remote = require('electron').remote;
const main = remote.require('./index.js');
const fs = require('fs');
const merge = require('./pdf-merge.js');

var dropzone = document.getElementById('dropzone');
var submit = document.getElementById('submit-button');
var filePathPreview = document.getElementById("file-path-preview");
var folderDetails = document.getElementById("folder-details");
var folder = null;

submit.onclick = function() {
    console.log("clicked");
    if (folder != null) {

        submit.className = "button is-rounded non-hidden is-loading";
        merge.execute(folder.path)
        .then(res => {
            alert("Files combined.")
            resetEnvironment();
            
        })
    }
}

function resetEnvironment() {
    filePathPreview.innerHTML = "";
    submit.className = "button is-rounded hidden";
    folder = null;
    folderDetails.innerHTML = "";

}

// Click file path to open in OS explorer
filePathPreview.onclick = function() {
    require('child_process').exec(`start "" "${folder.path}"`);
}

dropzone.ondragover = function() {
    this.className = 'dropzone dragover';
    return false;
}

dropzone.ondragleave = function() {
    this.className = 'dropzone';
    return false;
}

dropzone.ondrop = function(e) {
    // Prevent the browser from do
    e.preventDefault();
    this.className = 'dropzone';
    


    var itemIsFolder = addFileInformation(e);

    if(itemIsFolder)
        addSubmitButton();
}


// Returns a promise containing an object describing the file's attributes
function getFolder(filepath) {
   return new Promise(function(resolve, reject) {
       fs.readdir(filepath, function(err, items) {
           var info = {
               files: items,
               length: items.length,
               path: filepath
           }

           if(err) {
               reject(err);
           } else {
               resolve(info);
           }
       })
   })

    return info;
  }
  
function addSubmitButton() {

    var btn = document.getElementById("submit-button");
    btn.className = "button is-rounded non-hidden";
}

function addFileInformation(e) {
    // Get the path to the file and aquire the subdirectories
    var filepath = e.dataTransfer.files[0].path;
    var fileStats = fs.statSync(filepath);

    if(!fileStats.isDirectory()) {
        alert("Upload Error: Path must resolve to a folder");
        return false;
    }

    filePathPreview.innerHTML = filepath;
    
    getFolder(filepath)
        .then(res => {
            folder = res;
            folderDetails.innerHTML = `[${folder.length}] items in folder`;
        })
        .catch(err => console.log(err));

    return true;
}