'use strict';

/**
 * Main view / App class
 *
 * @author @r0mk1n
 *
 * @type {Object|*|void}
 */
var AppView = Backbone.View.extend({
    initialize: function() {
        var that = this;

        this.toolbarView = new ToolbarView( { app:this, el: this.el } );
        this.categoriesView = new CategoriesView( { app: this, el: this.el } );

        this.levelsView = new LevelsView({app: this, el:this.el } );

        this.categoriesView.on( 'Category.SELECT', function( params ) {
            that.levelsView.load( params.category_id );
        });
    },

    // global helping stuff ////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Getting category data
     * @param category_id
     * @returns {*}
     */
    getCategoryInfoById: function( category_id ) {
        return this.categoriesView.Categories.get( category_id );
    },

    getCategoriesList: function() {
        return this.categoriesView.Categories.toJSON();
    },


});