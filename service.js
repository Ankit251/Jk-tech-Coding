const AWS = require('aws-sdk')
const fs = require('fs');
const { builtinModules } = require('module');
const s3 = new AWS.S3();


function getFileById(Id){
    console.log(Id)
    const params = {
        Bucket: 'ankit2510',
        Key: Id
      };
      
    
    return new Promise((resolve, reject) => {
              s3.getObject(params, (err, data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(data.Body.toString()); // Convert file content to string
                }
              });
            });   
    
}

function uploadFileToS3(fileName, filePath) {
        
        const fileContent = fs.readFileSync(filePath);
      
        const params = {
          Bucket: 'ankit2510',
          Key: fileName,
          Body: fileContent 
        }
      
        return new Promise((resolve, reject) => {
          s3.upload(params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              const fileUrl = data.Location;
              resolve(fileUrl);
            }
          });
        });
      }

function listObjectsInBucket() {
        const params = {
          Bucket: 'ankit2510'
        };
      
        return new Promise((resolve, reject) => {
          s3.listObjects(params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data.Contents); // Returns an array of objects
            }
          });
        });
      }

      function listAllBuckets() {
            return new Promise((resolve, reject) => {
              s3.listBuckets((err, data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(data.Buckets); // Returns an array of bucket objects
                }
              });
            });
          }
    
    function deleteObjectFromS3(objectKey) {
            const params = {
              Bucket: 'ankit2510',
              Key: objectKey
            };
          
            return new Promise((resolve, reject) => {
              s3.deleteObject(params, (err, data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(data);
                }
              });
            });
          }

module.exports = {getFileById,uploadFileToS3,listObjectsInBucket,listAllBuckets,deleteObjectFromS3};
