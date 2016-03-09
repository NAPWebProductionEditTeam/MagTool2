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
        
        // Set slug property controllers to match the current slug
        app.Slug.detectSlugProperties();
        
        // Fade in
        app.$doc.ready(function() {
            if (window.document.readyState === 'complete') {
                app.UI.show();
            } else {
                $(window).load(function() {
                    app.UI.show();
                });
            }
        });
        
        // Register binds
        app.registerBindings();
        app.registerKeyBindings();
        
        app.$doc.on('click', '.btn, :button, :submit, :reset', function() {
            $(this).blur();
        });
    });
})(window, jQuery, MagTool);
