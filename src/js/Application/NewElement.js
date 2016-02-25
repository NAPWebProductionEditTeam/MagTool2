/* globals magazineBuilder */

(function(window, $, app) {
    function NewElement() {
        this.newText = function() {
            console.log("CREATING NEW TEXT OBJECT");
            $('<div>TEXT ELEMENT</div>').prependTo(app.Page.getContent());
        };

        this.newImage = function() {
            console.log("CREATING NEW IMAGE OBJECT");
            $('<div><img src="/alfresco/nap/webAssets/magazine/issues/issue_339/need_to_know/fr/page_1/header.png" data-img-src@2x="/alfresco/nap/webAssets/magazine/issues/issue_339/need_to_know/fr/page_1/header@2x.png" alt="Beauty: The beach-fast rules" title="Beauty: The beach-fast rules" height="88" width="239"></div>', {
                class: "draggable push-down-18 push-right-18"
            }).prependTo(app.Page.getContent());
        };
        
        this.newCTA = function() {
            console.log("CREATING NEW CTA OBJECT");
            $('<div><a data-magtool="ntk" href="${CtaLinkXML[\'ntk\'].@url}"> DÉCOUVRIR LA SÉLECTION</a></div>', {
                class: "draggable resizable editable textAlignCenter span-11 btnShopThe pull-up-1-a push-right-37-c"
            }).prependTo(app.Page.getContent());
        };
    }
    
    app.modules.NewElement = NewElement;
})(window, jQuery, MagTool);
