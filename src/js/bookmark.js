var MagTool = MagTool || {};

(function(window, $, app) {
    if ($('#magtool').length) {
        return app.Loader.reload();
    }
    
    var ENV = '{{ APP_ENV }}';
    
    var git_commit = 'https://api.github.com/repos/NAPWebProductionEditTeam/MagTool2/git/refs/heads/master?access_token=c7b0887db285fac999cd7e818af641f1a817d352';
    var git_release = 'https://api.github.com/repos/NAPWebProductionEditTeam/MagTool2/releases?access_token=c7b0887db285fac999cd7e818af641f1a817d352&per_page=1';
    
    app.env = function(env) {
        if (typeof env === 'undefined') {
            return ENV;
        }
        
        var dev = ['dev', 'local', 'development'];
        var test = ['test', 'staging', 'testing'];
        var dist = ['dist', 'live', 'production', 'distribution'];
        
        if ($.inArray(ENV, dev) > -1) {
            return $.inArray(env, dev) > -1;
        }
        
        if ($.inArray(ENV, test)) {
            return $.inArray(env, test) > -1;
        }
        
        if ($.inArray(ENV, dist)) {
            return $.inArray(env, dist) > -1;
        }
        
        return false;
    };
    
    // Needs to change to Alfresco once first dist is uploaded.
    app.BASE_URI = 'http://staging.net-a-porter.com/alfresco/nap/webAssets/magazine/_shared/contents/MagTool/';
    
    if (app.env('dist')) {
        app.BASE_URI = 'http://magtool.local/build/';
    }
    
    app.getVersion = function(callback) {
        var version_url = app.env('dev') ? git_commit : git_release;
        
        return $.get(version_url).done(function(data) {
            app.VERSION = app.env('dev') ? data.object.sha : (data.length === 0 ? '0.0.0' : data[0].tag_name.replace('v', ''));
            
            if (typeof callback === 'function') {
                callback();
            }
        });
    };
    
    app.getVersion(function() {
        $.getScript(app.BASE_URI + 'js/MagazineTool' + (app.env('dist') ? '.min' : '') + '.js?v=' + app.VERSION);
    });
})(window, jQuery, MagTool);
