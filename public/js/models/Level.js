var Level = Backbone.Model.extend({
    defaults: {
        category_id     : 0,
        colors_count    : 0,
        colors_data     : [],
        order_id        : 0
    },

    idAttribute     : '_id'
});