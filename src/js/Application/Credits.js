/* globals magazineBuilder */

(function(window, $, app) {
    function Credits (){
        var getCreditHolder=function(){
            return app.Page.get().find('[class^="creditsHolder"]');
        };
        var getCreditWhole=function(){
            return app.Page.get().find('[class^="creditsWhole"]');
        };
        this.togglePosition = function(){
            var creditsHolder = getCreditHolder();
            var creditsWhole = getCreditWhole();
            if(creditsHolder.is('creditsWholeRight')) {
                creditsHolder.addClass('creditsWholeLeft').removeClass('creditsWholeRight');
            }else {
                creditsHolder.addClass('creditsWholeRight').removeClass('creditsWholeLeft');
            }
        };

        this.toggleColor = function(){
            var creditsHolder = getCreditHolder();
            var creditsWhole = getCreditWhole();
            creditsHolder.toggleClass('white');

        };

        this.toggle = function(){
            var creditsHolder = getCreditHolder();
            var creditsWhole = getCreditWhole();
            creditsHolder.toggleClass('creditsNone');
            creditsWhole.toggleClass('creditsNone');


        };

    }


    app.modules.Credits=Credits;
})(window, jQuery, MagTool);
