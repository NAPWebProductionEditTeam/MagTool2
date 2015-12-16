var app = app || {};

(function(window, $, app) {
    // In production we grab the latest release rather than the latest commit.
    // We might be able to change this to the file version in Alfresco if the Alfresco API allows that.
    var git_release = 'https://api.github.com/repos/NAPWebProductionEditTeam/MagTool2/releases?access_token=c7b0887db285fac999cd7e818af641f1a817d352&per_page=1';
    
    // This needs to change to the alfresco uri once we have a first release on Alfresco.
    app.base_uri = 'http://magtool.local/';
    
    $.get(git_release).done(function(data) {
        app.version = data.length === 0 ? '0.0.0' : data[0].tag_name.replace('v', '');
        
        $.getScript(app.base_uri + 'js/app.min.js?v=' + app.version);
    });
})(window, jQuery, app);
