(function(window, $, app, CssEvents) {
    var suffix = '?v=' + app.VERSION;
    var fa = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css';
    var css = 'css/app.css';
    var tpl = 'tpl/magtool.html';
    var jqUi = 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js';
    
    var load = function(callback) {
        // Load all required assets && js plugins.
        var html;
        
        $.when(
            $.get(fa).done(function() {
                $('<link>').attr({rel: 'stylesheet', href: fa, id: 'fontAwesome'})
                    .appendTo($('head'));
            }),
            $.get(app.BASE_URI + css + suffix).done(function() {
                $('<link>').attr({rel: 'stylesheet', href: app.BASE_URI + css + suffix, id: 'mtCss'})
                    .appendTo($('head'));
            }),
            $.get(app.BASE_URI + tpl + suffix).done(function(data) {
                html = data;
            }),
            $.getScript(jqUi)
        ).done(function() {
            app.$body.append(html);
            
            callback();
        });
    };
    
    var reload = function() {
        var faded = $.Deferred();
        
        app.UI.getUI().addClass('--hide').on(CssEvents.transitionEvent(), function() {
            $(this).off(CssEvents.transitionEvent());
            
            $('#magtoolComponents').remove();
            faded.resolve();
        });
        
        app.ContentEditor.stopEdit();
        app.bindOriginalKeyEvents();
        app.UI.getNotification().removeClass('--open');
        
        $.when(
            faded,
            app.getVersion()
        ).done(function() {
            window.MagTool = {
                BASE_URI: app.BASE_URI,
                getVersion: app.getVersion,
                reloading: true,
                VERSION: app.VERSION
            };
            
            $('#mtCss, #fontAwesome').remove();
            
            $.getScript(app.BASE_URI + 'js/MagazineTool.js?v=' + app.VERSION);
        });
    };
    
    app.Loader = {
        load: load,
        reload: reload
    };
})(window, $, MagTool, CssEvents);
