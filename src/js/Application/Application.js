/* globals console */

(function(window, $, app) {
    app.$body = $('body');
    
    app.Loader.load(function() {
        // FadeIn
    });
    
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
