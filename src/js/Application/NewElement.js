/* globals magazineBuilder */

(function(window, $, app) {
    function NewElement() {
        
        // If a slug exists, add the new element after the slug, else add it to the top of the page
        var addToDom = function($element) {
            app.ContentEditor.deselectAll();
            var $selectable = app.Page.getContent();
            
            var $slug = app.Slug.findSlug();
            
            if ($slug.length) {
                $slug.after($element);
            } else {
                $element.prependTo(app.Page.getContent());
            }
            
            app.ContentEditor.applyEdit($element);
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
            console.log("Creating image element");
            var $imageElement = '<div class="draggable editable resizable span-9 textAlignCenter push-down-18 push-right-18"><img src="" data-img-src@2x="" alt="" title="" height="200" width="200"></div>';
            addToDom($imageElement);
        };
        
        // Create New CTA Element
        this.newCTA = function() {
            console.log("Creating CTA element");
            var $ctaElement = '<div class="draggable editable resizable textAlignCenter span-11 btnShopThe pull-up-1-a push-right-37-c"><a data-magtool="ntk" href="${CtaLinkXML[\'ntk\'].@url}">SHOP THE SELECTION</a></div>';
            addToDom($ctaElement);
        };
    }
    
    app.modules.NewElement = NewElement;
})(window, jQuery, MagTool);
