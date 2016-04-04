/**
 * Routes for levels
 * only GET route are active for getting list of levels for category
 */

'use strict';

module.exports = function( app, express ) {
    var router = express.Router();

    // level model
    var Level = require('../models/level');

    // error message hook
    router.route( '/' )
        .all( function( req, res, next ) {
            res.status( 403 ).json( { message: 'Category_id must be specified' } );
        });

    // processing get request wih category ID
    router.route( '/:category_id' )
        .all( function( req, res, next ) {
            var category_id = req.params.category_id;

            if ( category_id ) {
                req.category_id = category_id;
                next();
            } else {
                res.status( 403 ).json( { message: 'Category_id must be specified' } );
            }
        })
        // get list of levels
        .get( function ( req, res ) {
            Level.find( { 'category_id': req.category_id } )
                .sort({
                    'order_id': 1
                })
                .exec( function ( err, levels ) {
                    if ( err ) {
                        res.status( 403 ).json( { message: err } );
                        return;
                    }
                    res.status( 200 ).json( levels );
                });
        });

    return router;
};