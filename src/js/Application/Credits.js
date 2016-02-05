(function(window, $, app) {
    function Credits() {
        var getCreditHolder = function() {
            return app.Page.get().find('[class*="creditsHolder"]');
        };
        
        var getCreditWhole = function() {
            return app.Page.get().find('[class*="creditsWhole"]');
        };
        
        this.togglePosition = function() {
            var creditsHolder = getCreditHolder();
            var creditsWhole = getCreditWhole();
            
            if (creditsHolder.is('.creditsHolderRight')) {
                creditsHolder.addClass('creditsHolderLeft').removeClass('creditsHolderRight');
                creditsWhole.addClass('creditsWholeLeft').removeClass('creditsWholeRight');
            } else {
                creditsHolder.addClass('creditsHolderRight').removeClass('creditsHolderLeft');
                creditsWhole.addClass('creditsWholeRight').removeClass('creditsWholeLeft');
            }
        };
        
        this.toggleColor = function() {
            var creditsHolder = getCreditHolder();
            var creditsWhole = getCreditWhole();
            
            creditsHolder.toggleClass('white');
        };

        this.toggle = function() {
            var creditsHolder = getCreditHolder();
            var creditsWhole = getCreditWhole();
            
            creditsHolder.toggleClass('creditsNone');
            creditsWhole.toggleClass('creditsNone');
        };
    }
    
    app.modules.Credits = Credits;
})(window, jQuery, MagTool);
