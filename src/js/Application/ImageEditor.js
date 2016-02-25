(function(window, $, app) {
    function ImageEditor() {
        this.detectImage = function() {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();
            var currentUrl = $selected.find('img').attr('src');
            var currentW = $selected.find('img').attr('width');
            var currentH = $selected.find('img').attr('height');
            var imgW = $selected.find('img').prop('naturalWidth');
            var imgH = $selected.find('img').prop('naturalHeight');

            currentW = currentW == imgW ? 'auto' : currentW;
            currentH = currentH == imgH ? 'auto' : currentH;

            app.UI.getSelectionSection().find('#IMGH').text(imgH);
            app.UI.getSelectionSection().find('#IMGW').text(imgW);
            $selectionControls.filter('#imageURL').val(currentUrl);
            $selectionControls.filter('#imageWidth').val(currentW);
            $selectionControls.filter('#imageHeight').val(currentH);
        };

        this.changeUrl = function(url) {
            var $selected = app.ContentEditor.getSelection();
            var currentUrl = $selected.find('img').attr('src');

            if (url !== currentUrl) {
                var $img = $selected.find('img');

                $img.attr('src', url);
                $img.removeAttr('width height');
                $img.load(function() {
                    app.ImageEditor.detectImage();
                });
            }
        };

        this.changeSize = function(w, h) {
            var $selected = app.ContentEditor.getSelection();
            var currentW = $selected.find('img').attr('width');
            var currentH = $selected.find('img').attr('height');

            if (w !== currentW) {
                $selected.find('img').attr('width', w);
            }

            if (h !== currentH) {
                $selected.find('img').attr('height', h);
            }
        };
    }

    app.modules.ImageEditor = ImageEditor;
})(window, jQuery, MagTool);
