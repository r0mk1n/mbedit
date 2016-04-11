/**
 * Routes for categories
 */

'use strict';

module.exports = function( app, express ) {
    var _ = require( 'lodash' );
    var router  = express.Router();
    var config  = require( '../../config/config' );

    // category model
    var Category = require( '../models/category' );

    router.route('/')
        // get list of categories
        .get( function( req, res ) {
            Category.find( {} )
                .sort( {
                    'order_id': 1
                } )
                .exec( function( err, categories ) {
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



    router.route('/:id')
        // get list of categories
        .get( function( req, res ) {
            if ( !req.params.id ) {
                res.status(403).json( { message: 'Category not found' } );
                return;
            }
            Category.findById( req.params.id )
                .exec( function( err, category ) {
                    if ( err ) {
                        res.status(403).json( { message: err } );
                        return;
                    }
                    res.status(200).json( category );
                });
        })
        // delete category
        .delete( function( req, res ) {
            Category.findById( req.params.id, function( err, category ) {
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
                        // @todo: set 0 to all levels with given category_id

                        res.status(200).json( {message: 'Category has been successfully deleted'} );
                    });
                }
            });
        })
        // updating category
        .put( function( req, res ) {
            Category.findById( req.params.id, function( err, category ) {
                if ( err ) {
                    res.status( 403 ).json( { message: 'Category not found' } );
                    return;
                }
                if ( category ) {
                    console.log( req.body );
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
        });

    return router;
};