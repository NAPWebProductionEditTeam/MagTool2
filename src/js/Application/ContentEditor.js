(function(window, $, app) {
    function ContentEditor() {
        var $html;
        var editing = false;
        
        var getHtml = function() {
            if (typeof $html === 'undefined' || ! $html.length) {
                $html = $('#html');
            }
            
            return $html;
        };
        
        var clearHtml = function() {
            getHtml().html('');
        };
        
        this.startingEdit = function() {
            app.UI.btnGroupLoading('editSave');
        };
        
        this.startEdit = function() {
            editing = true;
            
            app.UI.showBtn('editSave', 'save');
            app.UI.btnGroupLoaded('editSave');
            
            app.UI.makeDraggable();
            app.UI.makeSelectable();
        };
        
        this.stopingEdit = function() {
            app.UI.btnGroupLoading('editSave');
        };
        
        this.stopEdit = function() {
            app.UI.removeSelectable();
            app.UI.removeDraggable();
            
            app.UI.showBtn('editSave', 'edit');
            app.UI.btnGroupLoaded('editSave');
            
            editing = false;
        };
        
        this.isEditing = function() {
            return editing;
        };
        
        this.cleanUp = function() {
            app.Page.get().find('[style]:not(.videoLoader):not(object)').removeAttr('style');
            app.Page.get().find('[contenteditable], [aria-disabled], [data-mtifont], .ui-resizable, .onEdit')
                .removeClass('onEdit ui-resizable')
                .removeAttr('contenteditable aria-disabled data-mtifont');
        };
        
        this.getCreditsHtml = function() {
            clearHtml();
            
            app.Page.get().find('[class^="credits"]').clone().appendTo(getHtml());
            
            return getHtml().html();
        };
        
        this.getContentHtml = function() {
            clearHtml();
            
            app.Page.get()
                .find('.magazineContent div:not([class^="credits"]):not(.edLetterList):not(.videoHolder)').clone().appendTo($html);
            
            return $html.html();
        };
        
        this.getVideoHtml = function() {
            clearHtml();
            
            app.Page.get().find('.videoHolder #videojs').clone().appendTo($html);
            
            return $html.html();
        };
    }
    
    app.modules.ContentEditor = ContentEditor;
})(window, jQuery, MagTool);
