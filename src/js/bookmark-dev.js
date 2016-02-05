var MagTool = MagTool || {};

(function(window, $, app) {
    var git_commit = 'https://api.github.com/repos/NAPWebProductionEditTeam/MagTool2/git/refs/heads/master?access_token=c7b0887db285fac999cd7e818af641f1a817d352';
    
    app.base_uri = 'http://magtool.local/build/';
    
    $.get(git_commit).done(function(data) {
        app.version = data.object.sha;
        
        $.getScript(app.base_uri + 'js/MagazineTool.js?v=' + app.version);
    });
})(window, jQuery, MagTool);
