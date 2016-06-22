'use strict';

/**
 * Main view
 * @type {Object|*|void}
 */
var AppView = Backbone.View.extend({
    initialize: function() {
        var that = this;

        this.toolbarView = new ToolbarView({el: this.el});
        this.categoriesView = new CategoriesView({el: this.el});

        this.levelsView = new LevelsView({el:this.el});

        this.categoriesView.on( 'Category.SELECT', function( params ) {
            that.levelsView.load( params.category_id );
        });
    }
});