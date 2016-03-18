/* global magazineBuilder */

(function(window, $, app, builder) {
    function Page() {
        this.get = function() {
            return $('#page' + builder.get_CurrentPageNumber());
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
    
    app.registerModule('Page', Page);
})(window, jQuery, MagTool, magazineBuilder);
