(function(window, $, Argument, JsZip, require, app) {
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
         * @param   {NodeList}  nodes
         * @returns {Array}
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
        
        /**
         * Ensure none of the textContent is actually in ALL CAPS. Good for SEO.
         *
         * @param   {Node}  node
         */
        var normalizeCapitalisation = function(node) {
            var regex = /\b(?:[A-Z]{2,}(?:\W+[A-Z]+)*|[A-Z]+(?:\W+[A-Z]{2,})+)\b/g; // Regex to capture ALL CAPS substrings.
            var parentNode = node.parentNode;
            
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
        };
        
        var joinDuplicateNodes = function(node) {
            if (node.nodeType !== Node.ELEMENT_NODE || $.inArray(node.tagName, ['DIV', 'P', 'BR', 'AREA']) > -1) {
                return;
            }
            
            var next = node.nextSibling;
            var removeNodes = [];
            var appendNode = null;
            
            while (next !== null) {
                if (next.nodeType === Node.ELEMENT_NODE && node.tagName === next.tagName && node.className === next.className) {
                    var children = Array.from(next.childNodes);
                    
                    if (appendNode !== null) {
                        node.appendChild(appendNode);
                    }
                    
                    for (var i = 0; i < children.length; i++) {
                        node.appendChild(children[i]);
                    }
                    
                    removeNodes.push(next);
                } else if (next.nodeType === Node.ELEMENT_NODE && next.tagName === 'BR') {
                    appendNode = next;
                } else if (next.nodeType === Node.TEXT_NODE && next.textContent.match(/^\s*$/)) {
                    if (next.textContent.match(/^\s+$/) && appendNode === null) {
                        appendNode = next;
                    }
                } else {
                    break;
                }
                
                next = next.nextSibling;
            }
            
            for (var j = 0; j < removeNodes.length; j++) {
                removeNodes[j].parentNode.removeChild(removeNodes[j]);
            }
        };
        
        /**
         * Ensure braces are always outside em tags and colon always inside em tag.
         *
         * @param   {jQuery}  $container
         */
        var normalizeEmContent = function($container) {
            $container.find('em').each(function() {
                var em = this;
                var prev = em.previousSibling;
                var next = em.nextSibling;
                var parent = em.parentNode;
                
                var $em = $(em);
                var matches;
                
                // If there is a nextSibling and it starts with a colon, move the colon inside the em tag.
                if (next && next.textContent.match(/^:/)) {
                    next.textContent = next.textContent.slice(1, next.textContent.length);
                    $em.text($(em).text() + ':');
                }
                
                matches = $(em).text().match(/^(\s*(?:\(|\[|{|\s)+\s*)/);
                
                // If the content starts with a brace, optionally preceded by whitespace, move it to the previousSibling Node.
                if (matches) {
                    // If there is no previous sibling, create a new Text Node.
                    if (! prev) {
                        prev = new Text();
                        
                        parent.insertBefore(prev, em);
                    }
                    
                    prev.textContent = prev.textContent + matches[1];
                    $em.text($(em).text().replace(matches[1], ''));
                }
                
                matches = $(em).text().match(/(\s*(?:\)|\]|}|\s)+\s*)$/);
                
                // If the content ends with a brace, optionally proceded by whitespace, move it to the nextSibling Node.
                if (matches) {
                    // If there is no next sibling, create a new Text Node.
                    if (! next) {
                        next = new Text();
                        
                        parent.appendChild(next);
                    }
                    
                    next.textContent = matches[1] + next.textContent;
                    $em.text($(em).text().replace(matches[1], ''));
                }
            });
        };
        
        var removeVideo = function($container) {
            $container.find('.videoLoader').children().remove();
        };
        
        var trimBreakTags = function($container) {
            $container.find('br').each(function() {
                var br = this;
                var prev = br.previousSibling;
                var next = br.nextSibling;
                
                if (! prev || (next && ! next.textContent.match(/^[\s\t\n]*$/))) {
                    return;
                }
                
                if (prev.nodeType == Node.TEXT_NODE && prev.textContent.match(/^[\s\t\n]*$/)) {
                    var prevEmpty = true;
                    
                    while ((prev = prev.previousSibling) !== null) {
                        if (! (prev.nodeType == Node.TEXT_NODE && prev.textContent.match(/^[\s\t\n]*$/))) {
                            prevEmpty = false;
                        }
                    }
                    
                    if (prevEmpty) {
                        return;
                    }
                }
                
                var parent = br.parentNode;
                
                parent.removeChild(br);
            });
        };
        
        var removeStyleAttributes = function($container) {
            $container.find('[style]:not(.videoLoader)').removeAttr('style');
        };
        
        var prepareCtaForTemplate = function($container) {
            var $ctaLinks = $container.find('a[data-magtool]');
            
            $ctaLinks.each(function() {
                var $this = $(this);
                
                $this.attr('href', "${CtaLinkXML['" + $this.data('magtool') + "'].@url}");
            });
        };
        
        var cleanUp = function() {
            var $container = app.Page.getContent();
            var nodes = getAllNodes($container.get(0).childNodes);
            
            // Loop over all Nodes and normalize Text Nodes' content.
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                
                if (node.nodeType == Node.TEXT_NODE) {
                    normalizeCapitalisation(node);
                } else if (node.nodeType == Node.ELEMENT_NODE) {
                    joinDuplicateNodes(node);
                }
            }
            
            normalizeEmContent($container);
        };
        
        var cleanUpForServer = function($container) {
            removeVideo($container);

            //            trimBreakTags($container);
            removeStyleAttributes($container);
            prepareCtaForTemplate($container);
        };
        
        var getHtml = function($elements) {
            var $cloneContainer = getCloneContainer();
            var html;
            
            cleanUp();
            
            clearHtml();
            $elements.clone().appendTo($cloneContainer);
            
            cleanUpForServer($cloneContainer);
            
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
            return getHtml(app.Page.get().find('[class*="credits"]'));
        };
        
        var getContentHtml = function() {
            return getHtml(app.Page.get().find('.magazineContent > div:not([class*="credits"]):not(.edLetterList):not(.videoHolder)'));
        };
        
        var getScriptHtml = function() {
            var $elements = app.Page.getContent().find('script');
            $elements.add(app.Page.get().find('.videoHolder'));
            
            return getHtml($elements);
        };
        
        var script;
        
        /**
         * Grab the script before editing so we can detect changes to the script.html.
         */
        this.beforeEdit = function() {
            script = getScriptHtml();
        };
        
        /**
         * Check if the script html has changed.
         *
         * @returns {boolean}
         */
        this.scriptHasChanged = function() {
            return script !== getScriptHtml();
        };
        
        /**
         * Get the current page as an Object.
         *
         * @returns {object}
         */
        this.toJSON = function() {
            return {
                infoBlocks: getContentHtml(),
                credits: getCreditsHtml(),
                script: getScriptHtml()
            };
        };
        
        /**
         * Export the page to console. Mainly for testing.
         */
        this.toConsole = function(files) {
            files = Argument.default(files, ['infoBlocks', 'credits', 'script']);
            
            if ($.inArray('infoBlocks', files) > -1) {
                console.file('infoBlocks.html', getContentHtml());
            }
            
            if ($.inArray('credits', files) > -1) {
                console.file('credits.html', getCreditsHtml());
            }
            
            if ($.inArray('script', files) > -1) {
                console.file('script.html', getScriptHtml());
            }
        };
        
        // Holy shit this is possible this is so freaking cool.
        /**
         * Download the page files as a zip.
         */
        this.toFile = function(files) {
            files = Argument.default(files, ['infoBlocks', 'credits', 'script']);
            
            var zip = new JsZip();
            var page = 'page_' + app.Page.getNumber();
            var lang = app.getLanguage();
            var $a = $('<a/>');
            
            $a.hide().appendTo($('#magtoolComponents'));
            
            if (typeof files === 'string') {
                files = files.split(/[,\s]+/);
            }
            
            if ($.inArray('infoBlocks', files) > -1 || $.inArray('infoblocks', files) > -1) {
                zip.file(page + '/' + lang + '/infoBlocks.html', getContentHtml());
            }
            
            if ($.inArray('credits', files) > -1) {
                zip.file(page + '/' + lang + '/credits.html', getCreditsHtml());
            }
            
            if ($.inArray('script', files) > -1) {
                zip.file(page + '/common/script.html', getScriptHtml());
            }
            
            $a.attr('href', 'data:application/zip;base64,' + zip.generate({type: 'base64'}))
                .attr('download', page + '.zip');
            
            $a.get(0).click();
            $a.remove();
        };
    }
    
    app.registerModule('Exporter', Exporter);
})(window, jQuery, Argument, JSZip, require, MagTool);
