(function(window, $, app) {
    function Anchor() {
        this.detectAnchor = function() {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getBottomSection();
            
            if ($selected.is('[class*=push-down]')) {
                $('#anchorTop').prop('checked', true);
            } else if ($selected.is('[class*=pull-up]')) {
                $('#anchorBottom').prop('checked', true);
            }
            
            if ($selected.is('[class*=push-right]')) {
                $('#anchorLeft').prop('checked', true);
            } else if ($selected.is('[class*=pull-left]')) {
                $('#anchorRight').prop('checked', true);
            }
        };
        
        this.changeVerticalAnchor = function(anchor) {
            app.ContentEditor.changeVerticalPos(app.ContentEditor.getSelection(), anchor);
        };
        
        this.changeHorizontalAnchor = function(anchor) {
            app.ContentEditor.changeHorizontalPos(app.ContentEditor.getSelection(), anchor);
        };
    }
 
    app.registerModule('Anchor', Anchor);
})(window, jQuery, MagTool);
