(function(window,$,app){
   function Align() {

       this.detectSelectedAlignment = function() {
           var elemt =app.Page.get().find('.ui-selected').attr('class');
           var alignment = elemt.replace(/.*?(\w*)text(?:align(\w+))?.*/i, '$1$2').toLocaleLowerCase();

           switch(alignment) {
               case 'center':
                   $('#centerText').prop('checked', true);
                   break;
               case 'right':
                   $('#rightText').prop('checked', true);
                   break;
               default:
                   $('#leftText').prop('checked', true);
                   break;
           }
       };

       this.align = function(alignment) {
           var $this =app.Page.get().find('.ui-selected');
          $this.removeClass('leftText rightText textAlignCenter');


           switch(alignment) {
               case 'textAlignCenter':
                  $this.addClass('textAlignCenter');
                   break;
               case 'rightText':
                   $this.addClass('rightText');
                   break;
               case 'leftText':
                   $this.addClass('leftText');
                   break;
           }
         this.detectSelectedAlignment();
       };
   }
    app.modules.align = Align;
})(window,jQuery,MagTool);

