
require('dotenv').config()

var googleKey = process.env.GOOGLEKEY
var express = require('express')
var path = require('path')
var app = express()

var portNum = process.env.PORT

app.use(express.static(path.resolve(__dirname, 'client')))

app.get('/', function(req, res) {
    res.render('index.html')
})

app.listen(portNum, function(){
  console.log("Listening at " + portNum)
});
