/**
 * Created by r0mk1n on 19-May-16.
 */

var LevelsView = Backbone.View.extend({
    /**
     * Current category_id
     */
    category_id     : null,

    /**
     * Levels collection
     */
    Levels          : null,

    /**
     * Handler for level modal
     */
    $levelModal     : null,

    initialize: function() {
        var self = this;

        // create toolbar
        this.$el.append( _.template( this.templates.body ) );
        this.$levelsPlaceholder = $('#levels-placeholder');

        // create modal
        this.$el.append( _.template( this.templates.modal ) );
        this.$levelModal = $('#LevelModal');


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
        this.$levelModal.modal('show');
    },

    events: {
        'click a.btn-add-level' : 'onAddLevelClick'
    },

    templates: {
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
        modal: '' +
        '<div class="modal fade" id="LevelModal" tabindex="-1" role="dialog" aria-labelledby="levelModalLabel">' +
            '<div class="modal-dialog" role="document">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                        '<h4 class="modal-title" id="levelModalLabel">Modal title</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                        '<button type="button" class="btn btn-primary" id="levelSaveBtn">Save changes</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        ''
    }
});