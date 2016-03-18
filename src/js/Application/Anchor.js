(function(window, $, app) {
    var Math = window.Math;
    var parseInt = window.parseInt;
    
    // TODO: Clean up
    function Anchor() {
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
            return Math.round(posNumber / 16).toString();
        };
        
        this.changeVerticalAnchor = function(vertical) {
            var $selected = app.ContentEditor.getSelection();
            var $parent = $selected.offsetParent();
            var currentClass = $selected.attr('class');
            var top = $selected.offset().top - $parent.offset().top;
            var bottom;
            
            $selected.removeClass(function(index, css) {
                return (css.match(/(push|pull)-(up|down)\S+/g) || []).join(' ');
            });
            
            if (vertical === 'push-down') {
                $selected.addClass('push-down-' + verticalCountClass(top));
            } else {
                bottom = 624 - top - $selected.outerHeight();
                $selected.addClass('pull-up-' + verticalCountClass(bottom));
            }
        };
        
        var horizontalCountClass = function(posNumber) {
            return Math.round(posNumber / 19).toString();
        };
        
        this.changeHorizontalAnchor = function(horizontal) {
            var $selected = app.ContentEditor.getSelection();
            var currentClass = $selected.attr('class');
            var elementWidth = parseInt($selected.outerWidth());
            var currentPosL = parseInt($selected.css('left'));
            var currentPosR = parseInt($selected.css('right'));
            var left;
            var right;
            
            $selected.removeClass(function(index, css) {
                return (css.match(/(push|pull)-(right|left)\S+/g) || []).join(' ');
            });
            
            if (horizontal === 'push-right') {
                left = 950 - currentPosR - elementWidth;
                $selected.addClass('push-right' + '-' + horizontalCountClass(left));
            } else {
                right = 950 - currentPosL - elementWidth;
                $selected.addClass('pull-left' + '-' + horizontalCountClass(right));
            }
        };
    }
    
    app.registerModule('Anchor', Anchor);
})(window, jQuery, MagTool);
