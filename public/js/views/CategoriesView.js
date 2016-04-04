/**
 * Categories view
 * Manage categories list
 */

var CategoriesView = Backbone.View.extend({

    /**
     * Categories list handler
     */
    $categoriesList     : null,

    /**
     * Edit modal handler
     */
    $editModal          : null,

    /**
     * Categories collection
     */
    Categories          : null,

    /**
     * Initialize categories view
     * @param el
     */
    initialize: function() {
        // create sidebar
        this.$el.append( _.template( this.templates.categories_list ) );
        this.$categoriesList = $('.categories-list');

        // create category modal window
        $('body').append( _.template( this.templates.category_edit_modal ) );
        this.$editModal = $('#CategoryModal');

        // create categories model
        this.Categories = new CategoriesCollection();
        this.listenTo( this.Categories, 'sync', this.render );

        // load categories data
        this.Categories.fetch();
    },

    /**
     * Render all categories list
     * @param collection
     * @param data
     */
    render: function( collection, data ) {
        this.$categoriesList.html('');

        if ( data.length ) {
            for ( var i = 0; i < data.length; i++ ) {
                this.$categoriesList.append( this.renderItem( data[i] ) );
            }
        }
    },

    /**
     * Render category item
     * @param item
     */
    renderItem: function( item ) {
        return _.template( this.templates.category_item )( item );
    },

    // private

    onEditCategoryClick: function( event ) {
        var category_id = $( event.currentTarget ).closest('li').data('category-id');
        this.$editModal.modal('show');

        var category = this.Categories.get( category_id );
        if ( category ) {

        }
    },

    onDeleteCategoryClick: function( event ) {
        var category_id = $( event.currentTarget ).closest('li').data('category-id');

    },

    onAddCategoryClick: function( event ) {

    },

    events: {
        'click a.btn-edit-category'     : 'onEditCategoryClick',
        'click a.btn-delete-category'   : 'onDeleteCategoryClick',
        'click a.btn-add-category'      : 'onAddCategoryClick'
    },

    /**
     * Templates for categories view
     */
    templates: {
        categories_list: '' +
            '<div class="side-nav">' +
                '<ul class="nav navbar-nav categories-list">' +
                '</ul>' +
                '<div class="buttons-bar">' +
                    '<div class="btn-group btn-block">' +
                        '<a href="javascript:void(0)" class="btn btn-primary btn-block btn-add-category" >' +
                            '<i class="fa fa-plus"></i>&nbsp;' +
                            'Add Category' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '',

        category_item: '' +
            '<li data-category-id="<%= _id %>">' +
                '<div class="btn-group pull-right">' +
                    '<a class="btn btn-xs btn-primary btn-edit-category"><i class="fa fa-edit"></i></a><br>' +
                    '<a class="btn btn-xs btn-danger btn-delete-category"><i class="fa fa-remove"></i></a>' +
                '</div>' +
                '<div class="nav-body">' +
                    '<h4><%= name %></h4>' +
                    '<%= alias %>' +
                '</div>' +
            '</li>' +
        '',

        category_edit_modal: '' +
            '<div class="modal fade" id="CategoryModal" tabindex="-1" role="dialog" aria-labelledby="categoryModalLabel">' +
                '<div class="modal-dialog" role="document">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                            '<h4 class="modal-title" id="categoryModalLabel">Modal title</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            '<input type="hidden"  id="category-id">' +
                            '<div class="form-group">' +
                                '<label for="category-alias">Alias</label>' +
                                '<input type="text" class="form-control" id="category-alias" placeholder="Alias">' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="category-name">Name</label>' +
                                '<input type="text" class="form-control" id="category-name" placeholder="Name">' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="category-name">Order ID</label>' +
                                '<input type="number" class="form-control" id="category-order_id" value="0" placeholder="Order ID">' +
                            '</div>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                            '<button type="button" class="btn btn-primary">Save changes</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        ''
    }
});