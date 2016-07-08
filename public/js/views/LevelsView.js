/**
 * Level list view
 * @author @r0mk1n
 *
 */

var LevelsView = Backbone.View.extend({
    /**
     * App handler
     */
    app             : null,

    /**
     * Current category_id
     */
    category_id     : null,

    /**
     * Levels collection
     */
    Levels              : null,

    levelEditView       : null,

    initialize: function( options ) {
        var self = this;

        this.app = options.app;

        // create toolbar
        this.$el.append( _.template( this.templates.body ) );
        this.$levelsPlaceholder = $('#levels-placeholder');

        this.levelEditView = new LevelEditView({app: this.app, el: 'body' });

        this.Levels = new LevelsCollection();
        this.listenTo( this.Levels, 'sync', this.render );
    },

    /**
     * Load leveels from selected category
     * @param category_id
     */
    load: function( category_id ) {
        this.category_id = category_id;

        this.Levels.fetch({
            url: this.Levels.url + '/' + category_id
        });
    },

    /**
     * Render current levels list
     * @param collection
     * @param data
     */
    render: function( collection, data ) {


    },

    // events handlers /////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Handling click on [add level] button
     * @param event
     */
    onAddLevelClick: function( event ) {
        if ( !this.category_id ) {
            alertify.error( 'Please select section first' );
            return;
        }

        var level = new Level(),
            attributes = _.clone( level.attributes );

            attributes.category_id = this.category_id;
        this.levelEditView.show(
            attributes,
            function( level_data ) {

            }
        );
    },

    /**
     * Events
     */
    events: {
        'click a.btn-add-level' : 'onAddLevelClick'
    },

    /**
     * Templates
     */
    templates: {
        /**
         * Levels list
         */
        body: '<div class="levels-view" id="levels-view">' +
            '<div class="levels-placeholder" id="levels-placeholder"></div>' +
            '<div class="buttons-bar levels-toolbar">' +
                '<div class="btn-group btn-block">' +
                    '<a href="javascript:void(0)" class="btn btn-primary btn-add-level" >' +
                        '<i class="fa fa-plus"></i>&nbsp;' +
                        'Add Level' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</div>',

        /**
         * Level item
         */
        level_item: '' +
        ''
    }
});