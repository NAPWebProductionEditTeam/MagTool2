/* globals magazineBuilder */

(function(window, $, app, Argument) {
    function NewElement() {
        
        /**
         * Add the new element to the DOM
         *
         * @param   {jQuery}  $el
         */
        var addToDom = function($el) {
            app.Page.getContent().find('.draggable, .resizable, .editable').last().after($el);
            app.ContentEditor.applyInteractions($el);
            
            // Select the new Element
            app.ContentEditor.selectOnly($el);
        };
        
        /**
         * Create a new container div.
         *
         * @param   {string} interactions
         * @returns {jQuery}
         */
        var createContainer = function(classes, size) {
            classes = Argument.default(classes, '');
            size = Argument.default(size, 0);
            
            var $container = $('<div/>');
            
            if (size === 0) {
                size = '';
            } else {
                size = 'span-' + size + ' ';
            }
            
            return $container.addClass(size + 'push-down-18 push-right-18 ui-selectee ' + classes);
        };
        
        /**
         * Create New Text Element.
         */
        this.newText = function(ClassType) {
            
            var $container;
            $container = createContainer(ClassType + ' draggable resizable editable', 12);
            
            var $p = $('<p/>');
            
            $p.text("Geronimo! I once spent a hell of a long time trying to get a gobby Australian to Heathrow airport. Oh, I always rip out the last page of a book. Then it doesn't have to end. I hate endings! There are fixed points throughout time where things must stay exactly the way they are. This is not one of them. This is an opportunity! Whatever happens here will create its own timeline, its own reality, a temporal tipping point. The future revolves around you, here, now, so do good! Overconfidence, this, and a small screwdriver. I’m absolutely sorted.")
              .appendTo($container);
            
            addToDom($container);
        };
        
        /**
         * Create New Image Element.
         */
        this.newImage = function() {
            var $container = createContainer('draggable');
            var $img = $('<img/>');
            
            $img.attr('src', 'http://placehold.it/200/222/fff')
                .attr('width', 200)
                .attr('data-img-src-2x', 'http://placehold.it/400/222/fff')
                .attr('alt', 'net-a-porter')
                .appendTo($container);
            
            $img.load(function() {
                addToDom($container);
            });
        };
        
        /**
         * Create New CTA Element.
         */
        this.newCTA = function() {
            var $container = createContainer('btnShopThe textAlignCenter resizable draggable', 12);
            var $a = $('<a/>');
            
            $a.attr('href', '')
              .attr('data-magtool', 'ntk')
              .text('SHOP THE SELECTION')
              .appendTo($container);
            
            addToDom($container);
        };
    }
    
    app.registerModule('NewElement', NewElement);
})(window, jQuery, MagTool, Argument);
