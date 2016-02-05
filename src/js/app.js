(function(window, $, app) {
    app.Loader.load(function() {
        // Initialize modules
        for (var module in app.modules) {
            app[module] = new app.modules[module]();
        }
        
        // FadeIn
        //$('#magtool').removeClass('hide');
//        setTimeout(function() {
//            $('#magtool').removeClass('hide');
//        }, 100);
    });
    
    $('body').on('click', '[data-action]', function() {
        var action = $(this).data('action');
        
        app[action]();
    });
})(window, jQuery, MagTool);