(function(window, $, app, CssEvents) {
    function UI() {
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
    }
    
    app.modules.UI = UI;
})(window, jQuery, MagTool, CssEvents);
