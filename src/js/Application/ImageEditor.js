(function(window, $, app) {
    function ImageEditor() {
        
        this.detectImageUrl = function() {

            var imgUrl = app.ContentEditor.getSelection().find('img').attr('src');
            app.UI.getUI().find('#imageURL').attr('src', imgUrl);

            return app.UI.getUI().find('#imageURL').attr('src', imgUrl);

        };

        //         this.changeUrl = function (url){
        //             var url= app.UI.getUI().find('#imageURL').val();
        //             var app.Page.getContent()
        //
        //         }
    }
    
    app.modules.ImageEditor = ImageEditor;
})(window, jQuery, MagTool);
