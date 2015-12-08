(function(window, $, app) {
    var $html = $('#html');
    
    var clearHtml = function() {
        $html.html('');
    };
    
    var cleanUp = function () {
        app.Page.getPage().find('[style]:not(.videoLoader):not(object)').removeAttr('style');
        app.Page.getPage().find('[contenteditable], [aria-disabled], [data-mtifont], .ui-resizable, .onEdit')
            .removeClass('onEdit ui-resizable')
            .removeAttr('contenteditable aria-disabled data-mtifont');
    }
    
    var getCreditsHtml = function() {
        clearHtml();
        
        app.Page.getPage().find('[class^="credits"]').clone().appendTo($html);
        
        return $html.html();
    };
    
    var getContentHtml = function() {
        clearHtml();
        
        app.Page.getPage()
            .find('.magazineContent div:not([class^="credits"]):not(.edLetterList):not(.videoHolder)').clone().appendTo($html);
        
        return $html.html();
    };
    
    var getVideoHtml = function() {
        clearHtml();
        
        app.Page.getPage().find('.videoHolder #videojs').clone().appendTo($html);
        
        return $html.html();
    };
    
    app.ContentEditor = {
        getCreditsHtml: getCreditsHtml,
        getContentHtml: getContentHtml,
        getVideoHtml: getVideoHtml
    };
})(window, jQuery, app);
