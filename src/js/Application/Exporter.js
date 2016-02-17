(function(window, $, app, Medium) {
    var console = window.console;
    
    function Exporter() {
        var $html;
        
        var getHtml = function() {
            if (typeof $html === 'undefined' || ! $html.length) {
                $html = $('#html');
            }
            
            return $html;
        };
        
        var clearHtml = function() {
            getHtml().html('');
        };
        
        var cleanUp = function() {
            app.Page.get().find('[style]:not(.videoLoader):not(object)').removeAttr('style');
            app.Page.get().find('[contenteditable], [aria-disabled], [data-mtifont], .ui-resizable, .onEdit')
                .removeClass('onEdit ui-resizable')
                .removeAttr('contenteditable aria-disabled data-mtifont');
        };
        
        var getCreditsHtml = function() {
            clearHtml();
            
            app.Page.get().find('[class^="credits"]').clone().appendTo(getHtml());
            
            return getHtml().html();
        };
        
        var getContentHtml = function() {
            clearHtml();
            
            app.Page.get()
                .find('.magazineContent div:not([class^="credits"]):not(.edLetterList):not(.videoHolder)').clone().appendTo($html);
            
            return $html.html();
        };
        
        var getVideoHtml = function() {
            clearHtml();
            
            app.Page.get().find('.videoHolder #videojs').clone().appendTo($html);
            
            return $html.html();
        };
        
        this.toJSON = function() {
            return {
                credits: getCreditsHtml(),
                content: getContentHtml(),
                video: getVideoHtml()
            };
        };
        
        this.toConsole = function() {
            console.file('infoBlocks.html', getContentHtml());
            console.file('credits.html', getCreditsHtml());
            
            var video = getVideoHtml();
            if (video) {
                console.file('script.html', video);
            }
        };
        
        this.toModal = function() {
            
        };
    }
    
    app.modules.Exporter = Exporter;
})(window, jQuery, MagTool);
