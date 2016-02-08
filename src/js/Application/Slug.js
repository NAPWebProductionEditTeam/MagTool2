/* globals magazineBuilder */

(function(window, $, app) {
    function Slug() {
        var slugLeftClass = 'push-right-0';
        var slugRightClass = 'pull-left-0';

        var createNewSlug = function() {
            return $('<div/>', {
                class: 'editSlug push-down-0'
            });
        };

        this.findSlug = function() {
            return app.Page.get().find('.editSlug, .beautySlug, .travelSlug');
        };

        this.detectSlugProperties = function() {
            var $slug = this.findSlug();
            
            if ($slug.hasClass(slugLeftClass)) {
                $('#slugLeft').prop('checked', true);
            } else if ($slug.hasClass(slugRightClass)) {
                $('#slugRight').prop('checked', true);
            }

            if ($slug.length) {
                app.$mt.find('select[name="slug-type"]').val($slug.attr('class').replace(/.*?(\w+Slug).*/, '$1'));
            }
        };
        
        this.move = function(position) {
            var $slug = this.findSlug();
            
            if (position === 'left' || position === 'right') {
                if (! $slug.length) {
                    $slug = createNewSlug().prependTo(app.Page.getContent());
                }
            }
            
            switch(position) {
                case 'left':
                    $slug.removeClass(slugRightClass).addClass(slugLeftClass);
                    break;
                case 'right':
                    $slug.removeClass(slugLeftClass).addClass(slugRightClass);
                    break;
                default:
                    $slug.remove();
                    break;
            }
        };
        
        this.change = function(type) {
            var $slug = this.findSlug();
           
            switch(type) {
                case 'beautySlug':
                    $slug.removeClass('editSlug travelSlug').addClass('beautySlug');
                    break;
                case 'travelSlug':
                    $slug.removeClass('editSlug beautySlug').addClass('travelSlug');
                    break;
                default:
                    $slug.removeClass('beautySlug travelSlug').addClass('editSlug');
                    break;
            }
        };

    }
    
    app.modules.Slug = Slug;
})(window, jQuery, MagTool);
