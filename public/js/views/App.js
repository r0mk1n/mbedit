'use strict';

/**
 * Main view
 * @type {Object|*|void}
 */
var AppView = Backbone.View.extend({
    initialize: function() {

        //var oldCollectionFetch = Backbone.Collection.prototype.fetch;
        //
        //Backbone.Collection.prototype.fetch = function(options) {
        //    this.trigger("fetch:started");
        //    oldCollectionFetch.call(this, options);
        //};

        this.toolbarView = new ToolbarView({el: this.el});
        this.categoriesView = new CategoriesView({el: this.el});

        this.categoriesView.on( 'Category.SELECT', function( params ) {
            console.log( params );
        });
    }
});