// import swaggerUi from "swagger-ui-express";
// const swaggerUi = require('swagger-ui-express');
// var path = require("path");

// // import YAML from "yamljs";
// const YAML = require('yamljs')
// const swaggerDocument = YAML.load(path.join(__dirname, "/api.yaml"));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');


const {getFileFromS3,uploadFilesToS3,listObjectBucket,listBucket,deleteBucket,uplFile} = require('./controllers')

const multer = require('multer');
var express = require("express");
var fs = require('fs');

var app = express();


try {
    const swaggerDocument = YAML.load(path.join(__dirname, '/api.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (error) {
    console.error('Error loading YAML file:', error);
  }

app.get("/getfile", getFileFromS3);

// app.post("/uploadfile", upload.single('file'),uploadFilesToS3)


app.post("/uploadfile", uplFile);



app.get("/listobject",listObjectBucket)

app.get("/listbucket",listBucket)

app.delete("/deleteobject",deleteBucket)


app.listen(8000)