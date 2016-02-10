(function(window, $, app) {
    var suffix = '?v=' + app.version;
    var fa = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css';
    var css = 'css/app.css';
    var tpl = 'tpl/magtool.html';
    
    var load = function(callback) {
        // Load all required assets && js plugins.
        var html;
        
        $.when(
            $.get(fa).done(function() {
                $('<link>').attr({rel: 'stylesheet', href: fa, id: 'fontAwesome'})
                    .appendTo($('head'));
            }),
            $.get(app.base_uri + css + suffix).done(function() {
                $('<link>').attr({rel: 'stylesheet', href: app.base_uri + css + suffix, id: 'mtCss'})
                    .appendTo($('head'));
            }),
            $.get(app.base_uri + tpl + suffix).done(function(data) {
                html = data;
            })
        ).done(function() {
            app.$body.append(html);
            
            callback();
        });
    };
    
    var reload = function() {
        app.$mt.addClass('hide');
        
        app.getVersion(function() {
            app.$mt.remove();
            $('#mtCss').remove();
            $('#html').remove();
            
            window.MagTool = {
                base_uri: app.base_uri,
                getVersion: app.getVersion,
                reloading: true,
                version: app.version
            };
            
            $.getScript(app.base_uri + 'js/MagazineTool.js?v=' + app.version);
        });
    };
    
    app.Loader = {
        load: load,
        reload: reload
    };
})(window, $, MagTool);
