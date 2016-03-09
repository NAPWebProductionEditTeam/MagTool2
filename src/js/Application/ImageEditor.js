(function(window, $, app) {
    function ImageEditor() {
        this.detectImage = function($img) {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();
            $img = $selected.find('img');
            var currentUrl = $img.attr('src').replace('@2x', '');
            var currentW = $img.attr('width');
            var currentH = $img.attr('height');

            $('<img/>').attr('src', currentUrl).load(function() {
                var $this = $(this);
                var imgW = $this.prop('naturalWidth');
                var imgH = $this.prop('naturalHeight');
                app.UI.getSelectionSection().find('#naturalHeight').text(imgH);
                app.UI.getSelectionSection().find('#naturalWidth').text(imgW);

                if (typeof currentW === 'undefined' || currentW == imgW) {
                    currentW = 'auto';
                }

                if (typeof currentH === 'undefined' || currentH == imgH) {
                    currentH = 'auto';
                }

                $selectionControls.filter('#imageWidth').val(currentW);
                $selectionControls.filter('#imageHeight').val(currentH);
            });

            $selectionControls.filter('#imageURL').val(currentUrl);
        };

        this.changeUrl = function(url) {
            var $selected = app.ContentEditor.getSelection();
            var currentUrl = $selected.find('img').attr('src');

            if (url !== currentUrl) {
                var $currentImg = $selected.find('img');
                var $img = $currentImg.clone().wrap('<p/>');
                $img.removeAttr('width height');
                $img.attr('src', url);
                var url2x = url.replace(/(.*)(\..*)$/, '$1@2x$2');

                var imghtml = $img.parent().html().replace(/(data-img-src@2x=")[^"]+(")/, '$1' + url2x + '$2');
                var img = $currentImg.replaceWith(imghtml);
                app.ImageEditor.detectImage(img);

            }
        };

        this.changeSize = function(w, h) {
            console.log(w, h);

            var $selected = app.ContentEditor.getSelection();
            var currentW = $selected.find('img').attr('width');
            var currentH = $selected.find('img').attr('height');
            var imgW = $selected.find('img').prop('naturalWidth');
            var imgH = $selected.find('img').prop('naturalHeight');

            if (w == imgW || w === '') {
                $selected.find('img').removeAttr('width');
            } else if (w !== currentW) {
                $selected.find('img').attr('width', w);
            }

            if (h == imgH || h === '') {
                $selected.find('img').removeAttr('height');
            } else if (h !== currentH) {
                $selected.find('img').attr('height', h);
            }
        };
    }

    app.modules.ImageEditor = ImageEditor;
})(window, jQuery, MagTool);
