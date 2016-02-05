var MagTool = MagTool || {};

(function(window, $, app) {
    app.modules = {};
    
    app.$body = $('body');
    
    /**
     * Application Actions.
     */
    app.edit = function() {
        var pageId = app.Page.getId();
        
        app.Server.edit(pageId).done(function(data) {
            if (data.response.indexOf('is locked for editing') > -1) {
                console.log('Locked the page; ready to edit');
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
})(window, $, MagTool);
