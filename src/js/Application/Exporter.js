(function(window, $, JsZip, require, app) {
    var Array = window.Array;
    var Node = window.Node;
    var Text = window.Text;
    var console = window.console;
    var minify = require('html-minifier').minify;
    var encodeURIComponent = window.encodeURIComponent;
    
    /**
     * Creates a new Exporter.
     *
     * @class
     */
    function Exporter() {
        var $html;
        
        /**
         * Get an Array of all Nodes, including their decendant Nodes.
         *
         * @param  NodeList  nodes
         * @return Array
         */
        var getAllNodes = function(nodes) {
            var nodeArray = [];
            
            // Loop over nodes
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes.item(i);
                
                // If node has childNodes, recurse function on childNodes and merge the result with the nodeArray.
                if (node.hasChildNodes()) {
                    nodeArray = nodeArray.concat(getAllNodes(node.childNodes));
                }
            }
            
            // Add the current set of nodes to the nodeArray
            return nodeArray.concat(Array.from(nodes));
        };
        
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
        
        var normalizeCapitalisation = function(node) {
            var regex = /\b(?:[A-Z]{2,}(?:\W+[A-Z]+)*|[A-Z]+(?:\W+[A-Z]{2,})+)\b/g; // Regex to capture ALL CAPS substrings.
            var parentNode = node.parentNode;
            
            // If there is a parentNode and the parentNode is an Element Node.
            if (parentNode && parentNode.nodeType == Node.ELEMENT_NODE) {
                var $parent = $(parentNode);
                var $uppercaseElement = $parent.filter(function() {
                    return $(this).css('text-transform') === 'uppercase';
                });
                
                // If the parentNode has text-transform: uppercase, normalize the textContent's capitalisation to ucwords.
                if ($uppercaseElement.length) {
                    node.textContent = node.textContent.toLowerCase().ucwords();
                } else {
                    var text = node.textContent;
                    var matches = text.match(regex);
                    
                    // If we have ALL CAPS substrings
                    if (matches) {
                        // normalize the capitalisation to ucwords and wrap in an .upperCase span
                        text = text.replace(regex, function(match) {
                            return '<span class="upperCase">' + match.toLowerCase().ucwords() + '</span>';
                        });
                        
                        // Turn the resulting string back into an Array of Nodes.
                        var newNodes = Array.from($.parseHTML(text));
                        
                        // Grab the last Node of the Array.
                        var replaceNode = newNodes.pop();
                        
                        // Replace the original node with the last Node from the array.
                        parentNode.replaceChild(replaceNode, node);
                        
                        // Insert all other Nodes before the replaced Node. Seems to be the only way to do this through the native DOM API.
                        for (var j = 0; j < newNodes.length; j++) {
                            parentNode.insertBefore(newNodes[j], replaceNode);
                        }
                    }
                }
            }
        };
        
        var cleanUp = function($container) {
            removeVideo();
            trimBreakTags();
            removeStyleAttributes();
            
            var nodes = getAllNodes($container.get(0).childNodes);
            
            // Loop over all Nodes and normalize Text Nodes' content.
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                
                if (node.nodeType == Node.TEXT_NODE) {
                    normalizeCapitalisation(node);
                }
            }
        };
        
        var getHtml = function($elements) {
            var $cloneContainer = getCloneContainer();
            var html;
            
            clearHtml();
            
            $elements.clone().appendTo($cloneContainer);
            
            cleanUp($cloneContainer);
            
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
        
        /**
         * Get the current page as an Object.
         *
         * @returns {object}
         */
        this.toJSON = function() {
            return {
                credits: getCreditsHtml(),
                content: getContentHtml(),
                video: getVideoHtml()
            };
        };
        
        /**
         * Export the page to console. Mainly for testing.
         */
        this.toConsole = function() {
            console.file('infoBlocks.html', getContentHtml());
            console.file('credits.html', getCreditsHtml());
            
            var video = getVideoHtml();
            
            if (video) {
                console.file('script.html', video);
            }
        };
        
        // Holy shit this is possible this is so freaking cool.
        /**
         * Download the page files as a zip.
         */
        this.toFile = function() {
            var zip = new JsZip();
            var page = 'page_' + app.Page.getNumber();
            var $a = $('<a/>');
            
            $a.hide().appendTo(app.$body);
            
            zip.folder(page + '/' + app.getLanguage())
                .file('infoBlocks.html', getContentHtml())
                .file('credits.html', getCreditsHtml());
            
            var video = getVideoHtml();
            
            if (video) {
                zip.file(page + '/common/script.html', video);
            }
            
            $a.attr('href', 'data:application/zip;base64,' + zip.generate({type: 'base64'}))
                .attr('download', page + '.zip');
            
            $a.get(0).click();
            $a.remove();
        };
    }
    
    app.modules.Exporter = Exporter;
})(window, jQuery, JSZip, require, MagTool);
