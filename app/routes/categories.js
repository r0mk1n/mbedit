/**
 * Routes for categories
 */

'use strict';

module.exports = function( app, express ) {
    var _ = require( 'lodash' );
    var router  = express.Router();
    var config  = require( '../../config/config' );

    var Category = require( '../models/category' );

    router.route('/')
        // get list of categories
        .get( function( req, res ) {
            Category.find( {}, function( err, categories ) {
                if ( err ) {
                    res.status(403).json( { message: err } );
                    return;
                }
                res.status(200).json( categories );
            });
        })
        // adding new category
        .post( function( req, res ) {
            var category = new Category({
                name        : req.body.name,
                alias       : req.body.alias,
                order_id    : req.body.order_id ? req.body.order_id : 0
            }).save( function( err ) {
                if ( err ) {
                    res.status(403).json( { message: err } );
                    return;
                }
                res.status(200).json( { message: "New category has been successfully added" } );
            });
        })
        // updating category
        .put( function( req, res ) {
            Category.findById( req.body.id, function( err, category ) {
                if ( err ) {
                    res.status( 403 ).json( { message: 'Category not found' } );
                    return;
                }
                if ( category ) {
                    _.merge( category, req.body );
                    category.save( function( err ) {
                        if ( err ) {
                            res.status( 403 ).json( { message: err } );
                            return;
                        }
                        res.status(200).json( category );
                    })
                } else {
                    res.status( 403 ).json( { message: 'Category not found' } );
                }
            });
        })
        // delete category
        .delete( function( req, res ) {
            Category.findById( req.body.id, function( err, category ) {
                if ( err ) {
                    res.status( 403 ).json( { message: 'Category not found' } );
                    return;
                }
                if ( category ) {
                    category.remove( function( err ) {
                        if ( err ) {
                            res.status(403).json( { message: err } );
                            return;
                        }
                        res.status(200).json( {message: 'Category has been successfully deleted'} );
                    });
                }

            });
        });

    return router;
};