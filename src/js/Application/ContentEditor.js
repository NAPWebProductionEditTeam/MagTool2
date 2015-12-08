(function(window, $, app) {
    var $html = $('#html');
    
    var clearHtml = function() {
        $html.html('');
    };
    
    var cleanUp = function () {
        app.Page.get().find('[style]:not(.videoLoader):not(object)').removeAttr('style');
        app.Page.get().find('[contenteditable], [aria-disabled], [data-mtifont], .ui-resizable, .onEdit')
            .removeClass('onEdit ui-resizable')
            .removeAttr('contenteditable aria-disabled data-mtifont');
    };
    
    var getCreditsHtml = function() {
        clearHtml();
        
        app.Page.get().find('[class^="credits"]').clone().appendTo($html);
        
        return $html.contents();
    };
    
    var getContentHtml = function() {
        clearHtml();
        
        app.Page.get()
            .find('.magazineContent div:not([class^="credits"]):not(.edLetterList):not(.videoHolder)').clone().appendTo($html);
        
        return $html.contents();
    };
    
    var getVideoHtml = function() {
        clearHtml();
        
        app.Page.get().find('.videoHolder #videojs').clone().appendTo($html);
        
        return $html.contents();
    };
    
    app.ContentEditor = {
        cleanUp: cleanUp,
        getCreditsHtml: getCreditsHtml,
        getContentHtml: getContentHtml,
        getVideoHtml: getVideoHtml
    };
})(window, jQuery, app);
