(function($){
    $.fn.atomSpinnerElement = function(){

        var content;

        this.initialize = function() {
            content = $(this).html();
            return this;
        };

        this.spin = function(content='') { 
            $(this).html('<span class="flex-center"><i class="fas fa-circle-notch fa-spin mr-05"></i> ' + content + '</span>');
			$(this).prop("disabled", true);
			$(this).addClass("spin");
        };

        this.stop = function(){ 
            $(this).html(content);
			$(this).prop("disabled", false);
			$(this).removeClass("spin");
        };

        this.stopAndUpdate = function(userContent) { 
            content = userContent;
            this.stop();
        };

        this.destroy = function(){ this.unbind(); return null;};

        if(this.length > 1){
            var collection = [];
            this.each(function(){ collection.push($(this).atomSpinnerElement()); });
            return collection;
        }else{
            return this.initialize();
        }
    };
})(jQuery)