/**
 * Level Edit view
 * @author @r0mk1n
 *
 * @type {void|Object|*}
 */
var LevelEditView = Backbone.View.extend({
    /**
     * App handler
     */
    app                     : null,

    /**
     * Handler for level modal
     */
    $levelModal             : null,

    $levelModalTitle        : null,

    /**
     * Level data
     */
    data                    : null,

    /**
     * Callback handler
     */
    callback                : null,

    /**
     * Override from Backbone.View
     */
    initialize: function( options ){
        this.app = options.app;

        // create modal
        this.$el.append( _.template( this.templates.modal ) );
        this.$levelModal = $('#LevelModal');

        this.$levelModalTitle = $('#levelModalLabel');

        var $palette_placehodler = $('#palette-placeholder');
        for ( var i = 0; i < 10; i++ ) {
            $palette_placehodler.append( _.template( this.templates.palette_btn )( {index: i} ) );
        }
    },

    /**
     * Show level editor
     * @param data
     * @param callback
     */
    show: function( data, callback ) {
        this.data = data;
        this.callback = callback;

        var category_data = this.app.getCategoryInfoById( data.category_id );

        var categoris_list = this.app.getCategoriesList();

        if ( this.data.hasOwnProperty( '_id' ) ) {
            // edit mode
            this.$levelModalTitle.html('Edit level in category' );
        } else {
            // create mode
            this.$levelModalTitle.html('Creating new level in category' );
        }

        this.$levelModalTitle.html( this.$levelModalTitle.html() + '<strong> ' + category_data.attributes.name + '</strong>' );


        this.$levelModal.modal('show');

    },

    /**
     * Hide level editor
     */
    hide: function() {

    },

    // events handlers /////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Events
     */
    events: {
        'click a.color-item': 'onColorChanged'
    },

    templates: {
        modal: '' +
        '<div class="modal fade" id="LevelModal" tabindex="-1" role="dialog" aria-labelledby="levelModalLabel">' +
            '<div class="modal-dialog modal-lg" role="document">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                        '<h4 class="modal-title" id="levelModalLabel">Modal title</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '<div class="row">' +
                            '<div class="col-md-9">' +
                                '<div class="level-toolbar"></div>'+
                                '<div class="level-placeholder"  id="level-placeholder"></div>' +
                            '</div>'+
                            '<div class="col-md-3" id="palette-placeholder"></div>'+
                        '</div>'+
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                        '<button type="button" class="btn btn-primary" id="levelSaveBtn">Save changes</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '',
        palette_btn: '' +
            '<a id="palette-item-<%= index %>" class="btn btn-block btn-default color-item color-<%= index %>" data-ccolor-id="<%= index %>">&nbsp;</a>' +
        ''
    }
});
