(function(window, $, app) {
    function Credits() {
        var getCreditsHolder = function() {
            return app.Page.get().find('[class*="creditsHolder"]');
        };
        
        var getCreditsWhole = function() {
            return app.Page.get().find('[class*="creditsWhole"]');
        };
        
        this.detectVisibility = function() {
            $('#creditsVisibility').prop('checked', ! getCreditsHolder().is('.creditsNone'));
        };
        
        this.detectContent = function() {
            var $editor = $('#creditsEditor');
            var text = getCreditsWhole().find('p').html();
            
            text = text.replace(/<br>/g, '\n');
            $editor.val(text);
        };
        
        this.getCredits = function() {
            return getCreditsWhole();
        };
        
        this.show = function() {
            this.getCredits().fadeIn(300);
        };
        
        this.hide = function() {
            this.getCredits().fadeOut(300);
        };
        
        this.togglePosition = function() {
            var $creditsHolder = getCreditsHolder();
            var $creditsWhole = getCreditsWhole();
            
            if ($creditsHolder.is('.creditsHolderRight')) {
                $creditsHolder.addClass('creditsHolderLeft').removeClass('creditsHolderRight');
                $creditsWhole.addClass('creditsWholeLeft').removeClass('creditsWholeRight');
            } else {
                $creditsHolder.addClass('creditsHolderRight').removeClass('creditsHolderLeft');
                $creditsWhole.addClass('creditsWholeRight').removeClass('creditsWholeLeft');
            }
        };
        
        this.toggleColor = function() {
            getCreditsHolder().toggleClass('white');
        };
        
        this.setVisibility = function(visible) {
            var $creditsHolder = getCreditsHolder();
            var $creditsWhole = getCreditsWhole();
            var $content = $creditsWhole.find('p');
            var content;
            
            if (visible) {
                $creditsHolder.removeClass('creditsNone');
                $creditsWhole.removeClass('creditsNone');
                
                if (! $content.html()) {
                    content = $content.data('content');
                    content = content ? content : 'Credits';
                    
                    $content.html(content);
                }
            } else {
                $creditsHolder.addClass('creditsNone');
                $creditsWhole.addClass('creditsNone');
                
                content = $content.html();
                $content.html('').data('content', content);
            }
        };
        
        this.update = function(text) {
            text = text.replace(/\n/g, '<br>');
            text = text.replace(/\s{2,}/g, ' ');
            
            getCreditsWhole().find('p').html(text);
        };
        
        //        this.resizeCreditSpan = function(option) {
        //            var $creditsWhole = getCreditsWhole();
        //
        //            if (option == 'addSpan') {
        //            }
        //        };
    }
    
    app.registerModule('Credits', Credits);
})(window, jQuery, MagTool);
