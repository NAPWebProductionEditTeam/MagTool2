(function(window, $, app) {
    app.Loader.load(function() {
        // Initialize modules
        for (var module in app.modules) {
            app[module] = new app.modules[module]();
        }

        /**
         * Show MagTool.
         */
        // trigger repaint
        app.UI.getUI().offset();
        
        // Add padding to body the size of the MagTool, and ensure there's no page 'jump' by recalculating the scrollTop.
        if (! app.reloading) {
            var mtHeight = app.UI.getUI().outerHeight();
            app.$body.css({'padding-top': mtHeight});
            $(window).scrollTop($(window).scrollTop() + mtHeight);
        }
        
        // Set slug property controllers to match the current slug
        app.Slug.detectSlugProperties();
        
        // Fade in
        app.UI.getUI().removeClass('hide');
        
        // Register binds
        app.registerBindings();
        
        $(window.document).on('click', '.btn, :button, :submit, :reset', function() {
            $(this).blur();
        });
    });
})(window, jQuery, MagTool);
