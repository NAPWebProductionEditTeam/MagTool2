(function(window, $, app, Argument, CssEvents) {
    var getComputedStyle = window.getComputedStyle;
    var setTimeout = window.setTimeout;
    var clearTimeout = window.clearTimeout;
    
    function UI() {
        var $mt, $notify, $controls, $mainControlsSection, $mainControls, $pageControlsSection, $pageControls, $selectionSection, $selectionControls, $bottomSection;
        
        this.show = function() {
            var repaint;
            
            repaint = getComputedStyle(app.UI.getUI().get(0)).opacity;
            repaint = getComputedStyle(app.UI.getNotification().get(0)).transform;
            
            $('#magtoolComponents').removeClass('+hide');
            app.UI.getUI().removeClass('--hide');
            
            // Add padding to body the size of the MagTool, and ensure there's no page 'jump' by recalculating the scrollTop.
            if (! app.reloading) {
                var mtHeight = app.UI.getUI().outerHeight();
                    
                app.$body.css({'padding-top': mtHeight});
                $(window).scrollTop($(window).scrollTop() + mtHeight);
            }
        };
        
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
        
        this.getAllControls = function() {
            if (typeof $controls === 'undefined') {
                $controls = this.getUI().find(':input');
            }
            
            return $controls;
        };
        
        this.getMainControlsSection = function() {
            if (typeof $mainControlsSection === 'undefined') {
                $mainControlsSection = this.getUI().find('.main-controls');
            }
            
            return $mainControlsSection;
        };
        
        this.getMainControls = function() {
            if (typeof $mainControls === 'undefined') {
                $mainControls = this.getMainControlsSection().find(':input');
            }
            
            return $mainControls;
        };
        
        this.getPageControlsSection = function() {
            if (typeof $pageControlsSection === 'undefined') {
                $pageControlsSection = this.getUI().find('.page-controls');
            }
            
            return $pageControlsSection;
        };
        
        this.getPageControls = function() {
            if (typeof $pageControls === 'undefined') {
                $pageControls = this.getPageControlsSection().find(':input');
            }
            
            return $pageControls;
        };
        
        this.getSelectionSection = function() {
            if (typeof $selectionSection === 'undefined') {
                $selectionSection = this.getUI().find('.selection-controls');
            }
            
            return $selectionSection;
        };
        
        this.getBottomSection = function() {
            if (typeof $bottomSection === 'undefined') {
                $bottomSection = this.getUI().find('#bottom-section');
            }
            
            return $bottomSection;
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
        
        this.showEditTools = function() {
            app.Slug.detectSlugProperties();
            app.Credits.detectVisibility();
            this.getUI().find('.page-controls').addClass('--show');
        };
        
        this.hideEditTools = function() {
            this.getUI().find('.page-controls').removeClass('--show');
        };
        
        var notifyTimer;
        var notifyIcon = 'bell';
        
        this.notify = function(title, body, icon, time) {
            body = Argument.default(body, '');
            icon = Argument.default(icon, 'bell');
            time = Argument.default(time, 5000);
            
            var $notify = this.getNotification();
            
            if (notifyTimer) {
                clearTimeout(notifyTimer);
            }
            
            $notify.find('header').text(title);
            $notify.find('main').text(body);
            $notify.find('.notification\\/icon').removeClass('fa-' + notifyIcon).addClass('fa-' + icon);
            $notify.addClass('--open');
            
            notifyIcon = icon;
            
            if (time > 0) {
                notifyTimer = setTimeout(function() {
                    $notify.removeClass('--open');
                }, time);
            } else {
                notifyTimer = null;
            }
        };
    }
    
    app.registerModule('UI', UI);
})(window, jQuery, MagTool, Argument, CssEvents);
