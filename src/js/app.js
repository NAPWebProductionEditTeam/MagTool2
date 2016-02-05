(function(window, $, app) {
    app.Loader.load(function() {
        // Initialize modules
        for (var module in app.modules) {
            app[module] = new app.modules[module]();
        }
        
        app.$mt = $('#magtool');
        
        /**
         * Show MagTool.
         */
        // trigger repaint
        app.$mt.offset();
        
        // Add padding to body the size of the MagTool, and ensure there's no page 'jump' by recalculating the scrollTop.
        var mtHeight = app.$mt.outerHeight();
        app.$body.css({'padding-top': mtHeight});
        $(window).scrollTop($(window).scrollTop() + mtHeight);
        
        // Fade in
        $('#magtool').removeClass('hide');
        
        /**
         * Bind actions.
         */
        $('#magtool').on('click', '[data-action]', function() {
            var action = $(this).data('action');
            
            app[action]();
        });
    });
})(window, jQuery, MagTool);
