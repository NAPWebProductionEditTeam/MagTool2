(function(window, $, app) {
    function ImageEditor() {
        

        this.detectImageUrl =function (){
            var url= app.UI.getUI().find('#imageURL').val();
            var imgUrl= app.ContentEditor.getSelection().find('img').attr('src');
            url=imgUrl;

        }
         this.changeUrl = function (url){
             var url= app.UI.getUI().find('#imageURL').val();
             var app.Page.getContent()

         }
    }
    
    app.modules.TextEditor = ImageEditor;
})(window, jQuery, MagTool);
