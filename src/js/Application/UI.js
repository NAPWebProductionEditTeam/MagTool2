(function(window, $, app, CssEvents) {
    function UI() {
        var $draggables;
        var $selected = $([]);
        var offset = {top: 0, left: 0};
        
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
        
        var select = function(el) {
            $selected = $selected.add(el);
            $(el).addClass('ui-selected');
        };
        
        this.makeSelectable = function() {
            var $content = app.Page.getContent();
            var $selectables = $content.find('.draggable, .editable, .resizable');
            
            $content.selectable({
                filter: '.draggable, .editable, .resizable',
                selected: function(e, ui) {
                    select(ui.selected);
                },
                unselected: function(e, ui) {
                    $selected = $selected.not(ui.unselected);
                }
            });
            
            $selectables.data('click', function(e) {
                var $this = $(this);
                
                if (e.metaKey) {
                    if ($this.hasClass('ui-selected')) {
                        $this.removeClass('ui-selected');
                    } else {
                        $this.addClass('ui-selecting');
                    }
                } else {
                    $content.find('.ui-selected').removeClass('ui-selected');
                    $selected = $([]);
                    $this.addClass('ui-selecting');
                }
                
                $content.selectable('instance')._mouseStop(null);
            });
            
            $selectables.click($selectables.data('click'));
        };
        
        this.removeSelectable = function() {
            var $content = app.Page.getContent();
            var $selectables = $content.find('.draggable, .editable, .resizable');
            
            $content.selectable('destroy');
            $selectables.unbind('click', $selectables.data('click'));
        };
        
        this.makeDraggable = function() {
            $draggables = app.Page.getContent().find('.draggable');
            
            $draggables.draggable({
                cursor: "move",
                start: function(e, ui) {
                    var $this = $(this);
                    
                    if ($this.hasClass('ui-selected')) {
                        $selected = $selected.filter('.draggable').each(function() {
                            var $this = $(this);
                            
                            $this.data('offset', $this.position());
                        });
                        
                        window.$selected = $selected;
                    } else {
                        $selected = $([]);
                        $this.data('offset', $this.position());
                        app.Page.getContent().find('.ui-selected').removeClass('ui-selected');
                    }
                    
                    select($this);
                },
                drag: function(e, ui) {
                    var $this = $(this);
                    var drag = {
                        top: ui.position.top - $this.data('offset').top,
                        left: ui.position.left - $this.data('offset').left,
                    };
                    
                    $selected.not($this).filter('.draggable').each(function() {
                        var $this = $(this);
                        
                        $this.addClass('ui-draggable-dragging').css({top: $this.data('offset').top + drag.top, left: $this.data('offset').left + drag.left});
                    });
                },
                stop: function(e, ui) {
                    $selected.each(function() {
                        var $this = $(this);
                        var top = parseInt($this.css('top'));
                        var left = parseInt($this.css('left'));
                        
                        if ($this.is('[class*=push-down]')) {
                            var push_down = Math.round(top / 16);
                            
                            $this.removeClass(function(index, css) {
                                return (css.match(/\bpush-down\S+/g) || []).join(' ');
                            });
                            
                            $this.addClass('push-down-' + push_down);
                        } else {
                            var bottom = 624 - top - $this.outerHeight();
                            var pull_up = Math.round(bottom / 16);
                            
                            $this.removeClass(function(index, css) {
                                return (css.match(/\bpull-up\S+/g) || []).join(' ');
                            });
                            
                            $this.addClass('pull-up-' + pull_up);
                        }
                        
                        if($this.is('[class*=push-right]')){
                            var push_right = Math.round(left / 19);
                            
                            $this.removeClass(function(index, css) {
                                return (css.match(/\bpush-right\S+/g) || []).join(' ');
                            });
                            
                            $this.addClass('push-right-' + push_right);
                        } else {
                            var right = 950 - left - $this.outerWidth();
                            var pull_left = Math.round(right / 19);
                            
                            $this.removeClass(function(index, css) {
                                return (css.match (/\bpull-left-\S+/g) || []).join(' ');
                            });
                            
                            $this.addClass('pull-left-' + pull_left);
                        }
                    }).removeClass('ui-draggable-dragging');
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
