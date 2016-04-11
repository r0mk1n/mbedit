/**
 * Created by r0mk1n on 02-Apr-16.
 */

var Category = Backbone.Model.extend({
    defaults: {
        'alias'     :  '',
        'name'      :  '',
        'order_id'  :  0
    },

    idAttribute     : '_id',

    //url             : '/categories'
});