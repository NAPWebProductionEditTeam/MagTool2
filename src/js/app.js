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
        
        // Set slug property controllers to match the current slug
        app.Slug.detectSlugProperties();
        
        // Fade in
        app.$mt.removeClass('hide');
        
        /**
         * Bind actions.
         */
        app.$mt.on('click', '[data-action]', function() {
            var action = $(this).data('action');
            
            app[action]();
        });
        
        app.$mt.find('select[name="slug-type"]').change(function() {
            app.changeSlug($(this).val());
        });
        
        app.$mt.find('input[name="slugPosition"]').change(function() {
            app.moveSlug($(this).filter(':checked').val());
        });
    });
})(window, jQuery, MagTool);
