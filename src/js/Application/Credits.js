(function(window, $, app) {
    function Credits() {
        var getCreditsHolder = function() {
            return app.Page.get().find('[class*="creditsHolder"]');
        };
        
        var getCreditsWhole = function() {
            return app.Page.get().find('[class*="creditsWhole"]');
        };
        
        this.getCredits = function() {
            return getCreditsWhole();
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
            
            // Empty credits when hiding.
            if (creditsWhole.is('.creditsNone')) {
                creditsWhole.find('p').html('');
            }
        };
        
        this.isVisible = function() {
            return ! getCreditsHolder().is('.creditsNone');
        };
        
        this.detectCreditsContent = function() {
            var $editor = app.UI.getSelectionControls().filter('#creditsEditor');
            var text = getCreditsWhole().find('p').html();
            
            text = text.replace(/<br>/g, '\n');
            $editor.val(text);
        };
        
        this.update = function(text) {
            text = text.replace(/\n/g, '<br>');
            text = text.replace(/\s{2,}/g, ' ');
            
            getCreditsWhole().find('p').html(text);
        };
    }
    
    app.modules.Credits = Credits;
})(window, jQuery, MagTool);
