(function(window, $, app) {
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
        
        this.detectSelectedClass = function() {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();

            if ($selected.is('[class*=push-down]')) {

                $('#push-down').prop('checked', true);
            } else if ($selected.is('[class*=pull-up]')) {

                $('#pull-up').prop('checked', true);
            }

            if ($selected.is('[class*=push-right]')) {
                $('#push-right').prop('checked', true);
            } else if ($selected.is('[class*=pull-left]')) {
                $('#pull-left').prop('checked', true);
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
        
        this.changeVerticalClass = function (vertical){
            var $selected = app.ContentEditor.getSelection();
            var currentClass = $selected.attr('class');
            $selected.attr('class',currentClass.replace(/(push|pull)-(up|down)\S+/g,''));
            if (vertical==='push-down') {

                var newClass = vertical +
                $selected.addClass()

            }
        }

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
    
    app.modules.TextEditor = TextEditor;
})(window, jQuery, MagTool);
