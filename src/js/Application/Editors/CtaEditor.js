(function(window, $, app) {
    app.CTA = '.btnShopThe, .btnShopTheWhite, .btnShopTheTwoLine, .btnShopTheTwoLineWhite';
    
    var ctaBlack = '.btnShopThe, .btnShopTheTwoLine';
    var ctaWhite = '.btnShopTheWhite, .btnShopTheTwoLineWhite';
    
    var ctaOne = '.btnShopThe, .btnShopTheWhite';
    var ctaTwo = '.btnShopTheTwoLine, .btnShopTheTwoLineWhite';
    
    function CtaEditor() {
        this.detectSelectedCta = function() {
            var $selected = app.ContentEditor.getSelection();
            
            $('#ctaId').val($selected.find('a').data('magtool'));
            
            if ($selected.is('.btnShopThe') || $selected.is('.btnShopTheTwoLine')) {
                $('#ctaBlack').prop('checked', true);
            } else {
                $('#ctaWhite').prop('checked', true);
            }
        };
        
        this.changeId = function(id) {
            app.ContentEditor.getSelection().find('a').attr('data-magtool', id);
        };
        
        this.changeColor = function(color) {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();
            
            if (color == 'black') {
                if ($selected.is(ctaOne)) {
                    $selected.removeClass('btnShopTheWhite').addClass('btnShopThe');
                } else {
                    $selected.removeClass('btnShopTheTwoLineWhite').addClass('btnShopTheTwoLine');
                }
            } else {
                if ($selected.is(ctaOne)) {
                    $selected.removeClass('btnShopThe').addClass('btnShopTheWhite');
                } else {
                    $selected.removeClass('btnShopTheTwoLine').addClass('btnShopTheTwoLineWhite');
                }
            }
        };
    }
    
    app.registerModule('CtaEditor', CtaEditor);
})(window, jQuery, MagTool);
