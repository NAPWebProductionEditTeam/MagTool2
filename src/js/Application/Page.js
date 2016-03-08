/* global magazineBuilder */

(function(window, $, app, builder) {
    function Page() {
        var $currentPage;
        
        this.get = function() {
            if (typeof $currentPage === 'undefined') {
                $currentPage = $('#page' + builder.get_CurrentPageNumber());
            }
            
            return $currentPage;
        };
        
        this.getContent = function() {
            return this.get().find('.magazineContent');
        };
        
        this.getId = function() {
            return this.get().data('id');
        };
        
        this.getNumber = function() {
            return this.get().data('page-number');
        };
        
        this.getTitle = function() {
            return this.get().data('feature-title');
        };
        
        this.getIssueId = function() {
            return $("#magazineHolder").data('id');
        };
    }
    
    app.modules.Page = Page;
})(window, jQuery, MagTool, magazineBuilder);
