(function(window, $, app) {
    var suffix = '?v=' + app.version;
    var fa = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css';
    var css = 'css/app.css';
    var tpl = 'tpl/magtool.html';
    
    var load = function(callback) {
        // Load all required assets && js plugins.
        var html;
        var fontAwesome = $.Deferred();
        
        $.when(
            $.get(fa).done(function() {
                $('<link>').attr({'rel': 'stylesheet', 'href': fa})
                    .appendTo($('head'));
            }),
            $.get(app.base_uri + css + suffix).done(function() {
                $('<link>').attr({'rel': 'stylesheet', 'href': app.base_uri + css + suffix})
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
    
    app.Loader = {
        load: load
    };
})(window, $, MagTool);
