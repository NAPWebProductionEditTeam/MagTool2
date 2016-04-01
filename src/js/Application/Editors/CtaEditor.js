(function(window, $, app) {
    app.CTA = '.btnShopThe, .btnShopTheWhite, .btnShopTheTwoLine, .btnShopTheTwoLineWhite';
    
    var ctaBlack = '.btnShopThe, .btnShopTheTwoLine';
    var ctaWhite = '.btnShopTheWhite, .btnShopTheTwoLineWhite';
    
    var ctaOne = '.btnShopThe, .btnShopTheWhite';
    var ctaTwo = '.btnShopTheTwoLine, .btnShopTheTwoLineWhite';
    
    function CtaEditor() {
        var getLink = function() {
            return app.ContentEditor.getSelection().find('a');
        };
        
        this.detectSelectedCta = function() {
            var $selected = app.ContentEditor.getSelection();
            var $a = getLink();
            
            $('#ctaId').val($a.data('magtool'));
            $('#ctaContent').val($a.text());
            
            if ($selected.is(ctaBlack)) {
                $('#ctaBlack').prop('checked', true);
            } else {
                $('#ctaWhite').prop('checked', true);
            }
        };
        
        this.changeId = function(id) {
            getLink().attr('data-magtool', id);
        };
        
        this.changeContent = function(txt) {
            getLink().text(txt);
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
