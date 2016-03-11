(function(window, $, app) {
    function CtaEditor() {
        this.detectSelectedCta = function() {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();
            var $oldCta = $selected.find('a').attr('data-magtool');
            
            if ($selected.is('.btnShopThe')) {
                $selectionControls.filter('#CTA').val($oldCta);
            } else {
                $selectionControls.filter('#CTA').val('NO CTA');
            }
            
            if ($selected.is('.btnShopThe')) {
                $selectionControls.filter('#ctaBlack').prop('checked', true);
            }
        };
        
        this.changeCta = function(cta) {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();
            var $oldCta = $selected.find('a').attr('data-magtool');
            cta = $selectionControls.filter('#CTA').val();
            
            if (cta !== $oldCta && $selected.is('.btnShopThe')) {
                $selected.find('a').attr('data-magtool', cta);
            }
        };
    }
    
    app.modules.CtaEditor = CtaEditor;
})(window, jQuery, MagTool);
