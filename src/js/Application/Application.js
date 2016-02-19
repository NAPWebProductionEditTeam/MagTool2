var MagTool = MagTool || {};

(function(window, $, app) {
    app.modules = {};
    
    app.$body = $('body');
    
    var resolveAction = function($el) {
        var actionName = $el.data('action');
        var action = app[actionName];
        
        var actionNone = function() {};
        
        if (action) {
            if (
                action.always ||
                app.ContentEditor.isEditing() && action.whenEditing ||
                ! app.ContentEditor.isEditing() && ! action.whenEditing
            ) {
                return action;
            }
        }
        
        return actionNone;
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
        app.UI.getUI().on('click', '[data-action]', function() {
            var action = resolveAction($(this));
            
            action();
        });
        
        app.UI.getUI().find('input[data-change]').on('change', function() {
            var value;
            var $this = $(this);
            var action = resolveAction($this);
            
            if ($this.is('.uRadioBtn')) {
                var name = $this.attr('name');
                
                app.UI.getUI().find('input[name="' + name + '"]').not($this).prop('checked', false);
                
                value = $this.val();
            } else if ($this.is('[type="checkbox"]')) {
                value = [];
                
                $this.filter(':checked').each(function() {
                    value.push($(this).val());
                });
            } else if ($this.is('[type="radio"]')) {
                value = $this.filter(':checked').val();
            } else {
                value = $this.val();
            }
            
            action(value);
        });
    };
    
    /**
     * Application Actions.
     */
    registerAction('edit', function() {
        var pageId = app.Page.getId();
        
        app.UI.btnGroupLoading('editSave');
        
        app.Server.edit(pageId).done(function(data) {
            if (data.response.indexOf('is locked for editing') > -1) {
                app.ContentEditor.startEdit();
                
                app.UI.showBtn('editSave', 'save');
            } else {
                console.log('Page is being edited');
                
                // NOTIFY: Page Locked!
            }
        }).fail(function() {
            console.log('receiving errors');
            
            // NOTIFY: Error locking, e
        }).always(function() {
            app.UI.btnGroupLoaded('editSave');
        });
    }, false, false);
    
    registerAction('unlock', function() {
        var pageId = app.Page.getId();
        
        app.UI.btnGroupLoading('editSave');
        
        app.Server.unlock(pageId).done(function() {
            console.log('page unlocked');
            
            // NOTIFY: Page unlocked
        }).fail(function() {
            console.log('couldnt unlock');
            
            // NOTIFY: Unlock error, e
        }).always(function() {
            app.UI.btnGroupLoaded('editSave');
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
            console.log('Saved successfully');
            
            // change tool ui --> saved
        }).fail(function() {
            console.log('Save error');
            
            // change tool ui --> error
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
        } else {
            $toggle.attr('title', 'Show credits');
            
            $toggle.find('.fa').removeClass('fa-eye-slash').addClass('fa-eye');
        }
    }, false, true);
    
    registerAction('moveSlug', function(position) {
        app.Slug.move(position);
    }, false, true);
    
    registerAction('changeSlug', function(type) {
        app.Slug.change(type);
    }, false, true);
    
    registerAction('alignSelected', function(alignment) {
        
        app.TextEditor.align(alignment);
    }, false, true);

     registerAction('changeColor', function(color) {

        app.TextEditor.changeColor(color);
    }, false, true);
})(window, $, MagTool);
