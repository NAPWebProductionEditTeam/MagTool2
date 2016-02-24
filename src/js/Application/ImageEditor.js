(function(window, $, app) {
    function ImageEditor() {
        this.detectImage = function() {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();
            $selected.find('img').onlod(function() {
                var currentUrl = $selected.find('img').attr('src');
                var currentW = $selected.find('img').attr('width');
                var currentH = $selected.find('img').attr('height');
                var imgw = this.naturalWidth;
                var imgH = this.naturalHeight;
                $selectionControls.filter('#IMGH').val(imgH);
                $selectionControls.filter('#IMGH').val(imgH);
                $selectionControls.filter('#imageURL').val(currentUrl);
                $selectionControls.filter('#imageWidth').val(currentW);
                $selectionControls.filter('#imageHeight').val(currentH);
            });
        };

        this.changeUrl = function(url) {
            var $selected = app.ContentEditor.getSelection();
            var currentUrl = $selected.find('img').attr('src');

            if (url !== currentUrl) {
                $selected.find('img').attr('src', url);
            }
        };

    }
    
    app.modules.ImageEditor = ImageEditor;
})(window, jQuery, MagTool);
