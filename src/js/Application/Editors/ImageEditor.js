(function(window, $, app) {
    function ImageEditor() {
        this.detectImage = function() {
            var $selected = app.ContentEditor.getSelection().find('img');
            var url = $selected.attr('src').replace('@2x', '');
            var width = $selected.attr('width');
            var height = $selected.attr('height');
            var imgWidth = $selected.prop('naturalWidth');
            var imgHeight = $selected.prop('naturalHeight');
            
            if (typeof width === 'undefined') {
                width = 'auto';
            }
            
            if (typeof height === 'undefined') {
                height = 'auto';
            }
            
            $('#naturalSize').text(imgWidth + 'x' + imgHeight);
            
            $('#imageWidth').val(width);
            $('#imageHeight').val(height);
            
            $('#imageURL').val(url);
        };
        
        this.changeUrl = function(url) {
            var $selected = app.ContentEditor.getSelection().find('img');
            var currentUrl = $selected.attr('src');
            
            if (url !== currentUrl) {
                var url2x = url.replace(/(.*)(\..*)$/, '$1@2x$2');
                
                $selected.src(url)
                    .attr('data-img-src-2x', url2x)
                    .removeAttr('height')
                    .load(function() {
                        var $this = $(this);
                        
                        $this.width($this.prop('naturalWidth'));
                        
                        app.ImageEditor.detectImage();
                    });
            }
        };
        
        this.changeSize = function(width, height) {
            var $selected = app.ContentEditor.getSelection().find('img');
            var imgWidth = $selected.prop('naturalWidth');
            var imgHeight = $selected.prop('naturalHeight');
            
            if (width == imgWidth || width === '') {
                width = 'auto';
            }
            
            if (height == imgHeight || height === '') {
                height = 'auto';
            }
            
            if (width === 'auto' && height === 'auto') {
                width = imgWidth;
            }
            
            $selected.attr('width', width).attr('height', height);
            
            if (width === 'auto') {
                $selected.removeAttr('width');
            } else if (height === 'auto') {
                $selected.removeAttr('height');
            }
            
            this.detectImage();
        };
    }
    
    app.registerModule('ImageEditor', ImageEditor);
})(window, jQuery, MagTool);
