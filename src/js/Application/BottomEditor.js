(function(window, $, app) {
    function BottomEditor() {
        this.detectSelectedClass = function() {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getBottomSection();

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

        var verticalCountClass = function(posNumber) {
            posNumber = Math.round(posNumber / 16).toString();
            posNumber += (Math.round(posNumber / 4) / 4).toString()
                    .replace(/^\d+/, '')
                    .replace('.25', '-a')
                    .replace('.5', '-b')
                    .replace('.75', '-c');

            return posNumber;
        };

        this.changeVerticalAnchor = function(vertical) {
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

        this.changeHorizontalAnchor = function(horizontal) {
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

    }

    app.modules.BottomEditor = BottomEditor;
})(window, jQuery, MagTool);
