(function(window, $, app) {
    function CtaEditor() {
        this.detectSelectedCta = function() {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();
            var $oldCta = $selected.find('a').attr('data-magtool');

            if ($selected.is('.btnShopThe') || $selected.is('.btnShopTheWhite')) {
                $selectionControls.filter('#CTA').val($oldCta);

                if ($selected.is('.btnShopThe')) {
                    $selectionControls.filter('#ctaBlack').prop('checked', true);
                    $selectionControls.filter('#ctaWhite').prop('checked', false);

                } else {
                    $selectionControls.filter('#ctaWhite').prop('checked', true);
                    $selectionControls.filter('#ctaBlack').prop('checked', false);
                }
            } else {
                $selectionControls.filter('#CTA').val('NO CTA');
            }
        };

        this.changeCta = function(cta) {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();
            var $oldCta = $selected.find('a').attr('data-magtool');
            cta = $selectionControls.filter('#CTA').val();

            if (cta !== $oldCta && $selected.is('.btnShopThe')) {
                $selected.find('a').attr('data-magtool', cta);
            }
        };

        this.changeCtaColor = function(ctaColor) {
            var $selected = app.ContentEditor.getSelection();
            var $selectionControls = app.UI.getSelectionControls();
            $selected.removeClass('btnShopThe btnShopTheWhite');

            if (ctaColor == 'ctaBlack') {
                $selected.addClass('btnShopThe');
            } else {
                $selected.addClass('btnShopTheWhite');
            }
        };
    }

    app.modules.CtaEditor = CtaEditor;
})(window, jQuery, MagTool);
