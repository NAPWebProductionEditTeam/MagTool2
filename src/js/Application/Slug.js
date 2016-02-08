/* globals magazineBuilder */

(function(window, $, app) {
    function Slug (){
        var slugPosRight = function (){
           return $("#magtool").find("#slugRight");
        };
        var slugPosLeft = function(){
            return $("#magtool").find("#slugLeft");
        };
        var slugPosNone : function(){
            return $("#magtool").find("#slugNone");
        };

        var newSlug = function(){
            return jQuery('<div/>', {
                class: 'editSlug push-down-0'
            });
        };
        var pushright = "push-right-0";
        var pullleft = "pull-left-0";

        this.findSlug = function (){
            return app.Page.get().find(".editSlug, .beautySlug, .travelSlug")
        };

        this.getSlug = function() {
            if (this.findSlug().hasClass(this.pushright)) {
                this.slugPosLeft().prop("checked", true);
            } else if (this.findSlug().hasClass(this.pullleft)) {
                this.slugPosRight().prop("checked", true);
            } else {
                this.slugPosNone().prop("checked", true);
            }

            if (this.findSlug().length) {
                $("#magtool select[name:'slug-type']").val(this.findSlug().attr('class').replace(/.*?(\w+Slug).*/, '$1'));
            }
        };

           this.change=function () {

                switch($(this).val()) {
                    case 'beautySlug':
                        $this.findSlug().removeClass('editSlug travelSlug').addClass('beautySlug');
                        break;
                    case 'travelSlug':
                        $this.findSlug().removeClass('editSlug beautySlug').addClass('travelSlug');
                        break;
                    default:
                        $this.findSlug().removeClass('beautySlug travelSlug').addClass('editSlug');
                        break;
                }
            };

    }

    };
    app.modules.Slug=Slug;
})(window, jQuery, MagTool);
