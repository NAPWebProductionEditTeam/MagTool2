(function(window, $, app) {
    function Credits() {
        var getCreditsHolder = function() {
            return app.Page.get().find('[class*="creditsHolder"]');
        };
        
        var getCreditsWhole = function() {
            return app.Page.get().find('[class*="creditsWhole"]');
        };
        
        this.togglePosition = function() {
            var creditsHolder = getCreditsHolder();
            var creditsWhole = getCreditsWhole();
            
            if (creditsHolder.is('.creditsHolderRight')) {
                creditsHolder.addClass('creditsHolderLeft').removeClass('creditsHolderRight');
                creditsWhole.addClass('creditsWholeLeft').removeClass('creditsWholeRight');
            } else {
                creditsHolder.addClass('creditsHolderRight').removeClass('creditsHolderLeft');
                creditsWhole.addClass('creditsWholeRight').removeClass('creditsWholeLeft');
            }
        };
        
        this.toggleColor = function() {
            var creditsHolder = getCreditsHolder();
            var creditsWhole = getCreditsWhole();
            
            creditsHolder.toggleClass('white');
        };

        this.toggle = function() {
            var creditsHolder = getCreditsHolder();
            var creditsWhole = getCreditsWhole();
            
            creditsHolder.toggleClass('creditsNone');
            creditsWhole.toggleClass('creditsNone');
        };
        
        this.isVisible = function() {
            return ! getCreditsHolder().is('.creditsNone');
        };
    }
    
    app.modules.Credits = Credits;
})(window, jQuery, MagTool);
