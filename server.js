'use strict';

var express         = require( 'express' );
var bodyParser      = require( 'body-parser' );
var config          = require( './config/config' );
var mongoose        = require( 'mongoose' );

if ( config.is_dev ) {
    var morgan          = require('morgan');
}

// creating express instance
var app = new express();

// use debug only for dev
if ( config.is_dev ) {
    app.use(morgan('dev'));
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
app.use( express.static('./views/public') );

// route categories
var categories = require( './app/routes/categories' )( app, express );
app.use( '/categories', categories );

// route levels
var levels = require( './app/routes/levels' )( app, express );
app.use( '/levels', levels );

app.listen(3000, function() {
    console.log('Server at port 3000 has running');
});
