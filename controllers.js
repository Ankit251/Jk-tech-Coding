const {getFileById,uploadFileToS3,listObjectsInBucket,listAllBuckets,deleteObjectFromS3} = require('./service')
const formidable = require('formidable');
var fs = require('fs');
function getFileFromS3(req,res){
    try{
    let {fileName} = req.query;
    var data;
    getFileById(fileName)
        .then(fileContent => {
          console.log()
          console.log('File content:', fileContent);
          res.status(200).send( {data: fileContent} );
        })
        .catch(error => {
          console.error('Error getting file from S3:', error);
        });
  
    
    } catch (err) {
      console.debug(err);
      throw err;
    }
}

function uploadFilesToS3(req,res){
    try {
        console.log(req)
        if (!req.file) {
            return res.status(400).send('No file uploaded');
          }
      
        // const {file} = req.file;

        const fileName2 = req.file.originalname;
        const filePath2 = req.file.path; // Path to the uploaded file

        // console.log(file)
        // const fileName = 'example.txt';
        // const filePath = './example.txt';
        uploadFileToS3(fileName2, filePath2)
            .then(fileUrl => {
                console.log('File uploaded successfully. URL:', fileUrl);
                res.status(200).send({data:fileUrl})
            })
            .catch(error => {
                console.error('Error uploading file:', error);
            });
    } catch (err) {
        console.debug(err);
        throw err;
    }
}

function uplFile(req,res){
    console.log("inside data");
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        console.log(files);
        if (err) {
          return res.status(500).json({ error: 'Internal server error' });
        }
    
        // Access the uploaded file
        const file = files.file;
    
        if (!file) {
          return res.status(400).send('No file uploaded');
        }
        
        // Move the file to a desired location
        const oldPath = file[0].filepath;
        const newPath = __dirname + '/' + file[0].originalFilename;
    
        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to upload file' });
          }
          console.log();
          // Upload the file to S3
          uploadFileToS3(file[0].originalFilename, newPath)
            .then((fileUrl) => {
              console.log('File uploaded successfully. URL:', fileUrl);
              res.status(200).send({ data: fileUrl });
            })
            .catch((error) => {
              console.error('Error uploading file:', error);
              res.status(500).json({ error: 'Error uploading file to S3' });
            });
        });
      });
}

function listObjectBucket(req,res){
    try {
        listObjectsInBucket()
            .then(objects => {
                res.status(200).send(objects);
            })
            .catch(error => {
            console.error('Error listing objects:', error);
            });
    } catch (err) {
        console.debug(err);
        throw err;
    }
}

function listBucket(req,res){
    try {
        listAllBuckets()
            .then(buckets => {
              console.log('Buckets:', buckets);
              res.status(200).send(buckets)
            })
            .catch(error => {
              console.error('Error listing buckets:', error);
            });
    } catch (err) {
        console.debug(err);
        throw err;
    }
}

function deleteBucket(req,res){
    try {
        let file = req.query.file;
        deleteObjectFromS3(file)
            .then(data => {
                console.log('Object deleted successfully:', data);
                res.status(200).send({msg:"Deleted Successfully"})
            })
            .catch(error => {
                console.error('Error deleting object:', error);
            });
    } catch (err) {
        console.debug(err);
        throw err;
    }
}
  
module.exports = {getFileFromS3,uploadFilesToS3,listObjectBucket,listBucket,deleteBucket,uplFile};