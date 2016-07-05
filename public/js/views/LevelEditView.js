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

    selected_palette_class  : 'selected',

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

    $levelCursorPosition    : null,
    $canvas                 : null,
    ctx                     : null,

    cw                      : 0,
    ch                      : 0,

    cellXSize               : 0,
    cellYSize               : 0,

    selected_color          : 0,

    /**
     * Override from Backbone.View
     */
    initialize: function( options ){
        this.app = options.app;

        var self = this;

        // create modal
        this.$el.append( _.template( this.templates.modal ) );
        this.$levelModal = $('#LevelModal');

        this.$levelModalTitle = $('#levelModalLabel');

        var $palette_placehodler = $('#palette-placeholder');
        for ( var i = 0; i < 10; i++ ) {
            $palette_placehodler.append( _.template( this.templates.palette_btn )( {index: i} ) );
        }

        this.$levelCursorPosition = $('#level-cursor-position');

        this.$canvas = $('#level-data');
        this.ctx = this.$canvas[0].getContext("2d");

        this.cw = this.ctx.canvas.width;
        this.ch = this.ctx.canvas.height;

        this.cellXSize = this.cw / 10;
        this.cellYSize = this.ch / 10;

        $('.color-item').on( 'click', function( event ) {
            self.__selectColor( $(this).attr('data-color-id') );
        });

        // add event listeners
        this.$canvas.on( 'mousemove', function( event ) {
            self.__updateCursorPosition( event.offsetX, event.offsetY );
        });

        this.$canvas.on( 'click', function( event ) {

        });

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

        this.__selectColor(0);

        this.$levelModal.modal('show');
    },

    /**
     * Hide level editor
     */
    hide: function() {

    },

    // private /////////////////////////////////////////////////////////////////////////////////////////////////////////

    __selectColor: function( color_index ) {
        this.selected_color = color_index;
        $('.color-item').removeClass( this.selected_palette_class );
        $('#palette-item-' + this.selected_color).addClass( this.selected_palette_class );
    },

    __updateCursorPosition: function( x, y ) {
        this.$levelCursorPosition.html( '[ ' + this.__pad( Math.round( x / this.cellXSize ) ) + ' - ' + this.__pad( Math.round( y / this.cellYSize ) ) + ' ]' );
    },


    __pad: function( n ) {
        return (n < 10) ? ("0" + n) : n;
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
                            '<div class="col-md-11">' +
                                '<div class="level-toolbar"></div>'+
                                '<div class="level-placeholder"  id="level-placeholder" >' +
                                    '<canvas id="level-data" class="effect7" width="400" height="400"></canvas>' +
                                    '<h5 id="level-cursor-position">[ 00 - 00 ]</h5>' +
                                '</div>' +
                            '</div>'+
                            '<div class="col-md-1" id="palette-placeholder"></div>'+
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
            '<a id="palette-item-<%= index %>" class="color-item color-<%= index %> " data-color-id="<%= index %>"></a>' +
        ''
    }
});
