var Levels = Backbone.Model.extend({
    defaults: {
        'category_id'   : 0,
        'data'          : '',
        'order_id'      : 0
    },

    idAttribute     : '_id',
});