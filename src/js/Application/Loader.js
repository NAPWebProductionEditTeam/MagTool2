var app = app || {};

(function(window, $, app) {
    var base_uri = 'https://api.github.com/repos/NAPWebProductionEditTeam/MagTool2/git/refs/heads/master/';
    var suffix = '?access_token=c7b0887db285fac999cd7e818af641f1a817d352';
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
