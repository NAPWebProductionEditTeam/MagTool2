(function(window, $, app) {
    function VideoEditor() {
        this.getJs = function($video) {
            return $video.nextAll('script').first();
        };
        
        this.detectId = function() {
            var $editor = app.UI.getSelectionControls().filter('#videoId');
            var $video = app.ContentEditor.getSelection();
            var $js = this.getJs($video);
            var id = $js.html().match(/.*videoID\s*:\s*"(\d+)".*/)[1];
            
            console.log($js, id);
            
            $editor.val(id);
        };
        
        this.changeId = function(id) {
            var $video = app.ContentEditor.getSelection();
            var $js = this.getJs($video);
            
            $js.html($js.html().replace(/videoID\s*:\s*"\d+"/, 'videoID: "' + id + '"'));
        };
    }
    
    app.modules.VideoEditor = VideoEditor;
})(window, jQuery, MagTool);
