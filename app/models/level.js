/**
 * Model for level
 */

'use strict';

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

// schema for categories table
var LevelSchema = new Schema({
    data        : String,
    category_id : Number,
    order_id    : Number
});

module.exports = mongoose.model( 'Level', LevelSchema );
