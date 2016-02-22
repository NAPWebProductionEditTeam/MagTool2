(function(window, Math, $, app, Medium) {
    var parseInt = window.parseInt;
    var document = window.document;
    
    function ContentEditor() {
        var editing = false;
        
        /**
         * Editor status.
         */
        this.startEdit = function() {
            editing = true;
            
            app.UI.enable(app.UI.getPageControls());
            
            this.makeDraggable();
            this.makeResizable();
            this.makeSelectable();
        };
        
        this.stopEdit = function() {
            this.removeSelectable();
            this.removeResizable();
            this.removeDraggable();
            
            editing = false;
        };
        
        this.isEditing = function() {
            return editing;
        };
        
        this.getSelection = function() {
            return app.Page.get().find('.ui-selected');
        };
        
        this.getSelectionType = function() {
            var $selection = this.getSelection();
            var types = [];
            
            $selection.each(function() {
                var $this = $(this);
                
                if ($this.find('img').length) {
                    types.push('image');
                } else {
                    types.push('text');
                }
            });
            
            types = $.unique(types);
            
            if (types.length === 1) {
                return types[0];
            }
            
            return 'mixed';
        };
        
        /**
         * Content interactions.
         */
        var $selectable, $selectables, $draggables, $resizables;
        var $selected = $([]);
        
        var select = function($el) {
            $el.addClass('ui-selecting');
            $selectable.selectable('instance')._mouseStop(null);
        };
        
        var deselect = function($el) {
            $el.removeClass('ui-selected');
            $selectable.selectable('instance')._mouseStop(null);
        };
        
        var addSelected = function(el) {
            $selected = $selected.add(el);
            $(el).addClass('ui-selected');
        };
        
        this.makeSelectable = function() {
            $selectable = app.Page.getContent();
            $selectables = $selectable.find('.draggable, .editable, .resizable');
            
            $selectable.selectable({
                filter: '.draggable, .editable, .resizable',
                selected: function(e, ui) {
                    addSelected(ui.selected);
                    
                    app.UI.getSelectionSection().find('.selection').removeClass('--active');
                    
                    var type = app.ContentEditor.getSelectionType();
                    var $selectionEditor = $('#' + type + 'Selection');
                    
                    if ($selectionEditor.length) {
                        $selectionEditor.addClass('--active');
                    }

                    app.TextEditor.detectSelectedAlignment();
                },
                unselected: function(e, ui) {
                    $selected = $selected.not(ui.unselected);
                }
            });
            
            $selectables.click(function(e) {
                var $this = $(this);
                
                // win ctrl || OS X cmd || shift
                if (e.ctrlKey || e.metaKey || e.shiftKey) {
                    if ($this.hasClass('ui-selected')) {
                        return deselect($this);
                    }
                } else {
                    $selectable.find('.ui-selected').removeClass('ui-selected');
                    $selected = $([]);
                }
                
                select($this);
            });
        };
        
        this.removeSelectable = function() {
            deselect($selectables);
            $selectables.off('click');
            
            if ($selectable.is('.ui-selectable')) {
                $selectable.selectable('destroy');
            }
        };
        
        this.getSelectedElements = function() {
            return app.Page.get().find('.ui-selected');
        };
        
        var changeXPos = function($this) {
            var left = parseInt($this.css('left'));
            
            if ($this.is('[class*=push-right]')) {
                var push_right = Math.round(left / 19);
                
                $this.removeClass(function(index, css) {
                    return (css.match(/\bpush-right\S+/g) || []).join(' ');
                });
                
                $this.addClass('push-right-' + push_right);
            } else {
                var right = 950 - left - $this.outerWidth();
                var pull_left = Math.round(right / 19);
                
                $this.removeClass(function(index, css) {
                    return (css.match(/\bpull-left-\S+/g) || []).join(' ');
                });
                
                $this.addClass('pull-left-' + pull_left);
            }
        };
        
        this.makeDraggable = function() {
            $draggables = app.Page.getContent().find('.draggable');
            
            $draggables.draggable({
                cursor: "move",
                start: function(e, ui) {
                    var $this = $(this);
                    
                    stopEditing($this);
                    
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
                    
                    addSelected($this);
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
                        
                        changeXPos($this);
                    }).removeClass('ui-draggable-dragging');
                },
                grid: [19, 16]
            });
        };
        
        this.enableDraggable = function($el) {
            if (typeof $el !== 'undefined') {
                return $el.draggable('enable');
            }
            
            $draggables.filter('.ui-draggable').draggable('enable');
        };
        
        this.disableDraggable = function($el) {
            if (typeof $el !== 'undefined') {
                return $el.draggable('disable');
            }
            
            $draggables.filter('.ui-draggable').draggable('disable');
        };
        
        this.removeDraggable = function($el) {
            $draggables.filter('.ui-draggable').draggable('destroy');
        };
        
        this.makeResizable = function() {
            $resizables = app.Page.getContent().find('.resizable');
            
            if ($resizables.length) {
                $resizables.resizable({
                    handles: 'e, w',
                    grid: [19, 10],
                    start: function() {
                        stopEditing($(this));
                    },
                    stop: function() {
                        var $this = $(this);
                        var width = parseInt($this.css('width'));
                        
                        if ($(this).is('[class*=span]')) {
                            var span = Math.round(width / 19);
                            
                            $this.removeClass(function(index, css) {
                                return (css.match(/\bspan-\S+/g) || []).join(' ');
                            });
                            
                            $this.addClass('span-' + span);
                        }
                        
                        changeXPos($this);
                        
                        $resizables.removeAttr("style");
                    }
                });
            }
        };
        
        this.enableResizable = function($el) {
            if (typeof $el !== 'undefined') {
                return $el.resizable('enable');
            }
            
            $resizables.filter('.ui-resizable').resizable('enable');
        };
        
        this.disableResizable = function($el) {
            if (typeof $el !== 'undefined') {
                return $el.resizable('disable');
            }
            
            $resizables.filter('.ui-resizable').resizable('disable');
        };
        
        this.removeResizable = function() {
            $resizables.filter('.ui-resizable').resizable('destroy');
        };
        
        var editor, $editing;
        
        var makeEditor = function(selector) {
            return new Medium.editor(selector, {
                disableExtraSpaces: true,
                toolbar: {
                    buttons: [
                        'b',
                        'i',
                        'anchor',
                        'h2',
                        'h3',
                        'h4',
                        'h5',
                        'span',
                        'case'
                    ]
                },
                extensions: {
                    'b': new Medium.button({
                        label: '<b>B</b>',
                        start: '<strong>',
                        end: '</strong>'
                    }),
                    'i': new Medium.button({
                        label: '<b><i>I</i></b>',
                        start: '<em>',
                        end: '</em>'
                    }),
                    'span': new Medium.button({
                        label: '<b>span</b>',
                        start: '<span>',
                        end: '</span>'
                    }),
                    'case': new Medium.button({
                        label: '<b>Aa</b>',
                        start: '<span class="upperCase">',
                        end: '</span>'
                    })
                }
            });
        };
        
        var startEditing = function($el) {
            deselect($selectables);
            select($el);
            
            if ($el.find('.dropcap3')) {
                var $dropcap = $el.find('.dropcap3');
                var classes = [];
                
                if ($dropcap.data('class')) {
                    classes = $dropcap.data('class').split(' ');
                }
                
                classes.push('dropcap3');
                
                $dropcap.attr('data-class', classes.join(' ')).removeClass('dropcap3');
            }
            
            app.ContentEditor.disableDraggable($el);
            app.ContentEditor.disableResizable($el);
            app.ContentEditor.removeSelectable();
            
            editor = window.editor = makeEditor($el);
            $el.click(); // trigger a click to make sure it has focus.
            editor.selectElement(editor.getFocusedElement()); // Now select the element that has focus et voilá!
            
            $(document).data('click', function(e) {
                if (! $editing) {
                    return;
                }
                
                var $target = $(e.target);
                var $medium = $('[id*=medium-]');
                var stop = true;
                
                if ($target.is($el) || $.contains($el.get(0), e.target)) {
                    stop = false;
                }
                
                for (var i = 0; i < $medium.length; i++) {
                    if ($.contains($medium.get(i), e.target)) {
                        stop = false;
                        
                        break;
                    }
                }
                
                if (stop) {
                    stopEditing();
                }
            });
            $(document).click($(document).data('click'));
            
            $editing = $el;
        };
        
        var stopEditing = function() {
            if (! $editing) {
                return;
            }
            
            var $el = $editing;
            
            window.getSelection().collapseToStart();
            editor.destroy();
            $editing = null;
            
            $(document).off('click', $(document).data('click'));
            
            $el.find('[data-class]').each(function() {
                var $child = $(this);
                
                $child.addClass($child.data('class'));
            });
            
            app.ContentEditor.enableDraggable($el);
            app.ContentEditor.enableResizable($el);
            app.ContentEditor.makeSelectable();
            app.ContentEditor.makeEditable();
            
            select($el);
        };
        
        this.makeEditable = function() {
            $('.editable').dblclick(function(e) {
                var $this = $(this);
                
                // If we are currently editing a different element,
                // stop editing it.
                stopEditing($this);
                
                $this.off('dblclick');
                startEditing($this);
            });
        };
        
        this.removeEditable = function() {
            window.getSelection().collapseToStart();
            editor.destroy();
            $editing = null;
            
            $('.editable').off('dblclick');
            $('.editable').off('blur');
        };
    }
    
    app.modules.ContentEditor = ContentEditor;
})(window, Math, jQuery, MagTool, {editor: MediumEditor, button: MediumButton});
