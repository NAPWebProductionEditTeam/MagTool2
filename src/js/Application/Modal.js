(function(window, $, app, Argument) {
    var Date = window.Date;
    
    function Modal() {
        var $modal, $dialog, $header, $title, $content, $modal_blocks;
        var type;
        var typeBlocks = {};
        var resized = false;
        
        var init = function(_type) {
            type = _type;
            
            if (typeof $modal !== 'undefined') {
                return;
            }
            
            $modal = $('#modal');
            $dialog = $modal.find('.modal-dialog');
            $header = $modal.find('.modal-header');
            
            $title = $modal.find('.modal-title');
            
            $modal_blocks = $modal.find('[data-modal-type]');
            
            $modal.modal({
                show: false
            });
            
            $modal.on('hidden.bs.modal', function() {
                resized = false;
            });
            
            $modal.on('show.bs.modal', function() {
                if (! resized) {
                    app.Modal.size();
                }
            });
        };
        
        var getBlocks = function() {
            if (typeof typeBlocks[type] === 'undefined') {
                typeBlocks[type] = $modal.find('[data-modal-type~="' + type + '"]');
            }
            
            return typeBlocks[type];
        };
        
        var getBody = function() {
            var bodyType = type + ':body';
            
            if (typeof typeBlocks[bodyType] === 'undefined') {
                typeBlocks[bodyType] = getBlocks(type).filter('.modal-body');
            }
            
            return typeBlocks[bodyType];
        };
        
        var getContent = function() {
            var contentType = type + ':content';
            
            if (typeof typeBlocks[contentType] === 'undefined') {
                typeBlocks[contentType] = getBody(type).find('p');
            }
            
            return typeBlocks[contentType];
        };
        
        var getFooter = function() {
            var footerType = type + ':footer';
            
            if (typeof typeBlocks[footerType] === 'undefined') {
                typeBlocks[footerType] = getBlocks(type).filter('.modal-footer');
            }
            
            return typeBlocks[footerType];
        };
        
        this.init = init;
        this.getTypeBlocks = getBlocks;
        
        var setTitle = function(title) {
            if (title) {
                $header.removeClass('+hide');
                $title.text(title);
            } else {
                $header.addClass('+hide');
            }
        };
        
        var setContent = function(title, content) {
            setTitle(title);
            
            var $body = getBody();
            var $content = getContent();
            
            if (content) {
                $body.removeClass('+hide');
                $content.text(content);
            } else {
                $body.addClass('+hide');
            }
        };
        
        this.confirm = function(e, title, content, ok, cancel) {
            init('confirm');
            
            title = Argument.default(title, false);
            content = Argument.default(content, false);
            ok = Argument.default(ok, 'Continue');
            cancel = Argument.default(cancel, 'Cancel');
            
            var $confirm = getBlocks();
            var fire = ! e.isDefaultPrevented();
            
            // Cancel event
            e.preventDefault();
            
            // Show appropriate blocks
            $modal_blocks.addClass('+hide');
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
            init('alert');
            
            title = Argument.default(title, false);
            content = Argument.default(content, false);
            ok = Argument.default(ok, 'Okay');
            
            var $alert = getBlocks('alert');
            
            // Show appropriate blocks
            $modal_blocks.addClass('+hide');
            $alert.removeClass('+hide');
            
            // Set content
            setContent(title, content);
            $alert.find('[data-dismiss]').text(ok);
            
            // Show modal
            $modal.modal('show');
        };
        
        // Usage: select('title', {'': '-- Please select --', red: 'Red', blue: 'Blue'})
        //          .done(function(v) { console.log(v); })
        //          .fail(function() { console.error('failed'); });
        this.select = function(title, options, cancel) {
            init('select');
            
            title = Argument.default(title, false);
            options = Argument.default(options, false);
            cancel = Argument.default(cancel, 'Cancel');
            
            if (! options) {
                return console.err('Options argument must be defined!');
            }
            
            var Deferred = $.Deferred();
            var $select = getBlocks('select');
            
            // Show appropriate blocks
            $modal_blocks.addClass('+hide');
            $select.removeClass('+hide');
            
            setTitle(title);
            $select.find('[data-dismiss]').text(cancel);
            
            var $input = $select.find('#modal-select');
            
            for (var option in options) {
                var $option = $('<option/>');
                
                $option.attr('value', option);
                $option.text(options[option]);
                $option.appendTo($input);
            }
            
            $modal.modal('show');
            
            $input.change(function(e) {
                var val = $(this).val();
                
                if (val) {
                    Deferred.resolve(val, e);
                    
                    $modal.modal('hide');
                }
            });
            
            $modal.on('hide.bs.modal', function(e) {
                Deferred.reject(e);
            });
            
            Deferred.always(function() {
                $input.off('change');
                $modal.off('hide.bs.modal');
                
                $input.empty();
            });
            
            return Deferred;
        };
        
        this.size = function(size) {
            $dialog.removeClass('modal-sm modal-lg');
            resized = true;
            
            switch (size) {
                case 's':
                case 'sm':
                case 'small':
                    $dialog.addClass('modal-sm');
                    break;
                case 'l':
                case 'lg':
                case 'large':
                    $dialog.addClass('modal-lg');
                    break;
            }
            
            // For chaining...
            return this;
        };
    }
    
    app.registerModule('Modal', Modal);
})(window, $, MagTool, Argument);

