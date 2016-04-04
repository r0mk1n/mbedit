/**
 * Routes for levels
 */

'use strict';

module.exports = function( app, express ) {
    var _ = require('lodash');
    var router = express.Router();
    var config = require('../../config/config');

    // level model
    var Level = require('../models/level');

    router.route( '/' )
        // create level
        .post( function( req, res ) {

        })
        // update level
        .put( function( req, res ) {

        });

    // processing get request wih level ID
    router.route( '/:id' )
        .all( function( req, res, next ) {
            var level_id = req.params.level_id;

            if ( level_id ) {
                req.level_id = level_id;
                next();
            } else {
                res.status( 403 ).json( { message: 'Level ID must be specified' } );
            }
        })
        // get level with specified ID
        .get( function ( req, res ) {
            Level.find( { 'id': req.level_id } )
                .exec( function ( err, level ) {
                    if ( err ) {
                        res.status( 403 ).json( { message: err } );
                        return;
                    }
                    res.status( 200 ).json( level );
                });
        })
        // delete level
        .delete( function( req, res ) {

        });

    return router;
};