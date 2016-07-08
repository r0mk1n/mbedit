/**
 * Model for level
 */

'use strict';

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

// schema for categories table
var LevelSchema = new Schema({
    colors_count    : Number,
    colors_data     : Array,
    category_id     : String,
    order_id        : Number
});

module.exports = mongoose.model( 'Level', LevelSchema );
