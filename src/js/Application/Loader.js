var app = app || {};

(function(window, $, app) {
    var base_uri = 'http://rawgit.com/NAPWebProductionEditTeam/MagTool2/master/';
    var suffix = '?v=' + app.commit;
    var css = 'build/css/app.css';
    var tpl = 'build/tpl/magtool.html';
    
    var Loader = {
        load: function(callback) {
            // Load all required assets && js plugins.
            
            $.when(
                $.get(base_uri + css + suffix).done(function() {
                    $('<link>').attr({'rel': 'stylesheet', 'href': base_uri + css + suffix})
                        .appendTo($('head'));
                })
            ).then();
            
            // $.get (css) -> done -> link rel[]
            // $.get (html) -> done -> append to $body
            // $.get (js libs) -> done
        }
    };
    
    app.Loader = Loader;
})(window, $, app);
