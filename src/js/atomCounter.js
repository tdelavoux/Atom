(function($){
    $.fn.atomCounter = function(customOptions){

        this.initialize = function(customOptions) {

            var currentValue = 0;

            var options = {
                increment   : 1,
                initialValue: 0,
                min         : 0,
                max         : 99999
            };

            $.extend(options , customOptions);
            
            var object       = $(this);
            var btnPlus      = object.children('button').last();
            var btnMinus     = object.children('button').first();
            var input        = object.children('input').first();
            var text         = object.children('.atom-counter-number').first();
            currentValue     = options.initialValue;

            input.val(currentValue);
            text.text(currentValue);

            updateScreen();

            btnPlus.click(function(){
                if(currentValue < options.max){
                    currentValue += options.increment;
                    updateScreen();
                }
            });

            btnMinus.click(function(){
                if(currentValue > options.min){
                    currentValue -= options.increment;
                    updateScreen();
                }
            });

            function updateScreen(){
                input.val(currentValue);
                text.text(currentValue);
            }
    
            return this;
        };

        this.destroy = function() { 
            this.unbind(); return null;
        };


        if(this.length > 1){
            var collection = [];
            this.each(function(){ collection.push($(this).atomCounter(customOptions)); });
            return collection;
        }else{
            return this.initialize(customOptions);
        }
    };

})(jQuery);