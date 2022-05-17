(function($){
    $.fn.atomShuffleInstance = function(customClass){
        
        const className = customClass && customClass instanceof String ? '.' + customClass : '.shufflingItem';

        this.initialize = function() {
            $(this).keyup(function(){
                var input = $(this).val().toLowerCase();
                if(input){
                    $(className).each(function(){
                        $(this).is(':hidden') && $(this).attr('data-title').toLowerCase().includes(input) && $(this).show(400);
                        $(this).is(':visible') && !$(this).attr('data-title').toLowerCase().includes(input) && $(this).hide(300);
                    });
                }else{
                    $(className + ':hidden').show();
                }
            });
            return this;
        };

        this.destroy = function() { this.unbind(); return null;};

        if(this.length > 1){
            console.log('Atom Shuffle : Can\'t initialize on mutilple objects.');
        }else{
            return this.initialize();
        }
    };
})(jQuery)

/*
 * atomShuffle
 */
var atomShuffle = function(customOptions){
 
    /*
     * Variables accessible
     * in the class
     */
    var options = {
        itemSelector  : '.atomShuffleItem',
        animationTime : 400,
        visibility    : false,
    };
 
    /*
     * Constructor
     */
    this.construct = function(customOptions){
        $.extend(options , customOptions);
    };
 
    /*
     * Public method
     * Can be called outside class
     */
    this.filter = function(funct){
        $(options.itemSelector).each(function(){
            $visible =  funct($(this));
            $isHidden = $(this).hasClass('a-hide');
            $visible && (options.visibility  || $isHidden) &&  $(this).removeClass('a-hide');
            !$visible && (options.visibility  || !$isHidden) && $(this).addClass('a-hide');
        });
    };

    this.destroy = function(self){
        delete self;
    };

    /*
     * Pass options when class instantiated
     */
    this.construct(customOptions);
};