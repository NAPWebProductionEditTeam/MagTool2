/* globals magazineBuilder */

(function(window, $, app) {
    function NewElement() {
        
        // Add the new element to the DOM
        var addToDom = function($element) {
            var $selectable = app.Page.getContent();

            // If a slug exists, add the new element after the slug, else add it to the top of the page
            var $slug = app.Slug.findSlug();

            if ($slug.length) {
                $slug.after($element);
            } else {
                $element.prependTo(app.Page.getContent());
            }
            
            // Deselect all other elements
            app.ContentEditor.deselectAll();
            
            // If the new element is text or CTA make it editable
            app.ContentEditor.applyEdit($element);
            
            // Select the new Element
            app.ContentEditor.select($element);
        };
        
        // Create New Text Element
        this.newText = function() {
            var $newDiv = $('<div/>', {
                class: 'span-12 textAlignCenter push-down-18 push-right-18 editable resizable draggable ui-selectee'
            });
            $newDiv.text('NEW EMPTY TEXT ELEMENT');
            addToDom($newDiv);
        };
        
        // Create New Image Element
        this.newImage = function() {
            var $newDiv = $('<div/>', {
                class: 'span-12 textAlignCenter push-down-18 push-right-18 resizable draggable ui-selectee'
            });

            $newDiv.append('<img src="http://lorempixel.com/image_output/cats-q-c-200-200-9.jpg" alt="net-a-porter" data-img-src@2x="http://lorempixel.com/image_output/cats-q-c-200-200-9.jpg" />');
            console.log("img = " + $newDiv);
            addToDom($newDiv);
        };
        
        // Create New CTA Element
        this.newCTA = function() {
            var $newDiv = $('<div/>', {
                class: 'btnShopThe span-12 textAlignCenter push-down-18 push-right-18 editable resizable draggable ui-selectee'
            });
            $newDiv.append('<a data-magtool="ntk" href="${CtaLinkXML[\'ntk\'].@url}">SHOP THE SELECTION</a>');
            addToDom($newDiv);
        };
    }
    
    app.modules.NewElement = NewElement;
})(window, jQuery, MagTool);
