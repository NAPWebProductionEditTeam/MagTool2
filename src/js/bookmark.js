var app = app || {};

(function(window, $, app) {
    var github_api = 'https://api.github.com/repos/NAPWebProductionEditTeam/MagTool2/git/refs/heads/master?access_token=c7b0887db285fac999cd7e818af641f1a817d352';
    
    $.get(github_api).done(function(data) {
        app.commit = data.object.sha;
        
        $.getScript('http://magtool.local/js/app.min.js?v=' + app.commit);
    });
})(window, jQuery, app);
