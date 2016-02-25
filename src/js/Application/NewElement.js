/* globals magazineBuilder */

(function(window, $, app) {
    function NewElement() {
        var newElement = function(type) {
            if (type === "text") {
                return $('<div class="kickerBlockWhite noBG draggable resizable editable black push-right-18 push-down-18 span-8">Lorem</div>');
            }

            if (type === "image") {
                return $('<div class="draggable push-down-18 push-right-18"><img                          src="/alfresco/nap/webAssets/magazine/issues/issue_339/need_to_know/fr/page_1/header.png" data-img-src@2x="/alfresco/nap/webAssets/magazine/issues/issue_339/need_to_know/fr/page_1/header@2x.png" alt="Beauty: The beach-fast rules" title="Beauty: The beach-fast rules" height="88" width="239"></div>');
            }

            return $('<div class="draggable resizable editable textAlignCenter span-11 btnShopThe pull-up-1-a push-right-37-c"><a data-magtool="ntk" href="${CtaLinkXML[\'ntk\'].@url}"> DÉCOUVRIR LA SÉLECTION</a></div>');
        };
    }
    
    app.modules.NewElement = NewElement;
})(window, jQuery, MagTool);
