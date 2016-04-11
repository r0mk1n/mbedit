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
        var self = this;

        // create sidebar
        this.$el.append( _.template( this.templates.categories_list ) );
        this.$categoriesList = $('.categories-list');

        // create category modal window
        $('body').append( _.template( this.templates.category_edit_modal ) );
        this.$editModal = $('#CategoryModal');

        // create categories model
        this.Categories = new CategoriesCollection();
        this.listenTo( this.Categories, 'sync', this.render );
        //this.listenTo( this.Categories, 'all', function( data ) {
        //    console.log(data);
        //} );

        $(document).on('click', '#categorySaveBtn', function() {
            self.saveCategory();
        });

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

    /**
     * Edit category click handler
     * @param event
     */
    onEditCategoryClick: function( event ) {
        var category_id = $( event.currentTarget ).closest('li').data('category-id');


        var category = this.Categories.get( category_id );
        if ( category ) {

            $('#category-id').val( category.attributes._id );
            $('#category-alias').val( category.attributes.alias );
            $('#category-name').val( category.attributes.name );
            $('#category-order_id').val( category.attributes.order_id );

            $('#categoryModalLabel').html( 'Edit category' );

            this.$editModal.modal('show');
        } else {
            // show error
        }
    },

    /**
     * Delete category click handler
     * @param event
     */
    onDeleteCategoryClick: function( event ) {
        var self = this;
        var category_id = $( event.currentTarget ).closest('li').data('category-id');

        if ( confirm( 'Do you really want to delete this category' ) ) {
            // remove from collection
            this.Categories.get( category_id ).destroy( {
                success: function( model, response, options ) {
                    self.Categories.fetch();
                },
                error: function( model, xhr, options ) {
                }
            } );
        }
    },

    /**
     * Add category click handler
     * @param event
     */
    onAddCategoryClick: function( event ) {
        $('#category-id').val( '' );
        $('#category-alias').val( '' );
        $('#category-name').val( '' );
        $('#category-order_id').val( '' );

        $('#categoryModalLabel').html( 'Adding new category' );

        this.$editModal.modal('show');
    },

    /**
     * Save category handler
     * processing for add and edit
     */
    saveCategory: function() {
        var self = this,
            result = null;

        var data = {
            alias       : $('#category-alias').val(),
            name        : $('#category-name').val(),
            order_id    : $('#category-order_id').val()
        };
        if ( $('#category-id').val() ) {
            data._id = $('#category-id').val();
            var category = this.Categories.get( data._id );
            category.set( data );
            result = category.save();
        } else {
            result = this.Categories.add( data ).save();
        }

        if ( result ) {
            self.$editModal.modal('hide');
            self.Categories.fetch();
        }
    },

    /**
     * Event handlers
     */
    events: {
        'click a.btn-edit-category'     : 'onEditCategoryClick',
        'click a.btn-delete-category'   : 'onDeleteCategoryClick',
        'click a.btn-add-category'      : 'onAddCategoryClick'
    },

    /**
     * Templates for categories view
     */
    templates: {
        // categiries list
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

        // category item
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

        // category modal for add/edit
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
                            '<button type="button" class="btn btn-primary" id="categorySaveBtn">Save changes</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        ''
    }
});