(function(window, $, app) {
    function UI() {
        this.showBtn = function(group, button) {
            var $group = $('#' + group);
            
            $group.find('.btn:not(.\\--loader)').addClass('--hidden');
            $group.find('[data-name="' + button + '"]').removeClass('--hidden');
        };
        
        this.btnGroupLoading = function(group, message) {
            var $group = $('#' + group);
            
            if (typeof message === 'undefined') {
                message = '';
            }
            
            $group.addClass('--loading');
            $group.find('.loader .message').html(message);
        };
        
        this.btnGroupLoaded = function(group) {
            var $group = $('#' + group);
            
            $group.removeClass('--loading');
        };
    }
    
    app.modules.UI = UI;
})(window, jQuery, MagTool);
