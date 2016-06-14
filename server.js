// Full Stack JS 'Image Searcher' App
// server.js

// load env vars for google search API
require( 'dotenv' ).config( )

var portNum = process.env.PORT
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
  
  var results = imageSearch( req.params.keywords, callback, 0, 5  )
  
  function callback( images ) {
    res.end( JSON.stringify( images ) )
  }
})

app.listen( portNum, function( ) {
  console.log( 'Listening at ' + portNum )
} )
