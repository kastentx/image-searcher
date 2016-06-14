var express = require('express');
var path = require('path')
var app = express()

app.use(express.static(path.resolve(__dirname, 'client')));

app.listen(process.env.PORT, function(port){
  console.log("Listening at" + port);
});
