const merge = require('easy-pdf-merge');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = {

    execute: execute,

}

function execute(filepath) {

    return new Promise(function(resolve, reject) {
        fs.readdir(filepath, function(err, items) {

        

            items.forEach(item => {
                try {
                    combineDocuments(filepath, item);
                } catch (error) {
                    console.log(error)
                }
            })
        })

        resolve("Completed");

    })

}


function combineDocuments(filepath, item) {

    stats = fs.statSync(filepath + "\\" + item);
    if(stats.isDirectory() && item != "node_modules") {

        combineFilesIntoList(filepath + "\\" + item)
        .then(result => {
            dirPath = filepath + "\\" + item;
            outputDirPath = dirPath + "\\combined";

            mkdirp(outputDirPath)
            .then(res => {
                output = res + "\\" + item + ".pdf";
                merge(result, output, function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("done");
                    }
                })
                
            })
        })
        .catch(err => console.log(err));
    }

}



function combineFilesIntoList(dir_path) {

    return new Promise(function (resolve, reject) {
        fs.readdir(dir_path, function(err, items) {
            var filesInPath = ["temp", "temp"];

            items.forEach(item => {
                parsedFileName = item.split(' ');

                // Figure out the type of file
                type = fileType(item);

                if(parsedFileName[1].toLowerCase() == "invoice.pdf") {
                    filesInPath[0] = dir_path + "\\" + item;
                } else {
                    filesInPath[1] = dir_path + "\\" + item;
                }

                if(err) {
                    reject(err);
                } else {
                    resolve(filesInPath);
                }
            })
        })
    })

}


function fileType(filename) {
    nameSplitFromType = filename.split('.');
    return (nameSplitFromType.length > 1 ? nameSplitFromType[1].toLowerCase() : "none");
}
