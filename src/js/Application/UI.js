(function(window, $, app, CssEvents) {
    var setTimeout = window.setTimeout;
    var clearTimeout = window.clearTimeout;
    
    function UI() {
        var $mt, $notify, $controls, $mainControlsSection, $mainControls, $pageControlsSection, $pageControls, $selectionSection, $selectionControls;
        
        this.show = function() {
            // dirty but that's the only way I could get it to work 100% of the time.
            setTimeout(function() {
                var repaint = app.UI.getUI().get(0).offset;
                
                $('#magtoolComponents').removeClass('+hide');
                app.UI.getUI().removeClass('--hide');
                
                // Add padding to body the size of the MagTool, and ensure there's no page 'jump' by recalculating the scrollTop.
                if (! app.reloading) {
                    var mtHeight = app.UI.getUI().outerHeight();
                    
                    app.$body.css({'padding-top': mtHeight});
                    $(window).scrollTop($(window).scrollTop() + mtHeight);
                }
            }, 0);
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
            this.getUI().find('.page-controls').addClass('--show');
        };

        this.hideEditTools = function() {
            this.getUI().find('.page-controls').removeClass('--show');
        };

        var notifyTimer;
        
        this.notify = function(title, body, time) {
            var $notify = this.getNotification();
            
            if (notifyTimer) {
                clearTimeout(notifyTimer);
            }
            
            if (typeof body === 'undefined' || body === null) {
                body = '';
            }
            
            if (typeof time === 'undefined' || time === null) {
                time = 5000;
            }
            
            $notify.find('header').text(title);
            $notify.find('main').text(body);
            $notify.addClass('--open');
            
            if (time > 0) {
                notifyTimer = setTimeout(function() {
                    $notify.removeClass('--open');
                }, time);
            } else {
                notifyTimer = null;
            }
        };
    }
    
    app.modules.UI = UI;
})(window, jQuery, MagTool, CssEvents);
