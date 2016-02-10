(function(window, $, app) {
    function UI() {
        this.showBtn = function(group, button) {
            var $group = $('#' + group);
            
            $group.find('.btn:not(.\\--loader)').addClass('--hidden');
            $group.find('[data-name="' + button + '"]').removeClass('--hidden');
        };
        
        this.btnGroupLoading = function(group) {
            $('#' + group).addClass('--loading');
        };
        
        this.btnGroupLoaded = function(group) {
            $('#' + group).removeClass('--loading');
        };
    }
    
    app.modules.UI = UI;
})(window, jQuery, MagTool);
