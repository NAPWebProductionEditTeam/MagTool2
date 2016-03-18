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
        
        switch (ENV) {
            case 'dev':
            case 'local':
            case 'development':
                return env === 'development';
            case 'test':
            case 'testing':
                return env === 'testing';
            case 'dist':
            case 'production':
            case 'distribution':
                return env === 'production';
        }
    };
    
    // Needs to change to Alfresco once first dist is uploaded.
    app.BASE_URI = 'http://magtool.local/build/';
    
    if (app.env('production')) {
        app.BASE_URI = 'http://magtool.local/build/';
    }
    
    app.getVersion = function(callback) {
        var version_url = app.env('development') ? git_commit : git_release;
        
        return $.get(version_url).done(function(data) {
            app.VERSION = app.env('development') ? data.object.sha : (data.length === 0 ? '0.0.0' : data[0].tag_name.replace('v', ''));
            
            if (typeof callback === 'function') {
                callback();
            }
        });
    };
    
    app.getVersion(function() {
        $.getScript(app.BASE_URI + 'js/MagazineTool.js?v=' + app.VERSION);
    });
})(window, jQuery, MagTool);
