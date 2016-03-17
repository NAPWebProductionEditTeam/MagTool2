/* globals magazineBuilder */

(function(window, $, app) {
    function NewElement() {
        
        /**
         * Add the new element to the DOM
         *
         * @param   {jQuery}  $el
         */
        var addToDom = function($el) {
            var $content = app.Page.getContent();
            var $slug = app.Slug.findSlug();
            
            // If a slug exists, add the new element after the slug, else add it to the top of the page
            if ($slug.length) {
                $slug.after($el);
            } else {
                $el.prependTo($content);
            }
            
            // Deselect all other elements
            app.ContentEditor.deselectAll();
            
            // Apply edit interactions to the new element.
            app.ContentEditor.applyInteractions($el);
            
            // Select the new Element
            app.ContentEditor.select($el);
        };
        
        /**
         * Create a new container div.
         *
         * @param   {string} interactions
         * @returns {jQuery}
         */
        var createContainer = function(interactions) {
            var $container = $('<div/>');
            
            return $container.addClass('span-12 textAlignCenter push-down-18 push-right-18 ui-selectee ' + interactions);
        };
        
        /**
         * Create New Text Element.
         */
        this.newText = function() {
            var $container = createContainer('draggable resizable editable');
            var $p = $('<p/>');
            
            $p.text("Geronimo! I once spent a hell of a long time trying to get a gobby Australian to Heathrow airport. Oh, I always rip out the last page of a book. Then it doesn't have to end. I hate endings! There are fixed points throughout time where things must stay exactly the way they are. This is not one of them. This is an opportunity! Whatever happens here will create its own timeline, its own reality, a temporal tipping point. The future revolves around you, here, now, so do good! Overconfidence, this, and a small screwdriver. I’m absolutely sorted.")
              .appendTo($container);
            
            addToDom($container);
        };
        
        /**
         * Create New Image Element.
         */
        this.newImage = function() {
            var $container = createContainer('resizable draggable');
            var $img = $('<img/>');
            
            $img.attr('src', 'http://lorempixel.com/image_output/cats-q-c-200-200-9.jpg')
                .attr('data-img-src-2x', 'http://lorempixel.com/image_output/cats-q-c-400-400-9.jpg')
                .attr('alt', 'net-a-porter')
                .appendTo($container);
            
            addToDom($container);
        };
        
        /**
         * Create New CTA Element.
         */
        this.newCTA = function() {
            var $container = createContainer('editable resizable draggable');
            var $a = $('<a/>');
            
            $container.addClass('btnShopThe');
            
            $a.attr('href', '')
              .attr('data-magtool', 'ntk')
              .text('SHOP THE SELECTION')
              .appendTo($container);
            
            addToDom($container);
        };
    }
    
    app.modules.NewElement = NewElement;
})(window, jQuery, MagTool);
