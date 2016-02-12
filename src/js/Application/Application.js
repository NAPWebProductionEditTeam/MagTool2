var MagTool = MagTool || {};

(function(window, $, app) {
    app.modules = {};
    
    app.$body = $('body');
    
    var resolveAction = function($el) {
        var actionNone = function() {};
        var actionName = $el.data('action');
        var action = app[actionName];
        
        if (
            action.always ||
            app.ContentEditor.isEditing() && action.whenEditing ||
            ! app.ContentEditor.isEditing() && ! action.whenEditing
        ) {
            return action;
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
        app.$mt.on('click', '[data-action]', function() {
            var action = resolveAction($(this));
            
            action();
        });
        
        app.$mt.find('input').on('change', '[data-change]', function() {
            var value;
            var $this = $(this);
            var action = resolveAction($this);
            
            if ($this.is('[type="radio"]')) {
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
        
        app.ContentEditor.startingEdit();
        
        app.Server.edit(pageId).done(function(data) {
            if (data.response.indexOf('is locked for editing') > -1) {
                app.ContentEditor.startEdit();
            } else {
                console.log('Page is being edited');
                // NOTIFY: Page Locked!
            }
        }).fail(function() {
            console.log('receiving errors');
            // NOTIFYL Errors!
        });
    }, false, false);
    
    registerAction('unlock', function() {
        var pageId = app.Page.getId();
        
        app.Server.unlock(pageId).done(function() {
            console.log('page unlocked');
        }).fail(function() {
            console.log('couldnt unlock');
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
})(window, $, MagTool);
