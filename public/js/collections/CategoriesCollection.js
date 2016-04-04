/**
 * Categories collection
 */

var CategoriesCollection = Backbone.Collection.extend({
    model   : Category,
    url     : '/categories'

});
