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
            
            $selected.removeClass('black white').addClass(color);
        };
        
        this.changeBG = function(bg) {
            var $selected = app.ContentEditor.getSelection();

            if ($selected.is(".kickerBlock, .kickerBlockWhite")) {
                if (bg == "noBG") {
                    $selected.removeClass("noBG paddingBoxBlockWhite paddingBoxBlockOpaque").addClass("noBG");
                } else if (bg == "wBG") {
                    if ($selected.is(".kickerBlock")) {
                        $selected.removeClass("noBG paddingBoxBlockWhite paddingBoxBlockOpaque kickerBlock kickerBlockWhite").addClass("kickerBlock");
                    } else if ($selected.is(".kickerBlockWhite")) {
                        $selected.removeClass("noBG paddingBoxBlockWhite paddingBoxBlockOpaque kickerBlock kickerBlockWhite").addClass("kickerBlockWhite");
                    }
                    
                }
            } else {
                if (bg == "noBG") {
                    $selected.removeClass("noBG paddingBoxBlockWhite paddingBoxBlockOpaque").addClass("noBG");
                } else if (bg == "wBG") {
                    $selected.removeClass("noBG paddingBoxBlockWhite paddingBoxBlockOpaque").addClass("paddingBoxBlockWhite");
                }
            }
        };
            
    }
    
    app.registerModule('TextEditor', TextEditor);
})(window, jQuery, MagTool);
