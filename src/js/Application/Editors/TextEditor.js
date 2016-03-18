(function(window, $, app) {
    // TODO: Clean up (looks fairly clean but check at least)
    function TextEditor() {
        this.detectSelectedAlignment = function() {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();
            var alignment = $selected.attr('class').replace(/.*?(\w*)text(?:align(\w+))?.*/i, '$1$2').toLowerCase();
            
            $selectionControls.filter('[name="textAlignment"]').prop('checked', false);
            
            switch (alignment) {
                case 'center':
                    $('#centerText').prop('checked', true);
                    break;
                case 'right':
                    $('#rightText').prop('checked', true);
                    break;
                default:
                    $('#leftText').prop('checked', true);
                    break;
            }
        };

        this.align = function(alignment) {
            var $selected = app.ContentEditor.getSelection();
            
            $selected.removeClass('leftText rightText textAlignCenter');
            
            switch (alignment) {
                case 'textAlignCenter':
                    $selected.addClass('textAlignCenter');
                    break;
                case 'rightText':
                    $selected.addClass('rightText');
                    break;
                case 'leftText':
                    $selected.addClass('leftText');
                    break;
            }
        };

        this.changeColor = function(color) {
            var $selected = app.ContentEditor.getSelection();
            
            $selected.removeClass('black white');
            
            if (color === 'white') {
                $selected.addClass('white');
                
                $selected.find('.btnShopThe').removeClass('btnShopThe').addClass('btnShopTheWhite');
                $selected.find('.btnShopTheTwoLine').removeClass('btnShopTheTwoLine').addClass('btnShopTheTwoLineWhite');
            } else if (color === 'black') {
                $selected.addClass('black');
                
                $selected.find('.btnShopTheWhite').removeClass('btnShopTheWhite').addClass('btnShopThe');
                $selected.find('.btnShopTheTwoLineWhite').removeClass('btnShopTheTwoLineWhite').addClass('btnShopTheTwoLine');
            }
        };
    }
    
    app.registerModule('TextEditor', TextEditor);
})(window, jQuery, MagTool);
