// Full Stack JS 'Image Searcher' App
// server.js

// load env vars for google search API
require( 'dotenv' ).config( )

var portNum = process.env.PORT
var request = require('request')
var imageSearch = require( 'node-google-image-search' )
var express = require( 'express' )
var path = require( 'path' )
var app = express( )


app.use( express.static( path.resolve( __dirname, 'client' ) ) )

app.get( '/', function( req, res ) {
  res.render( 'index.html' )
} )

app.get( '/api/imagesearch/:keywords', function( req, res ) {
  res.writeHead( 200, { 'Content-Type' : 'application/json' } )
  
  var options = {
    url: 'https://www.googleapis.com/customsearch/' +
        'v1?q=' + req.params.keywords + '&cx=' + process.env.CSE_ID +
        '&lr=lang_en&searchType=image&fields=items' +
        '(image%2FcontextLink%2Clink%2Csnippet%2Ctitle)&key=' + 
        process.env.CSE_API_KEY
  }
  
  function callback ( err, response, body ) {
    if ( err ) {
      console.log( err )
    }
    
    if ( !err && response.statusCode == 200 ) {
      var results = JSON.parse( body )
      res.end( JSON.stringify( results ) )
    }
  }
  
  request ( options, callback )
})

app.listen( portNum, function( ) {
  console.log( 'Listening at ' + portNum )
} )
