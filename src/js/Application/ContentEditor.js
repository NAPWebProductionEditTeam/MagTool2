(function(window, $, app, Argument, Medium) {
    var parseInt = window.parseInt;
    var parseFloat = window.parseFloat;
    var document = window.document;
    var RegExp = window.RegExp;
    var Math = window.Math;
    var Node = window.Node;
    
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
            app.$body.addClass('mt-editing');
            
            this.makeSelectable();
            this.makeDraggable();
            this.makeResizable();
            this.makeEditable();
        };
        
        this.applyInteractions = function($el) {
            this.applySelectable($el);
            this.applyDraggable($el);
            this.applyResizable($el);
            this.applyEditable($el);
        };
        
        this.stopEdit = function() {
            this.removeEditable();
            this.removeResizable();
            this.removeDraggable();
            this.removeSelectable();
            
            app.Page.getContent().append($img_map);
            $img_map = null;
            
            editing = false;
            app.$body.removeClass('mt-editing');
        };
        
        this.isEditing = function() {
            return editing;
        };
        
        this.getSelection = function() {
            return this.sort(app.Page.get().find('.ui-selected'));
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
                } else if ($this.is(app.CTA)) {
                    types.push('cta');
                } else if ($this.filter('[class*="creditsWhole"]').length) {
                    types.push('credits');
                } else {
                    types.push('text');
                }
            });
            
            types = $.unique(types);
            
            if (types.length === 1) {
                if ($selection.length === 1) {
                    return types[0];
                }
                
                return 'multi' + types[0].ucfirst();
            }
            
            return 'mixed';
        };
        
        this.sort = function($elements) {
            return $elements.sort(function(a, b) {
                a = $(a).offset();
                b = $(b).offset();
                
                if (a.left == b.left) {
                    if (a.top == b.top) {
                        return 0;
                    }
                    
                    if (a.top > b.top) {
                        return 1;
                    }
                    
                    return -1;
                }
                
                if (a.left > b.left) {
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
            args = Argument.default(args, []);
            
            if (! $elements.length) {
                return;
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
            
            if (! this.getSelection().filter($el).length) {
                this.select($el);
            }
        };
        
        this.selectNext = function() {
            var $tabbable = $selectables.not(app.Credits.getCredits());
            var $last = this.getSelection().last();
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
            var $first = this.getSelection().first();
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
            refresh = Argument.default(refresh, true);
            
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
        
        var uiSelectableCancel = '[class*="creditsHolder"], [data-medium-focused="true"], .ui-resizable-handle';
        
        this.makeSelectable = function() {
            var selectableSelector = '.draggable, .editable, .resizable, [class*="creditsWhole"]';
            
            $selectable = app.Page.getContent();
            
            $selectable.selectable({
                filter: selectableSelector,
                cancel: uiSelectableCancel,
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
        
        this.enableSelectable = function($el) {
            callWidgetFunction($selectable, 'selectable', 'option', ['cancel', uiSelectableCancel]);
            callWidgetFunction($selectable, 'selectable', 'enable');
            
            if (typeof $el !== 'undefined') {
                this.applySelectable($el);
            }
        };
        
        this.disableSelectable = function($el) {
            if (typeof $el !== 'undefined') {
                $el.off('click');
            }
            
            callWidgetFunction($selectable, 'selectable', 'option', ['cancel', '*']);
            callWidgetFunction($selectable, 'selectable', 'disable');
        };
        
        this.removeSelectable = function() {
            if (typeof $selectable !== 'undefined') {
                app.ContentEditor.deselect($selectables);
                $selectables.off('click');
                
                callWidgetFunction($selectable, 'selectable', 'destroy');
            }
        };
        
        var getPos = function(pos, grid, max) {
            pos = Math.max(pos, 0);
            pos = Math.min(pos, max);
            
            return Math.floor(pos / grid).toString() + (Math.round(pos / 4) / 4).toString()
                .replace(/^\d+/, '')
                .replace('.25', '-a')
                .replace('.5', '-b')
                .replace('.75', '-c');
        };
        
        var changePos = function($el, axis, anchor, grid, max) {
            anchor = Argument.default(anchor, false);
            
            var push, pull, master, slave;
            
            if (axis === 'x') {
                push = 'right';
                pull = 'left';
                
                master = 'left';
                slave = 'right';
            } else {
                push = 'down';
                pull = 'up';
                
                master = 'top';
                slave = 'bottom';
            }
            
            if (! anchor) {
                anchor = $el.is('[class*=push-' + push + ']') ? master : slave;
            }
            
            var $parent = $el.offsetParent();
            var offsetMaster, offsetSlave, size;
            
            offsetMaster = $el.offset()[master] - $parent.offset()[master];
            
            $el.removeClass(function(index, css) {
                var regex = new RegExp('\\b(?:push|pull)-(?:' + push + '|' + pull + ')-\\S+', 'g');
                
                return (css.match(regex) || []).join(' ');
            });
            
            if (anchor === master) {
                $el.addClass('push-' + push + '-' + getPos(offsetMaster, grid, max));
            } else {
                size = axis === 'x' ? $el.outerWidth() : $el.outerHeight();
                offsetSlave = max - offsetMaster - size;
                
                $el.addClass('pull-' + pull + '-' + getPos(offsetSlave, grid, max));
            }
        };
        
        this.changeHorizontalPos = function($el, anchor) {
            changePos($el, 'x', anchor, 19, 950);
        };
        
        this.changeVerticalPos = function($el, anchor) {
            changePos($el, 'y', anchor, 16, 624);
        };
        
        this.applyDraggable = function($el) {
            $el = $el.filter('.draggable');
            
            if (! $el.length) {
                return;
            }
            
            $draggables = $draggables.add($el);
            
            if ($el.length) {
                $el.draggable({
                    cursor: "move",
                    start: function(e, ui) {
                        var $this = $(this);
                        
                        app.ContentEditor.stopEditing();
                        app.ContentEditor.deselect(app.Credits.getCredits());
                        
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
                            
                            app.ContentEditor.changeHorizontalPos($this);
                            app.ContentEditor.changeVerticalPos($this);
                        }).removeClass('ui-draggable-dragging').removeAttr('style');
                    },
                    
                    // Both these x grid sizes have issues. The grid actually has a different "step" size every fourth step.
                    // push-right-x --> push-right-x-a = 5px; push-right-x-a --> push-right-x-b = 5px; push-right-x-b --> push-right-x-c = 5px; push-right-x-c --> push-right-x+1 = 4px;
                    // grid: [4.75, 4]
                    grid: [5, 4]
                });
            }
        };
        
        this.makeDraggable = function() {
            this.applyDraggable(app.Page.getContent().find('.draggable'));
        };
        
        this.enableDraggable = function($el) {
            if (typeof $el !== 'undefined') {
                return callWidgetFunction($el, 'draggable', 'enable');
            }
            
            callWidgetFunction($draggables, 'draggable', 'enable');
        };
        
        this.disableDraggable = function($el) {
            if (typeof $el !== 'undefined') {
                return callWidgetFunction($el, 'draggable', 'disable');
            }
            
            callWidgetFunction($draggables, 'draggable', 'disable');
        };
        
        this.removeDraggable = function($el) {
            callWidgetFunction($draggables, 'draggable', 'destroy');
        };
        
        this.move = function(axis, ticks) {
            ticks = Argument.default(ticks, 1);
            
            var $selection = this.getSelection();
            var maxCols = 50.75;
            var maxRows = 39.75;
            
            ticks = ticks / 4;
            
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
            $el = $el.filter('.resizable');
            
            if (! $el.length) {
                return;
            }
            
            var $filtered = $el.not('.videoHolder');
            var $videos = $el.filter('.videoHolder');
            
            $resizables = $resizables.add($el);
            
            if ($filtered.length) {
                $filtered.resizable({
                    handles: 'e, w',
                    grid: [19, 10],
                    start: function() {
                        app.ContentEditor.stopEditing();
                        app.ContentEditor.deselect(app.Credits.getCredits());
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
                        
                        app.ContentEditor.changeHorizontalPos($this);
                        
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
                        
                        app.ContentEditor.changeHorizontalPos($this);
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
                return this.applyResizable($el);
            }
            
            callWidgetFunction($resizables, 'resizable', 'enable');
        };
        
        this.disableResizable = function($el) {
            if (typeof $el !== 'undefined') {
                return callWidgetFunction($el, 'resizable', 'destroy');
            }
            
            callWidgetFunction($resizables, 'resizable', 'disable');
        };
        
        this.removeResizable = function() {
            callWidgetFunction($resizables, 'resizable', 'destroy');
        };
        
        var editor, $editing;
        
        var getSelectedElement = function() {
            var Selection = window.getSelection();
            var node = Selection.focusNode;
            
            if (node.nodeType == Node.TEXT_NODE) {
                return node.parentNode;
            }
            
            return node;
        };
        
        var makeEditor = function(selector) {
            var options = {
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
                        'dropcap',
                        'case'
                    ]
                },
                extensions: {
                    'b': new Medium.button({
                        label: '<i class="fa fa-bold"></i>',
                        start: '<strong>',
                        end: '</strong>'
                    }),
                    'i': new Medium.button({
                        label: '<i class="fa fa-italic"></i>',
                        start: '<em>',
                        end: '</em>'
                    }),
                    'span': new Medium.button({
                        label: '<b>span</b>',
                        start: '<span>',
                        end: '</span>'
                    }),
                    'dropcap': new Medium.button({
                        label: '<b>A</b><i class="fa fa-ellipsis-v"></i>',
                        action: function(html, mark) {
                            var el = getSelectedElement();
                            var $el = $(el);
                            
                            editor.selectElement(el);
                            
                            if ($el.is('.dropcap3')) {
                                $el.removeClass('dropcap3');
                                html = $el.html();
                            } else {
                                html = window.getCurrentSelection();
                                html = '<p class="dropcap3">' + html + '</p>';
                            }
                            
                            return html;
                        }
                    }),
                    'case': new Medium.button({
                        label: '<b>Aa</b>',
                        start: '<span class="upperCase">',
                        end: '</span>'
                    })
                }
            };
            
            if (app.getLanguage() === 'zh') {
                options.toolbar.buttons.push('continue');
                options.extensions.continue = new Medium.button({
                    label: '<b>如</b><i class="fa fa-ellipsis-v"></i>',
                    action: function(html, mark) {
                        var el = getSelectedElement();
                        var $el = $(el);

                        $el.removeClass('dropcap3');

                        editor.selectElement(el);

                        if ($el.is('.continue')) {
                            var $firstLetter = $el.find('.firstletter');

                            $el.removeClass('continue');
                            $firstLetter.replaceWith($firstLetter.text());

                            html = $el.html();
                        } else {
                            html = window.getCurrentSelection();
                            html = '<span class="firstletter">' + html.slice(0, 1) + '</span>' + html.slice(1, html.length);
                            html = '<p class="continue">' + html + '</p>';
                        }

                        return html;
                    }
                });
            }

            return new Medium.editor(selector, options);
        };
        
        this.startEditing = function($el) {
            if (! $el.length) {
                return;
            }
            
            $el = $el.first();
            
            app.ContentEditor.deselectAll($selectables);
            app.ContentEditor.select($el);
            
            app.ContentEditor.disableDraggable($el);
            app.ContentEditor.disableResizable($el);
            app.ContentEditor.disableSelectable($el);
            
            editor = makeEditor($el);
            $el.click(); // trigger a click to make sure it has focus.
            editor.selectElement(editor.getFocusedElement()); // Now select the element that has focus et voilá!
            
            // Remove id from new nodes.
            $el.keyup(function(e) {
                if (e.keyCode === 13 && ! e.shiftKey) {
                    var $node, $parent;
                    
                    $node = $(getSelectedElement());
                    
                    if ($node.is('span, em, strong') && ($parent = $node.parents('p, :header')).length) {
                        $node = $parent;
                    }
                    
                    $node.removeAttr('class');
                }
            });
            
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
            editor = $editing = null;
            
            $(document).off('click', $(document).data('click'));
            
            $el.off('keyup');
            
            // Remove all empty elements.
            $el.find('p, :header, em, strong, span').filter(function() {
                return ! $(this).text();
            }).remove();
            
            $el.find('span[style]').contents().unwrap();
            $el.find('[id]').removeAttr('id');
            
            // Ensure newline before .dropcap3, .continue
            $el.find('.dropcap3, .continue').prev(':not(br)').after('<br>');
            
            this.enableSelectable($el);
            this.enableDraggable($el);
            this.enableResizable($el);
            this.makeEditable();
            
            app.ContentEditor.select($el);
        };
        
        this.applyEditable = function($el) {
            $el = $el.filter('.editable');
            
            if (! $el.length) {
                return;
            }
            
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
            
            if (typeof editor !== 'undefined' && editor !== null) {
                editor.destroy();
            }
            
            $editing = null;
            $('.editable').off('dblclick');
            $('.editable').off('blur');
        };
    }
    
    app.registerModule('ContentEditor', ContentEditor);
})(window, jQuery, MagTool, Argument, {editor: MediumEditor, button: MediumButton});
