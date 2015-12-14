/* globals console */

(function(window, $, app) {
    app.$body = $('body');
    
    app.Loader.load(function() {
        // Initialize modules
        for (var module in app.modules) {
            app[module] = new app.modules[module]();
        }
        
        // FadeIn
    });
    
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
})(window, $, app);
