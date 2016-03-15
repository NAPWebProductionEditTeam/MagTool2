(function(window, $, require, app) {
    var console = window.console;
    var minify = require('html-minifier').minify;
    
    function Exporter() {
        var $html;
        
        var getCloneContainer = function() {
            if (typeof $html === 'undefined' || ! $html.length) {
                $html = $('#html');
            }
            
            return $html;
        };
        
        var clearHtml = function() {
            getCloneContainer().html('');
        };
        
        var removeVideo = function() {
            getCloneContainer().find('.videoLoader').children().remove();
        };
        
        var trimBreakTags = function() {
            getCloneContainer().find('br:first-child, br:last-child').remove();
        };
        
        var removeStyleAttributes = function() {
            getCloneContainer().find('[style]:not(.videoLoader)').removeAttr('style');
        };
        
        var cleanUp = function() {
            removeVideo();
            trimBreakTags();
            removeStyleAttributes();
        };
        
        var getHtml = function($elements) {
            var $cloneContainer = getCloneContainer();
            var html;
            
            clearHtml();
            
            $elements.clone().appendTo($cloneContainer);
            
            cleanUp();
            
            html = $cloneContainer.html();
            html = minify(html, {
                removeComments: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeRedundantAttributes: true,
                removeEmptyAttributes: true,
                quoteCharacter: '"'
            });
            
            return html;
        };
        
        var getCreditsHtml = function() {
            return getHtml(app.Page.get().find('[class^="credits"]'));
        };
        
        var getContentHtml = function() {
            return getHtml(app.Page.get().find('.magazineContent > div:not([class^="credits"]):not(.edLetterList):not(.videoHolder)'));
        };
        
        var getVideoHtml = function() {
            var $elements = app.Page.get().find('.videoHolder');
            $elements.add(app.VideoEditor.getJs($elements));
            
            return getHtml($elements);
        };
        
        this.getCreditsHtml = getCreditsHtml;
        this.getContentHtml = getContentHtml;
        this.getVideoHtml = getVideoHtml;
        
        this.toJSON = function() {
            return {
                credits: getCreditsHtml(),
                content: getContentHtml(),
                video: getVideoHtml()
            };
        };
        
        this.toConsole = function() {
            console.file('infoBlocks.html', getContentHtml());
            console.file('credits.html', getCreditsHtml());
            
            var video = getVideoHtml();
            
            if (video) {
                console.file('script.html', video);
            }
        };
        
        this.toModal = function() {
            // TODO
        };
    }
    
    app.modules.Exporter = Exporter;
})(window, jQuery, require, MagTool);
