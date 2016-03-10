var MagTool = MagTool || {};

(function(window, $, app, Mousetrap) {
    var magazineBuilder = window.magazineBuilder;
    
    app.modules = {};
    
    app.$doc = $(window.document);
    app.$body = $('body');
    
    var resolveAction = app.resolveAction = function(actionName, params) {
        var action = app[actionName];
        
        if (typeof params === 'undefined') {
            params = [];
        }
        
        if (action) {
            if (
                action.always ||
                app.ContentEditor.isEditing() && action.whenEditing ||
                ! app.ContentEditor.isEditing() && ! action.whenEditing
            ) {
                return action.apply(app, params);
            }
        }
    };
    
    var registerAction = function(name, action, always, whenEditing) {
        action.always = always;
        
        if (! always) {
            action.whenEditing = whenEditing;
        }
        
        app[name] = action;
    };
    
    /**
     * Bind actions.
     */
    app.registerBindings = function() {
        // Click bindings
        app.UI.getUI().on('click', '[data-action]', function() {
            resolveAction($(this).data('action'));
        });
        
        // Change bindings
        app.UI.getUI().find('input[data-change], textarea[data-change]').on('change paste', function() {
            var value;
            var $this = $(this);
            var $group = $([]);
            
            if ($this.is('.uRadioBtn') || $this.is('.multi-input') || $this.is('[type="checkbox"]') || $this.is('[type="radio"]')) {
                var name = $this.attr('name');
                $group = app.UI.getUI().find('input[name="' + name + '"]');
            }
            
            if ($this.is('.uRadioBtn')) {
                $group.not($this).prop('checked', false);
                
                value = $group.filter(':checked').val();
            } else if ($this.is('.multi-input')) {
                value = [];
                
                $group.each(function() {
                    value.push($(this).val());
                });
            } else if ($this.is('[type="checkbox"]')) {
                value = [];
                
                $group.filter(':checked').each(function() {
                    value.push($(this).val());
                });
            } else if ($this.is('[type="radio"]')) {
                value = $group.filter(':checked').val();
            } else {
                value = $this.val();
            }
            
            if (! (value instanceof Array)) {
                value = [value];
            }
            
            resolveAction($this.data('change'), value);
        });
        
        // Notify close
        app.UI.getNotification().find('.fa-close').click(function() {
            app.UI.getNotification().removeClass('--open');
        });
    };
    
    /**
     * Bind key events to actions.
     */
    app.registerKeyBindings = function() {
        // First find existing key events on the body.
        var originalKeyEvents = $.grep(
            $._data(window.document, 'events').keyup || [],
            function(e) {
                return typeof e.selector === 'undefined';
            }
        );
        
        // Let's store them so we can unbind / rebind them later.
        app.$doc.data('originalKeyEvents', {
            bound: true,
            handlers: originalKeyEvents
        });
        
        // Time to bind our own key events then.
        Mousetrap.bind('mod+e', function() {
            resolveAction('edit');
        });
        
        Mousetrap.bind('mod+s', function() {
            resolveAction('save');
        });
        
        Mousetrap.bind('mod+i', function() {
            resolveAction('map_image');
        });
        
        Mousetrap.bind('up', function(e) {
            e.preventDefault();
            
            app.ContentEditor.move('y', 1);
        });
        
        Mousetrap.bind('shift+up', function() {
            app.ContentEditor.move('y', 4);
        });
        
        Mousetrap.bind('right', function() {
            app.ContentEditor.move('x', 1);
        });
        
        Mousetrap.bind('shift+right', function() {
            app.ContentEditor.move('x', 4);
        });
        
        Mousetrap.bind('down', function(e) {
            e.preventDefault();
            
            app.ContentEditor.move('y', -1);
        });
        
        Mousetrap.bind('shift+down', function() {
            app.ContentEditor.move('y', -4);
        });
        
        Mousetrap.bind('left', function() {
            app.ContentEditor.move('x', -1);
        });
        
        Mousetrap.bind('shift+left', function() {
            app.ContentEditor.move('x', -4);
        });
        
        Mousetrap.bind(['backspace', 'del'], function(e) {
            e.preventDefault();
            
            app.ContentEditor.remove(app.ContentEditor.getSelectedElements());
        });
        
        Mousetrap.bind('c', function() {
            app.Credits.show();
            app.ContentEditor.deselectAll();
            app.ContentEditor.select(app.Credits.getCredits());
        });
        
        Mousetrap.bind('tab', function(e) {
            e.preventDefault();
            
            app.ContentEditor.selectNext();
        });
        
        Mousetrap.bind('shift+tab', function(e) {
            e.preventDefault();
            
            app.ContentEditor.selectPrev();
        });
        
        Mousetrap.bind('enter', function() {
            // start editing selected
        });
        
        Mousetrap.bind('mod+enter', function() {
            // stop editing selected
        });
    };
    
    app.bindOriginalKeyEvents = function() {
        var events = app.$doc.data('originalKeyEvents');
        
        if (! events.bound) {
            app.$doc.data('originalKeyEvents', {
                handlers: events.handlers,
                bound: true
            });
            
            $.each(events.handlers, function(i, handler) {
                app.$doc.on('keyup', null, handler);
            });
        }
    };
    
    app.unbindOriginalKeyEvents = function() {
        var events = app.$doc.data('originalKeyEvents');
        
        if (events.bound) {
            app.$doc.data('originalKeyEvents', {
                handlers: events.handlers,
                bound: false
            });
            
            $.each(events.handlers, function(i, handler) {
                app.$doc.off('keyup', null, handler);
            });
        }
    };
    
    /**
     * Bind navigation.
     */
    var navigate = function(e) {
        if (app.ContentEditor.isEditing()) {
            var confirm = 'You have unsaved changes, are you sure you want to continue?';
            
            if (e.type === 'click') {
                var _this = this;
                var $this = $(this);
                
                e.preventDefault();
                
                e.callback = function(e) {
                    var events = $this.data('originalClickEvents');
                    var handlers = [];
                    
                    if (typeof events !== 'undefined') {
                        handlers = events.handlers;
                    }
                    
                    app.bindOriginalKeyEvents();
                    app.bindOriginalNavigationEvents();
                    app.ContentEditor.stopEdit();
                    
                    app.UI.hideEditTools();
                    app.UI.showBtn('editSave', 'edit');
                    
                    $this.off('click');
                    
                    $.each(handlers, function(i, handler) {
                        handler.call(_this, e);
                    });
                };
                
                app.Modal.confirm(e, 'Unsaved Changes!', confirm);
                
                return false;
            }
            
            return confirm;
        }
    };
    
    var $navigation;
    
    app.registerNavigationBindings = function() {
        // Magazine navigation
        $navigation = $('.control, #button-content, #button-archive');
        
        $navigation.each(function() {
            var $this = $(this);
            var handlers;
            
            if ($this.is('.control.prev')) {
                handlers = [magazineBuilder.goToPreviousPage];
            } else if ($this.is('.control.next')) {
                handlers = [magazineBuilder.goToNextPage];
            } else if ($this.is('#button-content')) {
                handlers = [magazineBuilder.loadContentsPage];
            } else if ($this.is('#button-archive')) {
                handlers = [
                    function() {
                        magazineBuilder.jumpToPage(magazineBuilder.get_NumberOfPages());
                    }
                ];
            }
            
            $this.data('originalClickEvents', {
                handlers: handlers,
                bound: true
            });
        });
    };
    
    app.bindOriginalNavigationEvents = function() {
        $navigation.off('click').each(function() {
            var $this = $(this);
            var events = $this.data('originalClickEvents');
            
            if (! events.bound) {
                $this.data('originalClickEvents', {
                    handlers: events.handlers,
                    bound: true
                });
                
                $.each(events.handlers, function(i, handler) {
                    $this.click(handler);
                });
            }
        });
        
        $('a:not([target="_blank"]):not(.js-popup)').not($navigation).off('click');
        $(window).off('beforeunload');
    };
    
    app.unbindOriginalNavigationEvents = function() {
        $navigation.off('click').each(function() {
            var $this = $(this);
            var events = $this.data('originalClickEvents');
            
            if (events.bound) {
                $this.data('originalClickEvents', {
                    handlers: events.handlers,
                    bound: false
                });
            }
        }).click(navigate);
        
        $('a:not([target="_blank"]):not(.js-popup)').not($navigation).click(navigate);
        $(window).on('beforeunload', navigate);
    };
    
    /**
     * Application Actions.
     */
    registerAction('edit', function() {
        var pageId = app.Page.getId();
        
        app.UI.btnGroupLoading('editSave');
        
        app.Server.edit(pageId).done(function(data) {
            if (data.response.indexOf('is locked for editing') > -1) {
                app.unbindOriginalKeyEvents();
                app.unbindOriginalNavigationEvents();
                
                app.ContentEditor.startEdit();
                app.UI.showEditTools();
                
                app.UI.showBtn('editSave', 'save');
            } else {
                app.UI.notify('Page Locked', 'The page is currently being edited.');
            }
        }).fail(function() {
            app.UI.notify('Failed Locking Page.', '## ERROR MESSAGE ##');
        }).always(function() {
            app.UI.btnGroupLoaded('editSave');
        });
    }, false, false);
    
    registerAction('unlock', function() {
        var pageId = app.Page.getId();
        
        app.UI.btnGroupLoading('lock');
        
        app.Server.unlock(pageId).done(function() {
            app.UI.notify('Page Unlocked.');
        }).fail(function() {
            app.UI.notify('Failed Unlocking Page.', '## ERROR MESSAGE ##');
        }).always(function() {
            app.UI.btnGroupLoaded('lock');
        });
    }, false, false);
    
    registerAction('save', function() {
        app.ContentEditor.cleanUp();
        
        var pageId = app.Page.getId(),
            credits = app.ContentEditor.getCreditsHtml(),
            contents = app.ContentEditor.getContentHtml(),
            video = app.ContentEditor.getVideoHtml();
        
        console.info('Copy the following output into common/script.html:');
        console.log('>>>> BEGIN SCRIPT.HTML CONTENT <<<<');
        console.log(video);
        console.log('<<<< END SCRIPT.HTML CONTENT >>>>');
        
        app.Server.save(pageId, credits, contents).done(function() {
            app.bindOriginalKeyEvents();
            app.bindOriginalNavigationEvents();
            app.ContentEditor.stopEdit();
            app.UI.hideEditTools();
            
            app.UI.showBtn('editSave', 'edit');
            
            app.UI.notify('Page Saved.', 'Page ' + app.Page.getNumber() + ' saved successfully.');
        }).fail(function() {
            app.UI.notify('Error Saving Page.', '## ERROR MESSAGE ##');
        });
    }, false, true);
    
    registerAction('map_image', function() {
        var url = '/alfresco/nap/webAssets/magazine/_shared/contents/tools/CTAamend/index.html?pageID=:pageId&issueID=:issueId&ticket=:ticket';
        var pageId = app.Page.getId();
        var issueId = app.Page.getIssueId();
        var ticket = app.Page.getTitle().replace(/\s+/, '+');
        
        url = url.replace(':pageId', pageId);
        url = url.replace(':issueId', issueId);
        url = url.replace(':ticket', ticket);
        
        window.open(url, '_blank');
    }, true);
    
    registerAction('updateUI', function() {
        var type = app.ContentEditor.getSelectionType();
        var $selectionEditor = $('#' + type + 'Selection');
        
        app.UI.getSelectionSection().find('.selection').removeClass('--active');
        
        if ($selectionEditor.length) {
            $selectionEditor.addClass('--active');
        }
        
        switch (type) {
            case 'text':
                app.TextEditor.detectSelectedAlignment();
                app.TextEditor.detectSelectedClass();
                break;
            case 'image':
                app.ImageEditor.detectImage();
                break;
            case 'cta':
                app.CtaEditor.detectSelectedCta();
                break;
        }
    }, false, true);
    
    // New Text Element
    registerAction('new-text', function() {
        app.NewElement.newText();
    }, false, true);

    // New Image Element
    registerAction('new-image', function() {
        app.NewElement.newImage();
    }, false, true);

    // New CTA Element
    registerAction('new-cta', function() {
        app.NewElement.newCTA();
    }, false, true);
    
    // Credits
    registerAction('toggleCreditsPosition', function() {
        app.Credits.togglePosition();
    }, false, true);
    
    registerAction('toggleCreditsColor', function() {
        app.Credits.toggleColor();
    }, false, true);
    
    registerAction('toggleCredits', function() {
        app.Credits.toggle();
        
        var $toggle = $('[data-action="toggleCredits"]');
        
        if (app.Credits.isVisible()) {
            $toggle.attr('title', 'Hide credits');
            $toggle.find('.fa').removeClass('fa-eye').addClass('fa-eye-slash');
            
            app.ContentEditor.select(app.Credits.getCredits());
        } else {
            $toggle.attr('title', 'Show credits');
            $toggle.find('.fa').removeClass('fa-eye-slash').addClass('fa-eye');
        }
    }, false, true);
    
    registerAction('updateCredits', function(text) {
        app.Credits.update(text);
    }, false, true);
    
    // Slugs
    registerAction('moveSlug', function(position) {
        app.Slug.move(position);
    }, false, true);
    
    registerAction('changeSlug', function(type) {
        app.Slug.change(type);
    }, false, true);
    
    // Text Editor
    registerAction('alignSelected', function(alignment) {
        app.TextEditor.align(alignment);
    }, false, true);
    
    registerAction('changeColor', function(color) {
        app.TextEditor.changeColor(color);
    }, false, true);
    
    // CTA Editor
    registerAction('changeCta', function(cta) {
        app.CtaEditor.changeCta(cta);
    }, false, true);

    // Image Editor
    registerAction('changeUrl', function(src) {
        app.ImageEditor.changeUrl(src);
    }, false, true);
    
    registerAction('changeSize', function(w, h) {
        app.ImageEditor.changeSize(w, h);
    }, false, true);
})(window, $, MagTool, Mousetrap);
