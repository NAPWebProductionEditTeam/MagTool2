(function(window, $, app) {
    var $html = $('#html');
    
    var clearHtml = function() {
        $html.html('');
    };
    
    var getCreditsHtml = function() {
        clearHtml();
        
        app.Page.getPage.find('[class^="credits"]').clone().appendTo($html);
        
        return $html.html();
    };
    
    var getContentHtml = function() {
        clearHtml();
        
        return $html.html();
    };
    
    app.contentEditor = {
        getCreditsHtml: getCreditsHtml,
        getContentHtml: getContentHtml
    };
})(window, jQuery, app);
