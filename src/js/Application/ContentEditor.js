(function(window, $, app) {
    function ContentEditor() {
        var $html;
        var $draggables;
        var $selected = $([]);
        
        var editing = false;
        
        var getHtml = function() {
            if (typeof $html === 'undefined' || ! $html.length) {
                $html = $('#html');
            }
            
            return $html;
        };
        
        var clearHtml = function() {
            getHtml().html('');
        };
        
        this.startEdit = function() {
            editing = true;
            
            app.UI.makeDraggable();
            app.UI.makeSelectable();
        };
        
        this.stopEdit = function() {
            app.UI.removeSelectable();
            app.UI.removeDraggable();
            
            editing = false;
        };
        
        this.isEditing = function() {
            return editing;
        };
        
        this.cleanUp = function() {
            app.Page.get().find('[style]:not(.videoLoader):not(object)').removeAttr('style');
            app.Page.get().find('[contenteditable], [aria-disabled], [data-mtifont], .ui-resizable, .onEdit')
                .removeClass('onEdit ui-resizable')
                .removeAttr('contenteditable aria-disabled data-mtifont');
        };
        
        this.getCreditsHtml = function() {
            clearHtml();
            
            app.Page.get().find('[class^="credits"]').clone().appendTo(getHtml());
            
            return getHtml().html();
        };
        
        this.getContentHtml = function() {
            clearHtml();
            
            app.Page.get()
                .find('.magazineContent div:not([class^="credits"]):not(.edLetterList):not(.videoHolder)').clone().appendTo($html);
            
            return $html.html();
        };
        
        this.getVideoHtml = function() {
            clearHtml();
            
            app.Page.get().find('.videoHolder #videojs').clone().appendTo($html);
            
            return $html.html();
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
                
                if (e.metaKey|| e.shiftKey) {
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
            
            if ($content.is('ui-selectable')) {
                var $selectables = $content.find('.draggable, .editable, .resizable');
                
                $content.selectable('destroy');
                $selectables.unbind('click', $selectables.data('click'));
            }
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
            $draggables.filter('ui-draggable').draggable('destroy');
        };
        
        this.makeResizable = function() {
            
        };
        
        this.removeResizable = function() {
            
        };
        
        this.makeEditable = function() {
            
        };
        
        this.removeEditable = function() {
            
        };
    }
    
    app.modules.ContentEditor = ContentEditor;
})(window, jQuery, MagTool);
