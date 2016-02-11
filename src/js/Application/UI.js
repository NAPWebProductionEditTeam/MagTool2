(function(window, $, app, CssEvents) {
    function UI() {
        var $selectables, $draggables;
        
        this.showBtn = function(group, button) {
            var $group = $('#' + group);
            
            $group.find('.btn').removeClass('--show').addClass('--hide');
            
            if ($group.hasClass('--loading')) {
                $group.find('[data-name="' + button + '"]').removeClass('--hide');
            } else {
                $group.find('[data-name="' + button + '"]').removeClass('--hide').addClass('--show').on(CssEvents.transitionEvent(), function() {
                    $(this).off(CssEvents.transitionEvent()).removeClass('--show');
                });
            }
        };
        
        this.btnGroupLoading = function(group) {
            $('#' + group).addClass('--loading');
        };
        
        this.btnGroupLoaded = function(group) {
            $('#' + group).removeClass('--loading');
        };
        
        this.makeSelectable = function() {
            app.Page.getContent().selectable({
                filter: '.draggable, .editable, .resizable'
            });
        };
        
        this.removeSelectable = function() {
            app.Page.getContent().selectable('destroy');
        };
        
        this.makeDraggable = function() {
            $draggables = app.Page.getContent().find('.draggable');
            
            $draggables.draggable({
                cursor: "move",
                stop: function(event, ui) {
                    var $el = $(event.target);
                    var top = parseInt($el.css('top'));
                    var left = parseInt($el.css('left'));
                    
                    if ($el.is('[class*=push-down]')) {
                        var push_down = Math.round(top / 16);
                        
                        $el.removeClass(function(index, css) {
                            return (css.match(/\bpush-down\S+/g) || []).join(' ');
                        });
                        
                        $el.addClass('push-down-' + push_down);
                    } else {
                        var bottom = 624 - top - $el.outerHeight();
                        var pull_up = Math.round(bottom / 16);
                        
                        $el.removeClass(function(index, css) {
                            return (css.match(/\bpull-up\S+/g) || []).join(' ');
                        });
                        
                        $el.addClass('pull-up-' + pull_up);
                    }
                    
                    if($el.is('[class*=push-right]')){
                        var push_right = Math.round(left / 19);
                        
                        $el.removeClass(function(index, css) {
                            return (css.match(/\bpush-right\S+/g) || []).join(' ');
                        });
                        
                        $el.addClass('push-right-' + push_right);
                    } else {
                        var right = 950 - left - $el.outerWidth();
                        var pull_left = Math.round(right / 19);
                        
                        $el.removeClass(function(index, css) {
                            return (css.match (/\bpull-left-\S+/g) || []).join(' ');
                        });
                        
                        $el.addClass('pull-left-' + pull_left);
                    }
                },
                grid: [19, 16]
            });
        };
        
        this.removeDraggable = function() {
            $draggables.draggable('destroy');
        };
    }
    
    app.modules.UI = UI;
})(window, jQuery, MagTool, CssEvents);
