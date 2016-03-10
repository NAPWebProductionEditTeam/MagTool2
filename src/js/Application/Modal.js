(function(window, $, app, Argument) {
    var Date = window.Date;
    
    function Modal() {
        var $modal = $('#modal');
        var $header = $modal.find('.modal-header');
        var $body = $modal.find('.modal-body');
        
        var $title = $modal.find('.modal-title');
        var $content = $body.find('p');
        
        var $alert = $modal.find('[data-footer="alert"]');
        var $confirm = $modal.find('[data-footer="confirm"]');
        
        $modal.modal({
            show: false
        });
        
        var setContent = function(title, content) {
            if (title) {
                $header.removeClass('+hide');
                $title.text(title);
            } else {
                $header.addClass('+hide');
            }
            
            if (content) {
                $body.removeClass('+hide');
                $content.text(content);
            } else {
                $body.addClass('+hide');
            }
        };
        
        this.confirm = function(e, title, content, ok, cancel) {
            title = Argument.default(title, false);
            content = Argument.default(content, false);
            ok = Argument.default(ok, 'Confirm');
            cancel = Argument.default(cancel, 'Cancel');
            
            var fire = ! e.isDefaultPrevented();
            
            // Cancel event
            e.preventDefault();
            
            // Show appropriate footer
            $alert.addClass('+hide');
            $confirm.removeClass('+hide');
            
            // Set content
            setContent(title, content);
            $confirm.find('[data-confirm]').text(ok);
            $confirm.find('[data-dismiss]').text(cancel);
            
            // Re-fire event on confirm
            $confirm.find('[data-confirm]').click(function() {
                var Event = e.originalEvent;
                
                Event.cancelBubble = false;
                Event.defaultPrevented = false;
                Event.returnValue = true;
                Event.timeStamp = Date.now();
                
                $modal.modal('hide');
                
                if (typeof e.callback !== 'undefined') {
                    e.callback(e);
                }
                
                if (fire) {
                    if (e.target.dispatchEvent) {
                        e.target.dispatchEvent(Event);
                    } else if (e.target.fireEvent) {
                        e.target.fireEvent(Event);
                    }
                }
            });
            
            // Show modal
            $modal.modal('show');
        };
        
        this.alert = function(title, content, ok) {
            title = Argument.default(title, false);
            content = Argument.default(content, false);
            ok = Argument.default(ok, 'Okay');
            
            // Show appropriate footer
            $confirm.addClass('+hide');
            $alert.removeClass('+hide');
            
            // Set content
            setContent(title, content);
            $alert.find('[data-dismiss]').text(ok);
            
            // Show modal
            $modal.modal('show');
        };
    }
    
    app.modules.Modal = Modal;
})(window, $, MagTool, Argument);

