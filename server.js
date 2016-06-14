// Full Stack JS 'Image Searcher' App
// server.js

// load env vars for google search API
require( 'dotenv' ).config( )
var gKey = process.env.GOOGLEKEY
var gID  = process.env.GOOGLEID
var portNum = process.env.PORT

var googleImages = require( 'google-images' )
var express = require( 'express' )
var path = require( 'path' )
var app = express( )

app.use( express.static( path.resolve( __dirname, 'client' ) ) )

app.get( '/', function( req, res ) {
  res.render( 'index.html' )
} )

app.get( '/api/imagesearch/:keywords', function( req, res ) {
  res.writeHead( 200, { "Content-Type" : "application/json" } )
  
  var json = JSON.stringify(
    "Here is a JSON response, " + req.params.keywords + "!"
    )
    
  res.end(json)
  
} )

app.listen( portNum, function( ) {
  console.log( "Listening at " + portNum )
} )
