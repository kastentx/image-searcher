// Full Stack JS: Image Search App

require( 'dotenv' ).config( )
var portNum = process.env.PORT
,   request = require( 'request' )
,   express = require( 'express' )
,   path = require( 'path' )
,   app = express( )
,   MongoClient = require( 'mongodb' ).MongoClient
,   assert = require( 'assert' )
,   strftime = require( 'strftime' )
,   dbUrl = process.env.MONGODB_URI

app.use( express.static( path.resolve( __dirname, 'client' ) ) )

app.get( '/', function( req, res ) {
  res.render( 'index.html' )
} )

app.get( '/api/latest/imagesearch', function( req, res ) { 
  // connect to the database (to retrieve search terms)
  MongoClient.connect( dbUrl, function( err, db ) {
    assert.equal( null, err )

    db.collection( 'recent' )
      .find( { }, { '_id' : 0 } )
      .sort( { 'when' : -1 } )
      .limit( 10 )
      .toArray( function( err, docs ) {
        assert.equal( null, err )
        // return list of results as JSON
        res.json( docs )
        return db.close()
      } )
  } )
} )

app.get( '/api/imagesearch/:keywords', function( req, res ) {
  // connect to the database (for storing search terms)
  MongoClient.connect( dbUrl, function( err, db ) {
    assert.equal( null, err )
    // add offset to starting position for our results (if given)
    var startPos = 1
    if ( typeof req.query.offset === 'string' ) {
      startPos += parseInt( req.query.offset )
    }

    // add to list of recent search terms
    db.collection( 'recent' ).insertOne( { term : req.params.keywords, when : strftime( '%F %T' ) }, function ( err, r ) {
      assert.equal( null, err )
      assert.equal( 1, r.insertedCount )
    } )

    // build request options object
    var reqOptions = {
      url: 'https://www.googleapis.com/customsearch/' +
           'v1?q=' + req.params.keywords + '&cx=' + process.env.CSE_ID +
           '&lr=lang_en&searchType=image&fields=items' +
           '(image%2FcontextLink%2Clink%2Csnippet%2Ctitle)&start=' + startPos + 
           '&key=' + process.env.CSE_API_KEY
    }
    // define callback for request function
    function reqCallback ( err, response, body ) {
      if ( err ) {
        console.log( err )
      }
      if ( !err && response.statusCode == 200 ) {
        var results = JSON.parse( body, function( key, value ) {
          if ( key == 'image' ) {
            this.context = value.contextLink
            return
          }
          return value
        } )
        // return list of results as JSON
        res.json( results )
        return db.close()
      }
    }
    // call the request function
    request( reqOptions, reqCallback )
  } )
} )
app.listen( portNum, function( ) {
  console.log( 'Listening at ' + portNum )
} )