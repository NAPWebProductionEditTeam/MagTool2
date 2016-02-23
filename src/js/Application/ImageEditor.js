(function(window, $, app) {
    function ImageEditor() {
        
        this.detectImageUrl = function() {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();
            var currentUrl = $selected.find('img').attr('src');
            var newURL = $selectionControls.find('#imageURL').val();
            newURL = currentUrl;

        };

        //         this.changeUrl = function (url){
        //             var url= app.UI.getUI().find('#imageURL').val();
        //             var app.Page.getContent()
        //
        //         }
    }
    
    app.modules.ImageEditor = ImageEditor;
})(window, jQuery, MagTool);
