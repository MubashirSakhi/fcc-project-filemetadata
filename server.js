'use strict';

var express = require('express');
var cors = require('cors');

// require and use "multer"...
var multer = require("multer");

var app = express();
app.use(multer({ dest: './uploads/' }).any());
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/hello', function (req, res) {
  res.json({ greetings: "Hello, API" });
});
app.post('/api/fileanalyse', function (req, res) {
  let fileList = [];
  if (req.files === undefined) {
    return res.json({ error: "file error" });
  }
  else if(req.files.length <= 0){
    return res.status(400).json({error:"No file uploaded"});
  }
  else {
    for (let i = 0; i < req.files.length; i++) {
      let temp = {};
      temp.name = req.files[i].originalname;
      temp.size = req.files[i].size;
      temp.extension = req.files[i].originalname.split('.').pop();
      fileList.push(temp);
    }
    return res.json({fileList:fileList});
  }
})
app.use(function (err, req, res, next) {
  if (err.params == undefined) {
      err.params = null;
  }
  if (err instanceof Error) {
      console.log(err.message + " " + err.params);

      return res.status(400).json({
          error: {
              'message': err.message,
              params: err.params
          }
      });
  }
  else {
      return res.status(500).json({
          error: {
              'message': err.message,
              params: null
          }
      });
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
