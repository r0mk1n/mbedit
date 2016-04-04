/**
 * Created by r0mk1n on 02-Apr-16.
 */

var ToolbarView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function() {
        var buttons_rendered = '';
        for( var i = 0; i < this.buttons.length; i++ ) {
            buttons_rendered += _.template( this.templates.button )( this.buttons[i] );
        }
        var toolbar_rendered = _.template( this.templates.toolbar )( { buttons:buttons_rendered } );
        this.$el.append( toolbar_rendered );
    },

    buttons: [
        {
            label   : 'Import',
            icon    : 'fa-cloud-upload',
            id      : 'action-import'
        },
        {
            label   : 'Export',
            icon    : 'fa-cloud-download',
            id      : 'action-export'
        }
    ],

    templates: {
        toolbar: '' +
            '<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation" id="App.Toolbar">' +
                '<div class="navbar-header">' +
                    '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">' +
                        '<span class="sr-only">Toggle navigation</span>' +
                        '<span class="icon-bar"></span>' +
                        '<span class="icon-bar"></span>' +
                        '<span class="icon-bar"></span>' +
                    '</button>' +
                    '<a class="navbar-brand" href="#">MBEdit</a>' +
                '</div>' +
                '<div class="navbar-collapse navbar-ex1-collapse">' +
                    '<ul class="nav navbar-nav navbar-right">' +
                        '<%= buttons %>' +
                    '</ul>' +
                '</div>' +
            '</nav>'+
        '',
        button: '' +
            '<li>' +
                '<a href="#" data-toolbar-button-id="<%= id %>">' +
                    '<i class="fa <%= icon %>"></i> ' +
                    '<%= label %>' +
                '</a>' +
            '</li>' +
        ''
    }
});
