/* globals magazineBuilder */

(function(window, $, app) {
    function NewElement() {
        
        // If a slug exists, add the new element after the slug, else add it to the top of the page
        var addToDom = function($element) {
            var $selectable = app.Page.getContent();
            console.log("ADDING " + $element + " TO DOM");
            var $slug = app.Slug.findSlug();

            if ($slug.length) {
                console.log("Placing after slug");
                $slug.after($element);
            } else {
                console.log("placing at top of page");
                $element.prependTo(app.Page.getContent());
            }

            app.ContentEditor.select($element);
        };
        
        // Create New Text Element
        this.newText = function() {
            console.log("Creating text element");
            addToDom('<div class="span-12 textAlignCenter draggable resizable push-down-18 push-right-18">TEXT ELEMENT</div>');
        };
        
        // Create New Image Element
        this.newImage = function() {
            console.log("Creating image element");
            var $imageElement = '<div class="span-9 textAlignCenter draggable resizable push-down-18 push-right-18"><img src="" data-img-src@2x="" alt="" title="" height="200" width="200"></div>';
            addToDom($imageElement);
        };
        
        // Create New CTA Element
        this.newCTA = function() {
            console.log("Creating CTA element");
            var $ctaElement = '<div class="draggable resizable editable textAlignCenter span-11 btnShopThe pull-up-1-a push-right-37-c"><a data-magtool="ntk" href="${CtaLinkXML[\'ntk\'].@url}">SHOP THE SELECTION</a></div>';
            addToDom($ctaElement);
        };
    }
    
    app.modules.NewElement = NewElement;
})(window, jQuery, MagTool);
