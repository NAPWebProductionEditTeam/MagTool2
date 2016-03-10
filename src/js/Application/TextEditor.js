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
        
        var verticalCountClass = function(posNumber) {
            posNumber = Math.round(posNumber / 16).toString();
            posNumber += (Math.round(posNumber / 4) / 4).toString()
                    .replace(/^\d+/, '')
                    .replace('.25', '-a')
                    .replace('.5', '-b')
                    .replace('.75', '-c');

            return posNumber;
        };

        this.changeVerticalClass = function(vertical) {
            var $selected = app.ContentEditor.getSelection();
            var currentClass = $selected.attr('class');
            var elementHeight = parseInt($selected.outerHeight());
            var currentPosB;
            var currentPosT;
            var bottom;
            var top;

            if (vertical === 'push-down') {
                currentPosB = parseInt($selected.css('bottom'));
                top = 624 - currentPosB - elementHeight;
                $selected.attr('class', currentClass.replace(/(push|pull)-(up|down)\S+/g, ''));
                $selected.addClass('push-down' + '-' + verticalCountClass(top));
            } else {
                currentPosT = parseInt($selected.css('top'));
                bottom = 624 - currentPosT - elementHeight;
                $selected.attr('class', currentClass.replace(/(push|pull)-(up|down)\S+/g, ''));
                $selected.addClass('pull-up' + '-' + verticalCountClass(bottom));
            }
        };

        var horizontalCountClass = function(posNumber) {
            posNumber = Math.round(posNumber / 19).toString();
            console.log(posNumber + 'posNumber');

            return posNumber;
        };

        this.changeHorizontalClass = function(horizontal) {
            var $selected = app.ContentEditor.getSelection();
            var currentClass = $selected.attr('class');
            var elementWidth = parseInt($selected.outerWidth());
            var currentPosL;
            var currentPosR;
            var left;
            var right;

            if (horizontal === 'push-right') {
                currentPosR = parseInt($selected.css('right'));
                left = 950 - currentPosR - elementWidth;
                $selected.attr('class', currentClass.replace(/(push|pull)-(right|left)\S+/g, ''));
                $selected.addClass('push-right' + '-' + horizontalCountClass(left));
            } else {
                currentPosL = parseInt($selected.css('left'));
                right = 950 - currentPosL - elementWidth;
                $selected.attr('class', currentClass.replace(/(push|pull)-(right|left)\S+/g, ''));
                $selected.addClass('pull-left' + '-' + horizontalCountClass(right));
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
    
    app.modules.TextEditor = TextEditor;
})(window, jQuery, MagTool);
