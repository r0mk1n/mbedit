'use strict';

/**
 * Main view
 * @type {Object|*|void}
 */
var AppView = Backbone.View.extend({
    initialize: function() {

        var oldCollectionFetch = Backbone.Collection.prototype.fetch;

        Backbone.Collection.prototype.fetch = function(options) {
            this.trigger("fetch:started");
            oldCollectionFetch.call(this, options);
        };

        this.toolbar = new ToolbarView({el: this.el});
        this.categories = new CategoriesView({el: this.el});
    }
});