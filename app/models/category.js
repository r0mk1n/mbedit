/**
 * Model for category
 */

'use strict';

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

// schema for categories table
var CategorySchema = new Schema({
    name        : { type: String, required: true, index: { unique: true } },
    alias       : { type: String, required: true, index: { unique: true } },
    order_id    : Number
});

module.exports = mongoose.model( 'Category', CategorySchema );
