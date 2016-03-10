(function(window, $, app) {
    app.Loader.load(function() {
        // Initialize modules
        for (var module in app.modules) {
            app[module] = new app.modules[module]();
        }
        
        /**
         * Show MagTool.
         */
        
        // Fade in
        app.$doc.ready(function() {
            app.UI.show();
        });
        
        // Register binds
        app.registerBindings();
        app.registerKeyBindings();
        app.registerNavigationBindings();
        
        app.$doc.on('click', '.btn, :button, :submit, :reset', function() {
            $(this).blur();
        });
    });
})(window, jQuery, MagTool);
