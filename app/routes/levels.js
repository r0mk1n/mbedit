/**
 * Routes for levels
 * only GET route are active for getting list of levels for category
 */

'use strict';

module.exports = function( app, express ) {
    var router = express.Router();

    // level model
    var Level = require('../models/level');

    // processing get request with category ID
    router.route( '/:category_id' )
        // middleware for checking required params
        .all( function( req, res, next ) {
            if ( req.params.category_id ) {
                req.category_id = req.params.category_id;
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