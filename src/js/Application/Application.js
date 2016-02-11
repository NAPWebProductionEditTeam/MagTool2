var MagTool = MagTool || {};

(function(window, $, app) {
    app.modules = {};
    
    app.$body = $('body');
    
    app.registerBindings = function() {
        /**
         * Bind actions.
         */
        app.$mt.on('click', '[data-action]', function() {
            var action = $(this).data('action');
            
            app[action]();
        });
        
        app.$mt.find('select[name="slug-type"]').change(function() {
            app.changeSlug($(this).val());
        });
        
        app.$mt.find('input[name="slugPosition"]').change(function() {
            app.moveSlug($(this).filter(':checked').val());
        });
    };
    
    /**
     * Application Actions.
     */
    app.edit = function() {
        var pageId = app.Page.getId();
        
        app.UI.btnGroupLoading('editSave');
        
        app.Server.edit(pageId).done(function(data) {
            app.UI.btnGroupLoaded('editSave');
            
            if (data.response.indexOf('is locked for editing') > -1) {
                app.UI.makeDraggable();
                
                app.UI.showBtn('editSave', 'save');
            } else {
                console.log('Page is being edited');
            }
        }).fail(function() {
            console.log('receiving errors');
        });
    };
    
    app.unlock = function() {
        var pageId = app.Page.getId();
        
        app.Server.unlock(pageId).done(function() {
            console.log('page unlocked');
        }).fail(function() {
            console.log('couldnt unlock');
        });
    };
    
    app.save = function() {
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
    };
    
    app.map_image = function() {
        var url = '/alfresco/nap/webAssets/magazine/_shared/contents/tools/CTAamend/index.html?pageID=:pageId&issueID=:issueId&ticket=:ticket';
        var pageId = app.Page.getId();
        var issueId = app.Page.getIssueId();
        var ticket = app.Page.getTitle().replace(/\s+/, '+');
        
        url = url.replace(':pageId', pageId);
        url = url.replace(':issueId', issueId);
        url = url.replace(':ticket', ticket);
        
        window.open(url, '_blank');
    };
    
    app.toggleCreditsPosition = function() {
        app.Credits.togglePosition();
    };
    
    app.toggleCreditsColor = function() {
        app.Credits.toggleColor();
    };
    
    app.toggleCredits = function() {
        app.Credits.toggle();
        
        var $toggle = $('[data-action="toggleCredits"]');
        
        if (app.Credits.isVisible()) {
            $toggle.attr('title', 'Hide credits');
            
            $toggle.find('.fa').removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            $toggle.attr('title', 'Show credits');
            
            $toggle.find('.fa').removeClass('fa-eye-slash').addClass('fa-eye');
        }
    };
    
    app.moveSlug = function(position) {
        app.Slug.move(position);
    };
    
    app.changeSlug = function(type) {
        app.Slug.change(type);
    };
})(window, $, MagTool);
