(function($){
    $.fn.atomFileInput = function(){

        this.initialize = function() {
            var $input      = $(this);
            var $label      = $input.parent();
            var labelVal    = $label.html();
            $input.on('change', function(element) {
                var fileName = '';
                if (element.target.value) fileName = element.target.value.split('\\').pop();
                if(fileName){
                    $label.addClass('has-file').find('.js-fileName').html(fileName) 
                    $label.addClass('has-file').find('i').removeClass('fas fa-cloud-upload-alt').addClass('far fa-file-alt');
                }else{
                    $label.removeClass('has-file').html(labelVal);
                }
            });
            return this;
        };

        this.destroy = function() { 
            this.unbind(); return null;
        };

        if(this.length > 1){
            var collection = [];
            this.each(function(){ collection.push($(this).atomFileInput()); });
            return collection;
        }else{
            return this.initialize();
        }
    };
    $.fn.atomFileLoader = function(){

        this.initialize = function() {
            var uniqID     = Date.now() * (Math.round(Math.random() * Math.random() * 1000));
            var uploader   = $(this).find('.file-upload');
            var blocResult = $(this).find('.file-bloc-result');
            var fileBloc   = $(this).find('.file-bloc');
            var label      = $(this).find('.file-upload-label');
            var btnReturn  = $(this).find('.a-btn-return');

            label.attr('for', 'file-upload-'   + uniqID);
            uploader.attr('id', 'file-upload-' + uniqID);
            blocResult.hide();  

            uploader.change(function(){
                var filename	= $(this).val().split('\\');
                if(filename){
                    fileBloc.hide();
                    blocResult.find('.file-recap').html('Fichier : ' + filename[filename.length-1]);
                    blocResult.show();
                }else{
                    $(this).find('input').val('');
                }
            });
            btnReturn.click(function(){
                fileBloc.show();
                blocResult.hide();
                uploader.val('');
            });
            return this;
        };

        if(this.length > 1){
            var collection = [];
            this.each(function(){ collection.push($(this).atomFileLoader()); });
            return collection;
        }else{
            return this.initialize();
        }
    };
})(jQuery)