(function(window, $) {
    var github_api = 'https://api.github.com/repos/NAPWebProductionEditTeam/MagTool2/git/refs/heads/master?access_token=c7b0887db285fac999cd7e818af641f1a817d352';
    
    $.get(github_api).done(function(data) {
        var commit = data.object.sha;
        
        $('<script>')
            .attr('src', 'https://raw.githubusercontent.com/NAPWebProductionEditTeam/MagTool2/master/src/app.js?v=' + commit)
            .appendTo($('body'));
    });
})(window, jQuery);
