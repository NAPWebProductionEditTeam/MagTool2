(function(window, $, app, CssEvents) {
    function UI() {
        var $mt, $notify, $mainControls, $pageControls, $selectionSection, $selectionControls;
        
        this.getUI = function() {
            if (typeof $mt === 'undefined') {
                $mt = $('#magtool');
            }
            
            return $mt;
        };
        
        this.getNotification = function() {
            if (typeof $notify === 'undefined') {
                $notify = $('#notify');
            }
            
            return $notify;
        };
        
        this.getMainControls = function() {
            if (typeof $mainControls === 'undefined') {
                $mainControls = this.getUI().find('.main-controls :input');
            }
            
            return $mainControls;
        };
        
        this.getPageControls = function() {
            if (typeof $pageControls === 'undefined') {
                $pageControls = this.getUI().find('.page-controls :input');
            }
            
            return $pageControls;
        };
        
        this.getSelectionSection = function() {
            if (typeof $selectionSection === 'undefined') {
                $selectionSection = this.getUI().find('.selection-controls');
            }
            
            return $selectionSection;
        };
        
        this.getSelectionControls = function() {
            if (typeof $selectionControls === 'undefined') {
                $selectionControls = this.getUI().find('.selection-controls :input');
            }
            
            return $selectionControls;
        };
        
        this.showBtn = function(group, button) {
            var $group = $('#' + group);
            
            $group.find('.btn').removeClass('--show').addClass('--hide');
            
            if ($group.hasClass('--loading')) {
                $group.find('[data-name="' + button + '"]').removeClass('--hide');
            } else {
                $group.find('[data-name="' + button + '"]').removeClass('--hide').addClass('--show').on(CssEvents.transitionEvent(), function() {
                    $(this).off(CssEvents.transitionEvent()).removeClass('--show');
                });
            }
        };
        
        this.btnGroupLoading = function(group) {
            $('#' + group).addClass('--loading');
        };
        
        this.btnGroupLoaded = function(group) {
            $('#' + group).removeClass('--loading');
        };
        
        this.enable = function($controls) {
            $controls.prop('disabled', true);
        };
        
        this.disable = function($controls) {
            $controls.prop('disabled', false);
        };
    }
    
    app.modules.UI = UI;
})(window, jQuery, MagTool, CssEvents);
