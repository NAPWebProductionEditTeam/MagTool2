(function(window, $, app) {
    function VideoEditor() {
        this.detectId = function() {
            var $editor = app.UI.getSelectionControls().filter('#videoId');
            var $video = app.ContentEditor.getSelection();
            var $js = app.Page.getContent().find('script');
            var id = $video.find('.videoLoader').attr('id');
            
            $editor.val(id);
        };
        
        this.changeId = function(id) {
            var $video = app.ContentEditor.getSelection();
            var $js = app.Page.getContent().find('script');
            
            $js.html($js.html().replace(/videoID\s*:\s*"\d+"/, 'videoID: "' + id + '"'));
        };
    }
    
    app.registerModule('VideoEditor', VideoEditor);
})(window, jQuery, MagTool);
