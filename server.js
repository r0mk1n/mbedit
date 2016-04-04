'use strict';

var express         = require( 'express' );
var bodyParser      = require( 'body-parser' );
var mongoose        = require( 'mongoose' );

var config          = require( './config/config' );

if ( config.is_dev ) {
    var morgan          = require('morgan');
}

// creating express instance
var app = new express();

// use debug only for dev
if ( config.is_dev ) {
    app.use( morgan( 'dev' ) );
}

// establish db connection
mongoose.connect( config.database, function( err ) {
    if ( err ) {
        throw err;
        return;
    }
    console.log( 'Connection to DB has been established' );
});

// adding body parser
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );

// route for static data
app.use( express.static( __dirname + '/public') );
app.get( '/', function( req, res ) {
    res.sendFile( __dirname + '/public/index.html' );
});

// route categories
app.use( '/categories', require( './app/routes/categories' )( app, express ) );

// route levels
app.use( '/levels', require( './app/routes/levels' )( app, express ) );

// route single level
app.use( '/level', require( './app/routes/level' )( app, express ) );

app.listen( config.server_port, function() {
    console.log( 'Server at port %d has running', config.server_port );
});
