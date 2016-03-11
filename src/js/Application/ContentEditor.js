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
        
        this.applyInteractions = function($el) {
            this.applyDraggable($el);
            this.applyResizable($el);
            this.applySelectable($el);
            this.applyEditable($el);
        };
        
        this.stopEdit = function() {
            this.removeSelectable();
            this.removeResizable();
            this.removeDraggable();
            this.removeEditable();
            
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
                } else if ($this.filter('.videoHolder').length) {
                    types.push('video');
                } else if ($this.is('.btnShopThe') || $this.find('.btnShopThe').length) {
                    types.push('cta');
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
        
        this.sort = function($elements) {
            return $elements.sort(function(a, b) {
                a = $(a).offset();
                b = $(b).offset();
                
                if (a.top == b.top) {
                    if (a.left == b.left) {
                        return 0;
                    }
                    
                    if (a.left > b.left) {
                        return 1;
                    }
                    
                    return -1;
                }
                
                if (a.top > b.top) {
                    return 1;
                }
                
                return -1;
            });
        };
        
        /**
         * Content interactions.
         */
        var $selectable, $selected, $selectables, $draggables, $resizables, $editables;
        $selected = $selectables = $draggables = $resizables = $editables = $([]);
        
        var callWidgetFunction = function($elements, widget, func, args) {
            if (! $elements.length) {
                return;
            }
            
            if (typeof args === 'undefined') {
                args = [];
            }
            
            if (func === 'instance') {
                return $elements[widget]('instance');
            }
            
            args.unshift(func);
            
            $elements.each(function() {
                var $this = $(this);
                
                if (typeof $this[widget]('instance') !== 'undefined') {
                    $this[widget].apply($this, args);
                }
            });
        };
        
        var triggerSelectable = function() {
            var selectable = callWidgetFunction($selectable, 'selectable', 'instance');
            
            if (selectable) {
                selectable._mouseStop(null);
            }
        };
        
        this.select = function($el) {
            $el.addClass('ui-selecting');
            triggerSelectable();
        };
        
        this.selectOnly = function($el) {
            this.deselect($selected.not($el));
            
            if (this.getSelectedElements().filter($el).length) {
                this.select($el);
            }
        };
        
        this.selectNext = function() {
            var $tabbable = $selectables.not(app.Credits.getCredits());
            var $last = this.getSelectedElements().last();
            var index = $tabbable.index($last) + 1;
            
            if (index >= $tabbable.length) {
                index = 0;
            }
            
            var $select = $($tabbable.get(index));
            
            this.deselectAll();
            this.select($select);
        };
        
        this.selectPrev = function() {
            var $tabbable = $selectables.not(app.Credits.getCredits());
            var $first = this.getSelectedElements().first();
            var index = $tabbable.index($first) - 1;
            
            if (index < 0) {
                index = $tabbable.length - 1;
            }
            
            var $select = $($tabbable.get(index));
            
            this.deselectAll();
            this.select($select);
        };
        
        this.remove = function($el) {
            $el.remove();
        };

        this.deselect = function($el) {
            $el.removeClass('ui-selected');
            triggerSelectable();
        };
        
        this.deselectAll = function() {
            $selected.removeClass('ui-selected');
            $selected = $([]);
            triggerSelectable();
        };
        
        var addSelected = function(el) {
            $selected = app.ContentEditor.sort($selected.add(el));
            $(el).addClass('ui-selected');
        };
        
        this.applySelectable = function($el, refresh) {
            if (typeof refresh === 'undefined') {
                refresh = true;
            }
            
            $selectables = app.ContentEditor.sort($selectables.add($el));
            
            if ($el.length) {
                $el.click(function(e) {
                    var $this = $(this);
                    
                    // win ctrl || OS X cmd || shift
                    if (e.ctrlKey || e.metaKey || e.shiftKey) {
                        if ($this.hasClass('ui-selected')) {
                            return app.ContentEditor.deselect($this);
                        }
                    } else {
                        $selectable.find('.ui-selected').removeClass('ui-selected');
                        $selected = $([]);
                    }
                    
                    app.ContentEditor.select($this);
                });
            }
            
            if (refresh) {
                callWidgetFunction($selectable, 'selectable', 'refresh');
            }
        };
        
        this.makeSelectable = function() {
            var selectableSelector = '.draggable, .editable, .resizable, [class*="creditsWhole"]';
            
            $selectable = app.Page.getContent();
            
            $selectable.selectable({
                filter: selectableSelector,
                cancel: '[class*="creditsHolder"]',
                start: function() {
                    app.UI.getAllControls().blur();
                },
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
            
            this.applySelectable($selectable.find(selectableSelector), false);
        };
        
        this.removeSelectable = function() {
            if (typeof $selectable !== 'undefined') {
                app.ContentEditor.deselect($selectables);
                $selectables.off('click');
                
                callWidgetFunction($selectable, 'selectable', 'destroy');
            }
        };
        
        this.getSelectedElements = function() {
            return this.sort(app.Page.get().find('.ui-selected'));
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
            $draggables = $draggables.add($el);
            
            if ($el.length) {
                $el.draggable({
                    cursor: "move",
                    start: function(e, ui) {
                        var $this = $(this);
                        
                        app.ContentEditor.stopEditing();
                        
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
                                var push_down = Math.round(top / 16).toString();
                                push_down += (Math.round(top / 4) / 4).toString()
                                    .replace(/^\d+/, '')
                                    .replace('.25', '-a')
                                    .replace('.5', '-b')
                                    .replace('.75', '-c');
                                
                                $this.removeClass(function(index, css) {
                                    return (css.match(/\bpush-down\S+/g) || []).join(' ');
                                });
                                
                                $this.addClass('push-down-' + push_down);
                            } else {
                                var bottom = 624 - top - $this.outerHeight();
                                var pull_up = Math.round(bottom / 16);
                                pull_up += (Math.round(bottom / 4) / 4).toString()
                                    .replace(/^\d+/, '')
                                    .replace('.25', '-a')
                                    .replace('.5', '-b')
                                    .replace('.75', '-c');
                                
                                $this.removeClass(function(index, css) {
                                    return (css.match(/\bpull-up\S+/g) || []).join(' ');
                                });
                                
                                $this.addClass('pull-up-' + pull_up);
                            }
                            
                            changeXPos($this);
                        }).removeClass('ui-draggable-dragging').removeAttr('style');
                    },
                    grid: [19, 4]
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
            
            callWidgetFunction($draggables, 'draggable', 'enable');
        };
        
        this.disableDraggable = function($el) {
            if (typeof $el !== 'undefined') {
                return $el.draggable('disable');
            }
            
            callWidgetFunction($draggables, 'draggable', 'disable');
        };
        
        this.removeDraggable = function($el) {
            callWidgetFunction($draggables, 'draggable', 'destroy');
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
            var $filtered = $el.not('.videoHolder');
            var $videos = $el.filter('.videoHolder');
            
            $resizables = $resizables.add($el);
            
            if ($filtered.length) {
                $filtered.resizable({
                    handles: 'e, w',
                    grid: [19, 10],
                    start: function() {
                        app.ContentEditor.stopEditing();
                    },
                    stop: function() {
                        var $this = $(this);
                        var width = parseInt($this.css('width'));
                        
                        if ($this.is('[class*=span]')) {
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
            
            if ($videos.length) {
                $videos.resizable({
                    handles: 'ne, se, sw, nw',
                    grid: [19, 10],
                    start: function() {
                        app.ContentEditor.stopEditing();
                    },
                    resize: function() {
                        var $this = $(this);
                        
                        if ($this.is('[class*=span]')) {
                            var w = $this.width();
                            var h = Math.ceil(w * (9 / 16));
                            
                            $this.height('').find('.videoLoader, .video-js').css({width: w, height: h});
                        }
                    },
                    stop: function() {
                        var $this = $(this);
                        var width = parseInt($this.css('width'));
                        
                        changeXPos($this);
                        $this.removeAttr('style');
                        
                        if ($this.is('[class*=span]')) {
                            var span = Math.round(width / 19);
                            
                            $this.removeClass(function(index, css) {
                                return (css.match(/\bspan-\S+/g) || []).join(' ');
                            });
                            
                            $this.addClass('span-' + span);
                            
                            var w = $this.width();
                            var h = Math.ceil(w * (9 / 16));
                            
                            $this.find('.videoLoader, .video-js').css({width: w, height: h});
                            
                            var $videojs = $this.nextAll('script').first();
                            $videojs.html($videojs.html().replace(/width: "\d+"/, 'width: "' + w + '"').replace(/height: "\d+"/, 'height: "' + h + '"'));
                        }
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
            
            callWidgetFunction($resizables, 'resizable', 'enable');
        };
        
        this.disableResizable = function($el) {
            if (typeof $el !== 'undefined') {
                return $el.resizable('disable');
            }
            
            callWidgetFunction($resizables, 'resizable', 'disable');
        };
        
        this.removeResizable = function() {
            callWidgetFunction($resizables, 'resizable', 'destroy');
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
        
        this.startEditing = function($el) {
            if (! $el.length) {
                return;
            }
            
            $el = $el.first();
            
            app.ContentEditor.deselectAll($selectables);
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
                    app.ContentEditor.stopEditing();
                }
            });
            $(document).click($(document).data('click'));
            
            $editing = $el;
        };
        
        this.stopEditing = function() {
            if (! $editing) {
                return;
            }
            
            var $el = $editing;
            var selection = window.getSelection();
            
            if (! selection.isCollapsed) {
                selection.collapseToStart();
            }
            
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
            $editables = $editables.add($el);
            
            $el.dblclick(function(e) {
                var $this = $(this);
                
                // If we are currently editing a different element,
                // stop editing it.
                if ($editing) {
                    app.ContentEditor.stopEditing();
                }
                
                $this.off('dblclick');
                app.ContentEditor.startEditing($this);
            });
        };
        
        this.makeEditable = function() {
            this.applyEditable(app.Page.getContent().find('.editable'));
        };
        
        this.removeEditable = function() {
            var selection = window.getSelection();
            
            if (! selection.isCollapsed) {
                selection.collapseToStart();
            }
            
            if (typeof editor !== 'undefined') {
                editor.destroy();
            }
            
            $editing = null;
            $('.editable').off('dblclick');
            $('.editable').off('blur');
        };
    }
    
    app.modules.ContentEditor = ContentEditor;
})(window, Math, jQuery, MagTool, {editor: MediumEditor, button: MediumButton});
