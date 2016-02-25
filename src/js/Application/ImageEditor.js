(function(window, $, app) {
    function ImageEditor() {
        this.detectImage = function() {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();
            var currentUrl = $selected.find('img').attr('src');
            var currentW = $selected.find('img').attr('width');
            var currentH = $selected.find('img').attr('height');
            var imgw = $selected.find('img').prop('naturalWidth');
            var imgH = $selected.find('img').prop('naturalHeight');
            app.UI.getSelectionSection().find('#IMGH').text(imgH);
            app.UI.getSelectionSection().find('#IMGW').text(imgw);
            $selectionControls.filter('#imageURL').val(currentUrl);
            $selectionControls.filter('#imageWidth').val(currentW);
            $selectionControls.filter('#imageHeight').val(currentH);
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
