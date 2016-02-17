(function(window, $, app, Medium) {
    function ContentEditor() {
        var editing = false;
        
        /**
         * Content retrieval.
         */
        var $html;
        
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
        
        /**
         * Content interactions.
         */
        var $draggables, $resizables;
        var $selected = $([]);
        
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
                
                // win ctrl || OS X cmd || shift
                if (e.ctrlKey || e.metaKey || e.shiftKey) {
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
            
            if ($content.is('.ui-selectable')) {
                var $selectables = $content.find('.draggable, .editable, .resizable');
                
                $content.selectable('destroy');
                $selectables.off('click', $selectables.data('click'));
            }
        };
        
        var changeXPos = function($this) {
            var left = parseInt($this.css('left'));
            
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
            
            if($resizables.length){
                $resizables.resizable({
                    handles: 'e, w',
                    grid: [ 19, 10 ],
                    stop: function(){
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
        
        var editor;
        
        this.makeEditable = function() {
            editor = window.editor = new Medium.editor('.editable', {
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
                        label:'<b>B</b>',
                        start:'<strong>',
                        end:'</strong>'
                    }),
                    'i': new Medium.button({
                        label:'<b><i>I</i></b>',
                        start:'<em>',
                        end:'</em>'
                    }),
                    'span': new Medium.button({
                        label:'<b>span</b>',
                        start:'<span>',
                        end:'</span>'
                    }),
                    'case': new Medium.button({
                        label:'<b>Aa</b>',
                        start:'<span class="upperCase">',
                        end:'</span>'
                    })
                }
            });
            
            $('.editable').dblclick(function(e) {
                var $this = $(this);
                
                editor.selectAllContents();
                
                $('.ui-selected').removeClass('ui-selected');
                
                if ($this.find('.dropcap3')) {
                    var $dropcap = $this.find('.dropcap3');
                    var classes = [];
                    
                    if ($dropcap.data('class')) {
                        classes = $dropcap.data('class').split(' ');
                    }
                    
                    classes.push('dropcap3');
                    
                    $dropcap.attr('data-class', classes.join(' ')).removeClass('dropcap3');
                }
                
                app.ContentEditor.disableDraggable($this);
                app.ContentEditor.disableResizable($this);
                app.ContentEditor.removeSelectable();
            });
            
            $('.editable').blur(function() {
                var $this = $(this);
                
                editor.destroy();
                editor.setup();
                
                $this.find('[data-class]').each(function() {
                    var $child = $(this);
                    console.log($child);
                    
                    $child.addClass($child.data('class'));
                });
                
                $this.attr('data-medium-focused', 'false');
                
                app.ContentEditor.enableDraggable($this);
                app.ContentEditor.enableResizable($this);
                app.ContentEditor.makeSelectable();
            });
        };
        
        this.removeEditable = function() {
            editor.destroy();
            
            $('.editable').off('dblclick');
        };
    }
    
    app.modules.ContentEditor = ContentEditor;
})(window, jQuery, MagTool, {editor: MediumEditor, button: MediumButton});
