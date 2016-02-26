(function(window, Math, $, app, Medium) {
    var parseInt = window.parseInt;
    var parseFloat = window.parseFloat;
    var document = window.document;
    
    function ContentEditor() {
        var editing = false;
        var $img_map;
        
        /**
         * Editor status.
         */
        this.startEdit = function() {
            var map = app.Page.getContent().find('map');
            
            $img_map = map.clone(true, true);
            map.remove();
            
            editing = true;
            app.Page.get().addClass('mt-editing');
            
            this.makeDraggable();
            this.makeResizable();
            this.makeSelectable();
            this.makeEditable();
        };
        
        this.applyEdit = function($el) {
            this.applyDraggable($el);
            this.applyResizable($el);
            this.applySelectable($el);
        };
        
        this.stopEdit = function() {
            this.removeSelectable();
            this.removeResizable();
            this.removeDraggable();
            
            app.Page.getContent().append($img_map);
            $img_map = null;
            
            editing = false;
            app.Page.get().removeClass('mt-editing');
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
            
            if (! $selection.length) {
                return 'none';
            }
            
            $selection.each(function() {
                var $this = $(this);
                
                if ($this.find('img').length) {
                    types.push('image');
                } else if ($this.filter('[class*="creditsWhole"]').length) {
                    types.push('credits');
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
        var $selectable, $selected, $selectables, $draggables, $resizables, $editables;
        $selected = $selectables = $draggables = $resizables = $editables = $([]);
        
        var triggerSelectable = function() {
            var selectable = $selectable.selectable('instance');
            
            if (selectable) {
                $selectable.selectable('instance')._mouseStop(null);
            }
        };
        
        this.select = function($el) {
            $el.addClass('ui-selecting');
            triggerSelectable();
        };
        
        this.deselectAll = function() {
            $selected.removeClass('ui-selected');
            triggerSelectable();
        };
        
        var deselect = function($el) {
            $el.removeClass('ui-selected');
            triggerSelectable();
        };
        
        var addSelected = function(el) {
            $selected = $selected.add(el);
            $(el).addClass('ui-selected');
        };
        
        this.applySelectable = function($el) {
            $selectables.add($el);
            
            if ($el.length) {
                $el.click(function(e) {
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
                    
                    app.ContentEditor.select($this);
                });
            }
        };
        
        this.makeSelectable = function() {
            var selectableSelector = '.draggable, .editable, .resizable, [class*="creditsWhole"]';
            
            $selectable = app.Page.getContent();
            
            $selectable.selectable({
                filter: selectableSelector,
                cancel: '[class*="creditsHolder"]',
                selected: function(e, ui) {
                    addSelected(ui.selected);
                },
                unselected: function(e, ui) {
                    $selected = $selected.not(ui.unselected);
                },
                stop: function() {
                    app.resolveAction('updateUI');
                }
            });
            
            this.applySelectable($selectable.find(selectableSelector));
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
        
        this.applyDraggable = function($el) {
            $draggables.add($el);
            
            if ($el.length) {
                $el.draggable({
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
                        }).removeClass('ui-draggable-dragging').removeAttr('style');
                    },
                    grid: [19, 16]
                });
            }
        };
        
        this.makeDraggable = function() {
            this.applyDraggable(app.Page.getContent().find('.draggable'));
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
        
        this.move = function(axis, ticks) {
            var $selection = this.getSelection();
            var maxCols = 50.75;
            var maxRows = 39.75;
            
            if (typeof ticks === 'undefined') {
                ticks = .25;
            } else {
                ticks = ticks / 4;
            }
            
            $selection.each(function() {
                var $el = $(this);
                var dir, current, result, affix, newClass;
                
                if (axis === 'y') {
                    dir = $el.attr('class').replace(/.*(?:push|pull)-(up|down)-.*/, '$1');
                    current = parseFloat(
                        $el.attr('class')
                            .replace(/.*(?:push|pull)-(?:up|down)-(\d+(?:-[a-c])?).*/, '$1')
                            .replace('-a', '.25')
                            .replace('-b', '.5')
                            .replace('-c', '.75')
                        );
                    
                    result = dir === 'down' ? (current - ticks) : (current + ticks);
                    result = Math.min(result, maxRows);
                    result = Math.max(result, 0);
                    
                    affix = result.toString().replace('.25', '-a').replace('.5', '-b').replace('.75', '-c');
                    newClass = $el.attr('class').replace(/(push|pull)-(up|down)-\d+(?:-[a-c])?/, '$1-$2-' + affix);
                    
                    $el.attr('class', newClass);
                } else {
                    dir = $el.attr('class').replace(/.*(?:push|pull)-(left|right)-.*/, '$1');
                    current = parseFloat(
                        $el.attr('class')
                            .replace(/.*(?:push|pull)-(?:left|right)-(\d+(?:-[a-c])?).*/, '$1')
                            .replace('-a', '.25')
                            .replace('-b', '.5')
                            .replace('-c', '.75')
                        );
                    
                    result = dir === 'left' ? (current - ticks) : (current + ticks);
                    result = Math.min(result, maxCols);
                    result = Math.max(result, 0);
                    
                    affix = result.toString().replace('.25', '-a').replace('.5', '-b').replace('.75', '-c');
                    newClass = $el.attr('class').replace(/(push|pull)-(left|right)-\d+(?:-[a-c])?/, '$1-$2-' + affix);
                    
                    $el.attr('class', newClass);
                }
            });
        };
        
        this.applyResizable = function($el) {
            $resizables.add($el);
            
            if ($el.length) {
                $el.resizable({
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
                        
                        $this.removeAttr("style");
                    }
                });
            }
        };
        
        this.makeResizable = function() {
            this.applyResizable(app.Page.getContent().find('.resizable'));
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
            app.ContentEditor.select($el);
            
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
        
        window.startEdit = startEditing;
        
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
            
            app.ContentEditor.select($el);
        };
        
        this.applyEditable = function($el) {
            console.log('apply edi');
            $editables.add($el);
            
            $el.dblclick(function(e) {
                var $this = $(this);
                console.log("CLICK OCCUREEDEJSFHSDGKDSJG");

                // If we are currently editing a different element,
                // stop editing it.
                if ($editing) {
                    stopEditing($editing);
                }
                
                $this.off('dblclick');
                startEditing($this);
            });
        };
        
        this.makeEditable = function() {
            console.log('make edi');
            this.applyEditable(app.Page.getContent().find('.editable'));
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
