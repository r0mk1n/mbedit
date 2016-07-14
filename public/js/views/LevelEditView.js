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

    // grid styles ////////////////////

    // base line
    gridBaseLineWidth       : .3,
    gridBaseLineColor       : "#333",
    gridBaseLineDash        : [1,2],

    gridSectorLineWidth     : .5,
    gridSectorLineColor     : "#999",
    gridSectorLineDash      : [0],

	cursorBorderColor       : "rgba( 0, 0, 0, .8 )",
	cursorBorderWidth       : .5,
	cursorColors            : [
		"rgba( 127, 127, 127, .1)",
		"rgba( 204, 0, 0, .5 )",
		"rgba( 102, 153, 0, .5 )",
		"rgba( 51, 51, 153, .5 )",
		"rgba( 255, 204, 51, .5 )",
		"rgba( 255, 102, 0, .5 )",
		"rgba( 0, 102, 204, .5 )",
		"rgba( 234, 76, 137, .5 )",
		"rgba( 75, 75, 75, .5 )",
		"rgba( 255, 255, 255, .5 )"
	],


    // end grid styles ////////////////

    redrawInterval          : -1,
    redrawDelay             : 10,
    is_showed               : false,

    selectedCell            : [-1, -1],

    no_color_pattern        : null,
    colors_patterns         : {},


    /**
     * Override from Backbone.View
     */
    initialize: function( options ){
        this.app = options.app;

        var self = this;

        // create modal
        this.$el.append( _.template( this.templates.modal ) );
        this.$levelModal = $('#LevelModal');

        this.$levelModal.on('hidden.bs.modal', function (e) {
            self.hide();
        });

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

        // create no-color pattern
        this.__createNoColorPattern();
        this.__createColorsPatterns();

        // add event listeners
        this.$canvas.on( 'mousemove', function( event ) {
            self.__updateCursorPosition( event.offsetX, event.offsetY );
        });

        this.$canvas.on( 'mouseleave', function( event ) {
            self.__resetCursorPositions();
        });

        this.$canvas.on( 'click', function( event ) {
            self.__markCell();
        });

        this.__resetCursorPositions();

        // animation cycle
        this.redrawInterval = setInterval(
            function() {
                self.redraw();
            },
            this.redrawDelay
        );

    },

    /**
     * Show level editor
     * @param data
     * @param callback
     */
    show: function( data, callback ) {
        this.data = data;
        this.callback = callback;

        console.log(this.data);

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

        this.is_showed = true;

    },

    /**
     * Hide level editor
     */
    hide: function() {
        this.is_showed = false;
    },

    // private /////////////////////////////////////////////////////////////////////////////////////////////////////////

    redraw: function() {
        if ( this.is_showed ) {
            this.ctx.clearRect( 0, 0, this.cw, this.ch );
            this.__drawGrid();
            this.__drawCursor();
            this.__drawColors();
        }
    },

    __markCell: function() {
        if ( this.selectedCell[0] == -1 && this.selectedCell[1] == -1 ) {
            return;
        }

        var index = this.selectedCell[1] * 10 + this.selectedCell[0];

        if ( parseInt( this.data.colors_data[index] ) == this.selected_color ) {
            this.data.colors_data[index] = 0;
        } else {
            this.data.colors_data[index] = this.selected_color;
        }
    },

    __drawCursor: function() {
        if ( this.selectedCell[0] == -1 && this.selectedCell[1] == -1 ) {
            return;
        }
        if ( this.selected_color > 0 ) {
            this.ctx.fillStyle = this.cursorColors[this.selected_color];
            this.ctx.fillRect( this.selectedCell[0] * this.cellXSize, this.selectedCell[1] * this.cellYSize, this.cellXSize, this.cellYSize );
            this.ctx.beginPath();
            this.ctx.rect( this.selectedCell[0] * this.cellXSize, this.selectedCell[1] * this.cellYSize, this.cellXSize, this.cellYSize );
            this.ctx.strokeStyle = this.cursorBorderColor;
            this.ctx.lineWidth = this.cursorBorderWidth;
            this.ctx.stroke();
        } else {
            // draw striped BG
            this.ctx.rect( this.selectedCell[0] * this.cellXSize, this.selectedCell[1] * this.cellYSize, this.cellXSize, this.cellYSize );
            this.ctx.fillStyle = this.no_color_pattern;
            this.ctx.fill();
        }
    },

    __drawColors: function() {
        for( var y = 0; y < 10; y++ ) {
            for ( var x = 0; x < 10; x++ ) {
                if ( typeof this.data.colors_data[y*10+x] !== "undefined" && parseInt( this.data.colors_data[y*10+x] ) > 0 ) {
                    this.ctx.rect( x * this.cellXSize, y * this.cellYSize, this.cellXSize, this.cellYSize );
                    this.ctx.fillStyle = this.cursorColors[parseInt( this.data.colors_data[y*10+x] )];
                    //this.ctx.fillStyle = this.colors_patterns[parseInt( this.data.colors_data[y*10+x] )];
                    this.ctx.fill();
                }
            }
        }
    },

    /**
     * Draw cells on canvas
     * @private
     */
    __drawGrid: function() {
        // base lines
        this.ctx.beginPath();

        for ( var i = 1; i <= 9; i++ ) {
            this.ctx.moveTo( 0, i * this.cellYSize );
            this.ctx.lineTo( this.cw, i * this.cellYSize );

            this.ctx.moveTo( i * this.cellXSize, 0 );
            this.ctx.lineTo( i * this.cellXSize, this.cw );
        }

        this.ctx.strokeStyle = this.gridBaseLineColor;
        this.ctx.setLineDash( this.gridBaseLineDash );
        this.ctx.lineWidth = this.gridBaseLineWidth;

        this.ctx.stroke();

        // sector lines
        this.ctx.beginPath();

        this.ctx.moveTo( 0, 5 * this.cellYSize );
        this.ctx.lineTo( this.cw, 5 * this.cellYSize );

        this.ctx.moveTo( 5 * this.cellXSize, 0 );
        this.ctx.lineTo( 5 * this.cellXSize, this.cw );

        this.ctx.strokeStyle = this.gridSectorLineColor;
        this.ctx.setLineDash( this.gridSectorLineDash );
        this.ctx.lineWidth = this.gridSectorLineWidth;

        this.ctx.stroke();

    },

    __selectColor: function( color_index ) {
        this.selected_color = color_index;
        $('.color-item').removeClass( this.selected_palette_class );
        $('#palette-item-' + this.selected_color).addClass( this.selected_palette_class );
    },

    __updateCursorPosition: function( x, y ) {
        var __x = Math.ceil( x / this.cellXSize ) - 1,
            __y = Math.ceil( y / this.cellYSize ) - 1;
        this.$levelCursorPosition.html( '[ ' + this.__pad( __x + 1 ) + ' - ' + this.__pad( __y + 1 ) + ' ]' );
        this.selectedCell = [__x, __y];
    },

    __resetCursorPositions: function() {
        this.$levelCursorPosition.html( '[ XX - XX ]' );
        this.selectedCell = [-1, -1];
    },

    __pad: function( n ) {
        return (n < 10) ? ("0" + n) : n;
    },

    __createNoColorPattern: function() {
        var imageObj = new Image();
        var self = this;
        imageObj.onload = function() {
            self.no_color_pattern = self.ctx.createPattern(imageObj, 'repeat');
        };
        imageObj.src = '/img/stripe.png';
    },

    __createColorsPatterns: function() {
        var images = {};
        var self = this;
        for ( var i = 1; i <= 9; i++ ) {
            images[i] = new Image();
            images[i].colorIndex = i;

            images[i].onload = function() {
                self.colors_patterns[this.colorIndex] = self.ctx.createPattern( images[this.colorIndex], 'repeat');
                console.log(self.colors_patterns);
            };
            images[i].src = '/img/color-'+i+'.png';
        }

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
                        '<div class="row">' +
                            '<div class="col-xs-4 col-md-4"></div>' +
                            '<div class="col-xs-4 col-md-4">' +
                                '<div class="form-group">' +
                                    '<input id="level-order-id" class="form-control" type="number" placeholder="OrderID">' +
                                '</div>' +
                            '</div>' +

                            '<div class="col-xs-4 col-md-4">' +
                                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                                '<button type="button" class="btn btn-primary" id="levelSaveBtn">Save changes</button>' +
                            '</div>' +
                        '</div>' +
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
