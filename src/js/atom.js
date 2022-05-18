/** ------------------------------------------------
 *               COLLAPSE
 */
 $(document.body).on('click', '.a-collapsable',
 function(){
     
     var object     = $(this);
     var target     = object.attr('collapse-target');
     if($(target).hasClass('collapsed') || $(target).hasClass('a-collapsed')){
         $(target).show(300);
         $(target).removeClass('collapsed');
         $(target).removeClass('a-collapsed');
     }else{
         $(target).addClass('collapsed');
         $(target).hide(300);
     }
 }
);

(function($){
 $.fn.atomCollapse = function(customOptions){

     this.initialize = function(customOptions) {

         var options = {
             collapsedText     : null,
             startingPosition : null,
         };
         $.extend(options , customOptions);

         var object     = $(this);
         var text       = object.text();
         var target     = $($(this).attr('collapse-target'));
         object.addClass('a-pointer');
         object.click(function(){
             if(object.hasClass('collapsed')){
                 object.html(text);
                 object.removeClass('collapsed');
                 target.show(300);
             }else{
                 options.collapsedText && object.html(options.collapsedText);
                 object.addClass('collapsed');
                 target.hide(300);
             }
         });
         options.startingPosition === 'collapsed' && object.addClass('collapsed') && target.hide() && (options.collapsedText && object.html(options.collapsedText));
         return this;
     };

     this.destroy = function() { 
         this.unbind(); return null;
     };

     if(this.length > 1){
         var collection = [];
         this.each(function(){ collection.push($(this).atomCollapse(customOptions)); });
         return collection;
     }else{
         return this.initialize(customOptions);
     }
 };
})(jQuery);

/** ------------------------------------------------
 *               SHUFFLE
 */
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
})(jQuery);

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

/** ------------------------------------------------
 *               COMPONENT
 */
 $('.a-count-area>textarea').keyup(function(){
    $(this).parent().find('.lengthText').remove();
    var max = $(this).attr('maxlength') ? parseInt($(this).attr('maxlength')) : 500;
    var len = $(this).val().length;
    var ch  = max - len;
    $(this).parent().prepend('<p class="small-text lengthText">' + ch + ' caractère(s) restant(s)</p>');
});
$('.a-count-area>textarea').trigger('keyup');

/** ------------------------------------------------
 *               COUNTER
 */
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

/** ------------------------------------------------
 *               FIles
 */
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

/** ------------------------------------------------
 *               Notifications
 */
 $(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = function( root, jQuery ) {
			if ( jQuery === undefined ) {
				if ( typeof window !== 'undefined' ) {
					jQuery = require('jquery');
				}
				else {
					jQuery = require('jquery')(root);
				}
			}
			factory(jQuery);
			return jQuery;
		};
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

    const pluginName = "atomNotification";

    var pluginOptions = {
		clickToHide: true,
		autoHide: true,
		autoHideDelay: 7000,
		alignment: "bottom right",
		type: "success",
		showAnimationTime: 450,
		hideAnimationDuration: 200,
		maxElements: 5, // TODO gérer le cas
	};

    const acceptedAlignment   = ['top left', 'top right', 'bottom left', 'bottom right'];
    const acceptedTypes       = ['success', 'danger', 'info',  'warning', 'light', 'dark', 'primary', 'secondary'];

    var styles = {
        commun :  "font-size:14px;font-weight:bold;padding: 0.7em 1em;border-radius:7px; margin: 0.5em 1em;overflow:hidden;white-space: nowrap; max-width:600px;",
        success : "background-color:#dff0d8;color:#3c763d;",
        danger : "background-color:#f2dede;color:#a94442;",
        info : "background-color:#d9edf7;color:#31708f;",
        light : "background-color:#ededed;color:#61605f;",
        warning : "background-color:#fcf8e3;color:#8a6d3b;",
        dark : "background-color:#807e7d;color:#f7f5f5;",
        primary : "background-color:#d0e0fc;color:#0b3d91;",
        secondary : "background-color:#f0d8ff;color:#6b2498;",
    };

    // TODO overight les position par des positions persos !
    var wrappers = {
        tr : {
            id: '#atomNotify-wrapper-tr',
            html : '<div id="atomNotify-wrapper-tr" style="position:fixed;top:70px;right:10px;z-index:99999;"></div>'
        },
        tl : {
            id: '#atomNotify-wrapper-tl',
            html : '<div id="atomNotify-wrapper-tl" style="position:fixed;top:70px;left:10px;z-index:99999;"></div>'
        },
        bl : {
            id: '#atomNotify-wrapper-bl',
            html : '<div id="atomNotify-wrapper-bl" style="position:fixed;bottom:30px;left:10px;z-index:99999;"></div>'     
        },
        br : {
            id: '#atomNotify-wrapper-br',
            html : '<div id="atomNotify-wrapper-br" style="position:fixed;bottom:30px;right:10px;z-index:99999;"></div>'
        }
    };

    function getOptionDefaultValue(a){return pluginOptions[a];}

    function isNumeric(n) {return !isNaN(parseFloat(n)) && isFinite(n);}

    function initializeWrappers(){
        for (const key in wrappers){
            !document.getElementById(wrappers[key].id) && $('body').append(wrappers[key].html);
        }
    }

    function Notification(data, options) {

        this.options = {};
        $.extend(this.options, pluginOptions)

        this.id = Date.now().toString(Math.floor(Math.random() * 10) + 10) +  Math.floor(Math.random() * 1000).toString(Math.floor(Math.random() * 10) + 10);

        if (typeof options === "string") {this.options.type = options;}
        else{$.extend(this.options, options);}

        this.element=$('<div class="atom-notification-content" style="display:none;' + styles.commun + styles[this.getOption('type', acceptedTypes)] +'">' + data + '</div>');
        
        initializeWrappers(this.getIntOption('xWrapperPos'), this.getIntOption('yWrapperPos'));
		this.run(data);
	}
    
    Notification.prototype.run = function(data) {
        switch(this.getOption('alignment', acceptedAlignment)){
            case 'top right' : 
                $(wrappers.tr.id).append(this.element);
                break;
            case 'top left' : 
                $(wrappers.tl.id).append(this.element);
                break;
            case 'bottom right' : 
                $(wrappers.br.id).append(this.element);
                break;
            case 'bottom left' : 
                $(wrappers.bl.id).append(this.element);
                break;
        }
        this.show();
	};

    Notification.prototype.show = function(){
       this.element.toggle(this.getOption('showAnimationTime')).delay(2000);
        if (this.getOption('autoHide')) {setTimeout(() => this.destroy(), this.getOption('autoHideDelay') - this.getOption('hideAnimationDuration'));}
        if(this.getOption('clickToHide')){this.element.click(() => this.destroy());}
    }

    Notification.prototype.destroy = function(){
        this.element.hide(this.getOption('hideAnimationDuration'));
        setTimeout(() => this.element.remove(), this.getOption('hideAnimationDuration')); 
    }

    Notification.prototype.getOption = function(b, a = null){
        return !a || a.includes(this.options[b]) ? this.options[b] : getOptionDefaultValue(b); 
    }

    Notification.prototype.getIntOption = function(a){
        return isNumeric(this.options[a]) ? this.options[a] : getOptionDefaultValue(a); 
    }

    $[pluginName] = function(d, o) {
        new Notification(d, o);
        return;
	};

}));

/** ------------------------------------------------
 *               Spinner
 */
 (function($){
    $.fn.atomSpinnerElement = function(){

        var content;

        this.initialize = function() {
            content = $(this).html();
            return this;
        };

        this.spin = function(content='') { 
            $(this).html('<span class="flex-center"><i class="fas fa-circle-notch fa-spin mr-05"></i> ' + content + '</span>');
			//$(this).prop("disabled", true);
			$(this).addClass("spin");
        };

        this.stop = function(){ 
            $(this).html(content);
			//$(this).prop("disabled", false);
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

/** ------------------------------------------------
 *               Tabs
 */
 $("body").on("click",".atom-pan-tab-header-item",function() {
    var parent = $(this).closest('.atom-pan-tab');
    parent.find('.atom-pan-tab-body div').removeClass('active');
    parent.find('.atom-pan-tab-header-item').removeClass('active');
    $(this).addClass('active');
    $($(this).attr('data-target')).addClass('active');
});

/** ------------------------------------------------
 *               DataTable  
 */
 (function($){
    $.fn.atomDataTable = function(customOptions){
        
        var sortClass     = 'a-sort';
        var directionAttr = 'data-direction';
        const direction = ['asc', 'desc'];
        const types     = ['string', 'number', 'Ymd', 'm/d/Y', 'm-d-y', 'd/m/Y', 'd-m-y'];

        var tableid = Date.now().toString(Math.floor(Math.random() * 10) + 10) +  Math.floor(Math.random() * 1000).toString(Math.floor(Math.random() * 10) + 10);                                                               // TODO WTF ?


        var regex = {
			dateDb     : /^((19|20)\d{2})((0|1)\d{1})([0-3]\d{1})/g,
			dateFrSlash: /^([0-3]\d{1})\/([0-1]\d{1})\/((19|20)\d{2})/g,
			dateEnSlash: /^((0|1|2)\d{1})\/([0-3]\d{1})\/((19|20)\d{2})/g,
			dateEnDash : /^((19|20)\d{2})-([0-1]\d{1})-([0-3]\d{1})/g,
			dateFrDash : /^([0-3]\d{1})-([0-1]\d{1})-((19|20)\d{2})/g
		};

        var options = {
            autoFilter  : true,
            filterableColumn: false,
            orderableColumn : false,
            preOrderedColumn : false, // TODO Autosorting
            columnType : false,
            autoSort    : false,
            nbPerPage     : false,
            inputBorder : "",
        };
        
        this.initialize = function(customOptions){

            var table   = $(this);
            $.extend(options, customOptions);

            addClassSortHead();
            addClassFilter();
            addInputShuffleField();
            buildPagination();
            displayPages(0);

            function addClassFilter(){
                table.find('tbody').find('tr').addClass(`atom-tr-${tableid}`);
            };

            function addInputShuffleField(){
                
                var searchField = '<div class="ar"><i class="fas fa-search"></i><input id="atom-search-'+ tableid +'" class="a-input a-table-filter '+ options.inputBorder + '" style="max-width: fit-content;" placeholder="Mot-clef"></div>';
                $(searchField).insertBefore(table);
                var shuffler = new atomShuffle({itemSelector : `.atom-tr-${tableid}`, animationTime :200,});
                
                $(`#atom-search-${tableid}`).keyup(function(){
                    var inputValue = $(this).val().toLowerCase();
                    shuffler.filter(function(element){
                        return atomDatatableUpdateFilter(element, inputValue);
                    });

                    if(options.nbPerPage){
                        paginationShuffling();
                    }
                });
                
            }

            function atomDatatableUpdateFilter(element, inputValue){
                if(options.filterableColumn instanceof Array){
                    var txtRes = '';
                    options.filterableColumn.forEach(function(index){
                        txtRes += $(`td:nth-child(${index - 1})` , element).text();
                    });
                    return txtRes.toLowerCase().includes(inputValue);
                }else{
                    return element.text().toLowerCase().includes(inputValue);
                }
            }
           
            function addClassSortHead(){
                if(options.orderableColumn instanceof Array){
                    $.each(options.orderableColumn, function(key, colNumber){
                        if(!isNaN(colNumber)){
                            //colType = types.includes(options.columnType[colNumber]) ? options.columnType[colNumber] :  types[0];
                            $(table.find('th').eq(colNumber).addClass(sortClass)).on('click', function(){sortColumn(colNumber);});
                        }
                    });
                }else{  
                    var tableHeader = $('thead tr', table);
                    tableHeader.find('th').each(function(){
                        $(this).addClass(sortClass);
                        $(this).on('click', function(){sortColumn($(this).index());})
                    });
                }
            }


            function sortColumn(colNumber){
                if(colNumber >= $('thead tr th', table).length){console.log('Invalid column number. count start at 0.'); return;}
                var rows = table.children('tbody').children().detach().get();
                rows.forEach(value=>{
                    if(!value.hasAttribute(directionAttr)){
                        value.setAttribute(directionAttr, direction[0]);
                        ascending = true;
                    }else if(value.getAttribute(directionAttr) == direction[0]){
                        value.setAttribute(directionAttr, direction[1]);
                        ascending = false;
                    }else if(value.getAttribute(directionAttr) == direction[1]){
                        value.setAttribute(directionAttr, direction[0]);
                        ascending = true;
                    }
                });
				
                colType = types.includes(options.columnType[colNumber]) ? options.columnType[colNumber] :  types[0];
                functionCaller(colType, ascending, colNumber, rows);
                reOrderNb(rows);
                table.children('tbody').append(rows);
                displayPages(table.attr('data-page'));
            }

            function sortString(rows, value, ascending){
                rows.sort(function(a,b){
                    if(ascending){
                        return (a.children[value].innerHTML.toLowerCase() < b.children[value].innerHTML.toLowerCase()) ? -1: 0;
                    }else{
                        return (a.children[value].innerHTML.toLowerCase() > b.children[value].innerHTML.toLowerCase()) ? -1: 0;
                    }
                });
            }

            function sortNumber(rows, value, ascending){
                rows.sort(function(a,b){
                    if(!isNaN(a.children[value].innerHTML) && !isNaN(b.children[value].innerHTML)){
                        if(ascending){
                            return a.children[value].innerHTML - b.children[value].innerHTML;
                        }else{
                            return b.children[value].innerHTML - a.children[value].innerHTML;
                        }
                    }else{
                        throwError(value, rows);
                    }
                });
            }

            function sortDbDate(rows, value, ascending){
                rows.sort(function(a, b){
                    var allRegex = getRegexConstructs(regex.dateDb);
                    if(allRegex[0].test(a.children[value].innerHTML), allRegex[1].test(b.children[value].innerHTML)){
                        if(ascending){
                            return a.children[value].innerHTML - b.children[value].innerHTML;
                        }else{
                            return b.children[value].innerHTML - a.children[value].innerHTML;
                        }
                    }else{
                        throwError(value, rows);
                    }
                });
            }

            function sortDateEnSlash(rows, value, ascending){
                rows.sort(function(a, b){
                    var allRegex = getRegexConstructs(regex.dateEnSlash);
                    if(allRegex[0].test(a.children[value].innerHTML), allRegex[1].test(b.children[value].innerHTML)){
                        if(ascending){
                            return new Date(a.children[value].innerHTML) - new Date(b.children[value].innerHTML);
                        }else{
                            return new Date(b.children[value].innerHTML) - new Date(a.children[value].innerHTML);
                        }
                    }else{
                        throwError(value, rows);
                    }
                });
            }

            function sortDateEnDash(rows, value, ascending){
                rows.sort(function(a, b){
                    var allRegex = getRegexConstructs(regex.dateEnDash);
                    if(allRegex[0].test(a.children[value].innerHTML), allRegex[1].test(b.children[value].innerHTML)){
                        var explodedDateA = a.children[value].innerHTML.split('-');
                        var explodedDateB = b.children[value].innerHTML.split('-');
                        if(ascending){
                            return new Date(`${explodedDateA[1]}/${explodedDateA[2]}/${explodedDateA[0]}`) - new Date(`${explodedDateB[1]}/${explodedDateB[2]}/${explodedDateB[0]}`);
                        }else{
                            return new Date(`${explodedDateB[1]}/${explodedDateB[2]}/${explodedDateB[0]}`) - new Date(`${explodedDateA[1]}/${explodedDateA[2]}/${explodedDateA[0]}`);
                        }
                    }else{
                        throwError(value, rows);
                    }
                });
            }

            function sortDateFrSlash(rows, value, ascending){
                rows.sort(function(a, b){
                    var allRegex = getRegexConstructs(regex.dateFrSlash);
                    if(allRegex[0].test(a.children[value].innerHTML), allRegex[1].test(b.children[value].innerHTML)){
                        var explodedDateA = a.children[value].innerHTML.split('/');
                        var explodedDateB = b.children[value].innerHTML.split('/');
                        if(ascending){
                            return new Date(`${explodedDateA[1]}/${explodedDateA[0]}/${explodedDateA[2]}`) - new Date(`${explodedDateB[1]}/${explodedDateB[0]}/${explodedDateB[2]}`);
                        }else{
                            return new Date(`${explodedDateB[1]}/${explodedDateB[0]}/${explodedDateB[2]}`) - new Date(`${explodedDateA[1]}/${explodedDateA[0]}/${explodedDateA[2]}`);
                        }
                    }else{
                        throwError(value, rows);
                    }
                });
            }

            function sortDateFrDash(rows, value, ascending){
                rows.sort(function(a, b){
                    var allRegex = getRegexConstructs(regex.dateFrDash);
                    if(allRegex[0].test(a.children[value].innerHTML), allRegex[1].test(b.children[value].innerHTML)){
                        var explodedDateA = a.children[value].innerHTML.split('-');
                        var explodedDateB = b.children[value].innerHTML.split('-');
                        if(ascending){
                            return new Date(`${explodedDateA[1]}/${explodedDateA[0]}/${explodedDateA[2]}`) - new Date(`${explodedDateB[1]}/${explodedDateB[0]}/${explodedDateB[2]}`);
                        }else{
                            return new Date(`${explodedDateB[1]}/${explodedDateB[0]}/${explodedDateB[2]}`) - new Date(`${explodedDateA[1]}/${explodedDateA[0]}/${explodedDateA[2]}`);
                        }
                    }else{
                        throwError(value, rows);
                    }
                });
            }

			function functionCaller(funcName, ascending, value, rows){
				var functions = {
					'string': function(){
						sortString(rows, value, ascending);
					},
					'number': function(){
						sortNumber(rows, value, ascending);
					},
					'Ymd' : function(){
						sortDbDate(rows, value, ascending);
					},
					'm/d/Y': function(){
						sortDateEnSlash(rows, value, ascending);
					},
                    'd/m/Y': function(){
                        sortDateFrSlash(rows, value, ascending);
					},
                    'm-d-y': function(){
                        sortDateEnDash(rows, value, ascending);
                    },
                    'd-m-y': function(){
                        sortDateFrDash(rows, value, ascending);
                    }
				}
			
				functions[funcName]();
			}

            function getRegexConstructs(regex){
                return [new RegExp(regex), new RegExp(regex)];
            }

			function throwError(value, rows){
				table.children('tbody').append(rows);
				throw('Error', `Wrong format type for column ${value} !`);
			}

            /**
             * Build the pagination at the start
             */
            function buildPagination(){
                if(!options.nbPerPage){
                    return;
                }

                var rows = table.children('tbody').children().detach().get();
                var nb = 0

                rows.forEach(row => {
                    $(row).attr('data-nb',nb);
                    nb++;
                });
                table.children('tbody').append(rows);

                var nbPages = parseInt(rows.length/options.nbPerPage)+1;
                var colspan = table.children('tbody').children('tr:first-child').children('td').length;
                table.append('<tfoot><tr><td class="text-center" colspan="'+colspan+'">');
                for(var i = 0; i<nbPages; i++){
                    table.children('tfoot').children('tr').children('td').append('<button type="button" data-index="'+i+'" class="a-btn-sm a-primary">'+(i+1)+'</button>');
                }

                //Create buttons ...
                $('<button id="etcBtnEnd" type="button" class="a-btn-sm a-primary">...</button>').insertBefore(table.children('tfoot').children('tr').children('td').children('button:last-child'));
                $('<button id="etcBtnStart" type="button" class="a-btn-sm a-primary">...</button>').insertAfter(table.children('tfoot').children('tr').children('td').children('button:first-child'));
               
                //Change of page
                table.children('tfoot').children().children().children().click(function(){
                    displayPages($(this).attr('data-index'));
                });

            }

            /**
             * Reorder rows in case of sorting, shuffling
             */
            function reOrderNb(rows){
                var nb = 0;
                rows.forEach(row => {
                    if($(row).attr('data-nb') !== undefined){
                        $(row).attr('data-nb', nb);
                        nb++;
                    }
                });
            }

            /**
             * Display buttons for change of pages
             * if maxBtn is null, then the number of max buttons stay the same as before
             */
            function displayPagesBtn(maxBtn){
                if(maxBtn == null){
                    maxBtn = parseInt(table.children('tfoot').children().children().children('button:not(.a-hide)').last().attr('data-index'));
                }

                var currPage = parseInt(table.attr('data-page'));

                var btns = table.children('tfoot').children().children().children();

                for(var btn of btns){
                    var index = parseInt($(btn).attr('data-index'));

                    if(index != undefined 
                        && index != maxBtn && index != 0
                        && (index > currPage+3 || index > maxBtn || index < currPage-2)){
                        $(btn).addClass('a-hide');
                    }else{
                        $(btn).removeClass('a-hide');
                    }
                };
                
                //Displaying ... buttons at the start and/or at the end
                if(maxBtn > 3 && maxBtn-4 >= currPage){
                    $('#etcBtnEnd').removeClass('a-hide');
                    $('#etcBtnEnd').insertBefore($('button[data-index="'+maxBtn+'"]'));
                }else{
                    $('#etcBtnEnd').addClass('a-hide');
                }

                if(currPage-2 > 1){
                    $('#etcBtnStart').removeClass('a-hide');
                }else{
                    $('#etcBtnStart').addClass('a-hide');
                }
            }

            /**
             * Pagination in case of shuffling
             */
            function paginationShuffling(){
                var rows = table.children('tbody').children('tr:not(.a-hide)').get();
                $(rows).attr('data-nb', '');
                table.children('tbody').children('.a-hide').removeAttr('data-nb');

                reOrderNb(rows);

                var maxBtn = parseInt(rows.length/options.nbPerPage);
                displayPagesBtn(maxBtn);
                displayPages(0);
            }

            /**
             * Display the selected page
             */
            function displayPages(nbPage){
                if(nbPage == undefined){return;}
                var rows = table.children('tbody').children();
                var min = nbPage*options.nbPerPage;
                var max = min+options.nbPerPage
                for(var row of rows){
                    var dataNb = $(row).attr('data-nb');
                    if(dataNb === undefined || dataNb >= max || dataNb < min){
                        $(row).addClass('a-hide');
                    }else{
                        $(row).removeClass('a-hide');
                    }
                }
                table.attr('data-page', nbPage);
                displayPagesBtn();
            }
            
            return this;
        }

        this.destroy = function(){ this.unbind(); return null;}

       if(this.length > 1){
            console.log('Atom Datatable : Can\'t initialize on mutilple objects.');
        }else{
            return this.initialize(customOptions);
        }
    }
})(jQuery);

/** ------------------------------------------------
 *               Form Handler  
 */
 const E_S   = "";
 const N_R_S = "non-required";
 
 /* ########################## GESTION DES CONTROLES ####################### */
 
$(function(){
    /* #########################################################################################################
    *							Vérification des fomulaires avant soumission
    ########################################################################################################### */

    /* Activation au clic sur un bouton de soumission
    * Vérifie l'ensemble des champs du formulaire
    *
    * @use	optional	a-data-function	                  Fonction JS associé au boutton si celui ci ne submit pas de formulaire. La fonction est lancé si aucun élément n'est bloquant
    * @use  optional    a-check-invisible                 Défini si les champs masqués doivent être pris en compte
    * @use  optional    a-notify-none                     Si reneigné,disable les notofications globales
    * @use  optional    a-notify-all                      Si reneigné,toutes les erreurs sont notifiées
    * @use  optional    a-disable-color                   Si reneigné, ne colore pas les inputs en erreur
    * @use  optional    a-input-notify-none               Si reneigné, disable les message des inputs
    * @use  optional    a-data-opt-bloc                   Fonction de blocage personnalisée. Si retourne false, bloque le formulaire
    */
    $('.a-form-handler').click(function(){

        var btn  = $(this);
        var form = btn.closest('form');
        form.submit(function(e) {e.preventDefault();});
        
        compute(form, btn);
    });

    async function compute(form, self){

        var blocage         = false;
        var notifyNone      = (form.attr('a-notify-none') !== undefined && form.attr('a-notify-none') !== 'false') ? true : false;
        var notifyAll       = (form.attr('a-notify-all') !== undefined && form.attr('a-notify-all') !== 'false') ? true : false;
        var notifyInputNone = (form.attr('a-input-notify-none') !== undefined && form.attr('a-input-notify-none') !== 'false') ? true : false;
        var colorInput      = (form.attr('a-disable-color') !== undefined && form.attr('a-disable-color') !== 'false') ? true : false;
        var checkVisi       = (form.attr('a-check-invisible')) ? form.attr('a-check-invisible') : false;
        var optVerif        = (form.attr('a-data-opt-bloc'))   ? form.attr('a-data-opt-bloc') : false;
        var callback        = (form.attr('a-data-function'))   ? form.attr('a-data-function') : false;
        var err             = new Array();

        /**
         * --------- Vérification Des Sélecteurs  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-verif          : Value lancant une erreur. par défaut aucune value
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * 
         */ 
        $('.a-verify-select', form).each(function(){

            var error        = 'Aucune sélection faite';
            var verif        = $(this).attr('a-verif')       ? $(this).attr('a-verif') : E_S;
            var name         = $(this).attr('a-name')           ? $(this).attr('a-name') : 'Selecteur';
            var errCustomMsg = $(this).attr('a-error-message')  ? $(this).attr('a-error-message') : 'Champs incorrect';
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;

            if(checkVisi || $(this).is(':visible')){
                if(( !$('option:selected', this).val()|| $('option:selected', this).val() === verif)){
                    displayMsg && err.push({elem:$(this), errorMessage:error, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(($(this).val() !== E_S)  && eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });


        /**
         * --------- Vérification Des champs texte  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-min-length     : taille minimale du texte à saisir
         * @use optional  a-max-length     : taille maximale du texte à saisir
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * 
         */
        $('.a-verify-text', form).each(function(){

            var minLength    = $(this).attr('a-min-length') ? parseInt($(this).attr('a-min-length')) : 0;
            var maxLength    = $(this).attr('a-max-length') ? parseInt($(this).attr('a-max-length')) : null;
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Texte';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;

            if(checkVisi || $(this).is(':visible')){
                if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().length !== 0 && $(this).val().length < minLength){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie trop courte (min " + minLength + " caractères)", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().length !== 0 && maxLength !== null && ($(this).val().length > maxLength)){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie  trop longue (max " + maxLength + " caractères)", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });
		
		/**
         * --------- Vérification Des champs textarea avec count  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-min-length     : taille minimale du texte à saisir
         * @use optional  a-max-length     : taille maximale du texte à saisir
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * 
         */
        $('.a-verify-textarea-with-count', form).each(function(){

            var minLength    = $(this).attr('a-min-length') ? parseInt($(this).attr('a-min-length')) : 0;
            var maxLength    = $(this).attr('a-max-length') ? parseInt($(this).attr('a-max-length')) : null;
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Commentiare';
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;

            if(checkVisi || $(this).is(':visible')){
                if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text-with-count').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().length !== 0 && $(this).val().length < minLength){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie trop courte (min " + minLength + " caractères)", name: name});
                    $(this).parent().find('.a-input-error-text-with-count').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().length !== 0 && maxLength !== null && ($(this).val().length > maxLength)){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie  trop longue (max " + maxLength + " caractères)", name: name});
                    $(this).parent().find('.a-input-error-text-with-count').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text-with-count').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });


        /**
         * --------- Vérification Des champs Date  ----------
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-date-format    : format de la date a vérifier (accepté les YY, YYYY, DD, MM, /, -)
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         */
        $('.a-verify-date', form).each(function(){

            var format       = $(this).attr('a-date-format') ? $(this).attr('a-date-format').toUpperCase() : 'DD/MM/YYYY';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Date';
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';

            // Formatage de la REGEX a partir du format
            var regFormat = format.replace(new RegExp('/', 'g') , "([\\/])");
            var regFormat = regFormat.replace(new RegExp('-', 'g') , "([-])");
            var regFormat = regFormat.replace(new RegExp('DD', 'g') , '(0?[1-9]|[12][0-9]|3[01])');
            var regFormat = regFormat.replace(new RegExp('MM', 'g') , '(0?[1-9]|1[0-2])');
            var regFormat = regFormat.replace(new RegExp('YYYY', 'g') , '([0-9]{4})');
            var regFormat = regFormat.replace(new RegExp('YY', 'g') , '([0-9]{2})');
            var regFormat = regFormat + '\$';
            var regex     = new RegExp('^' + regFormat );

            if(checkVisi || $(this).is(':visible')){
                if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().trim() !== E_S && !regex.test($(this).val())){
                    displayMsg && err.push({elem:$(this), errorMessage: "Format invalide. Attendu : " + format, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });


        /**
         * --------- Vérification Des champs Telephone  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-phone-format   : Type de téléphone fixe ou mobile
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * 
         */
        $('.a-verify-phone', form).each(function(){

            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var format       = $(this).attr('a-phone-format') && $(this).attr('a-phone-format') === 'mobile' ? 'mobile' : 'fixe';
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Telephone';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;

            // Formatage de la REGEX a partir du format
            var regFormatFixe   = '([0][0-9]{9})$|([0][0-9])(([ ][0-9]{2}){4})$|([0][0-9])(([.][0-9]{2}){4})';
            var regFormatMobile = '([06][0-9]{9})$|([06])(([ ][0-9]{2}){4})$|([06])(([.][0-9]{2}){4})';
            var regFormat       = '^' + (format === 'mobile' ? regFormatMobile : regFormatFixe) + '\$';
            var regex           = new RegExp(regFormat);

            if(checkVisi || $(this).is(':visible')){
                if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().trim() !== E_S && !regex.test($(this).val())){
                    displayMsg && err.push({elem:$(this), errorMessage:"Format inconnu. sans séparateur, point ou espace acceptés.", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });


        /**
         * --------- Vérification Des champs email  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * 
         */
        $('.a-verify-email', form).each(function(){

            
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Mail';
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;
            
            // Formatage de la REGEX a partir du format
            var regFormatMobile = '\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+';
            var regFormat       = '^' + regFormatMobile + '\$';
            var regex           = new RegExp(regFormat);

            if(checkVisi || $(this).is(':visible')){
                if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().trim() !== E_S && !regex.test($(this).val())){
                    displayMsg && err.push({elem:$(this), errorMessage:"Format invalide", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });


        /**
         * --------- Vérification Des champs Int  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * @use optional  a-min             : taille minimale de l'objet. Default 0
         * @use optional  a-max				: taille maximale de l'objet. Default 2147483647
         */
        $('.a-verify-int', form).each(function(){

            var minVal       = parseInt($(this).attr('a-min')) ? parseInt($(this).attr('a-min')) : 0;
            var maxVal       = parseInt($(this).attr('a-max')) ? parseInt($(this).attr('a-max')) : 2147483647;
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Mail';
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;

            if(checkVisi || $(this).is(':visible')){
                if($(this).val() && (!$.isNumeric($(this).val()) ||  $(this).val().includes('.') !== false)){
                    displayMsg && err.push({elem:$(this), errorMessage:"Nombre entier attendu", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }else if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }else if($(this).val() < minVal || $(this).val() > maxVal){
                    displayMsg && err.push({elem:$(this), errorMessage:(minVal ? "Min : " + minVal : "")  + (maxVal ? ' Max : ' + maxVal : ""), name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });

        /**
         * --------- Vérification Des champs Float  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * @use optional  a-min             : taille minimale de l'objet. Default 0
         * @use optional  a-max				: taille maximale de l'objet. Default 2147483647
         * 
         */
        $('.a-verify-float', form).each(function(){

            var minVal       = parseInt($(this).attr('a-min')) ? parseInt($(this).attr('a-min')) : 0;
            var maxVal       = parseInt($(this).attr('a-max')) ? parseInt($(this).attr('a-max')) : 2147483647;
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Mail';
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;

            if(checkVisi || $(this).is(':visible')){
                if($(this).val() && !$.isNumeric($(this).val())){
                    displayMsg && err.push({elem:$(this), errorMessage:"Nombre attendu", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }else if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }else if(parseFloat($(this).val()) < minVal || parseFloat($(this).val()) > maxVal){
                    displayMsg && err.push({elem:$(this), errorMessage:(minVal ? "Min : " + minVal : "")  + (maxVal ? ' Max : ' + maxVal : ""), name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
            
        });


        /**
         * --------- Verification Des checkboxs  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : nom du champ pour identifcation de l'erreur
         * @use optional  a-disable-message : Permet de désactiver l'affichage des message sous les champs input
         * 
         */
        $('.a-verify-checked', form).each(function(){

            var error        = "Attention, " + ($(this).attr('a-name') ? $(this).attr('a-name') : 'La checkbox ') + " n'a pas été accepté(e) / coché(e). ";
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Checkbox';
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';

            if(checkVisi || $(this).parent().is(':visible')){
                if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                if(!$(this).prop("checked")){
                    $(this).parent().parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().parent().addClass('a-form-error');
                    displayMsg && err.push({elem:$(this), errorMessage:error, name: name});
                    err     = jQuery.unique(err);
                    blocage = true;
                }
            }
        });

        /**
		 * --------- Vérification Des checkboxs 2  ----------
		 * Verification de la sélection d'une checkbox parmis une liste
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : nom du champ pour identifcation de l'erreur
		 * @use required  a-shared-name    : nom idantifiant les elements de la liste des checkboxs a vérifier
		 * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * 
		 */
		$('.a-verify-one-in-list', form).each(function(){

            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Liste de Checkboxs';
            var error        = "Attention, " + name + " Aucune selection.";
            var checkName    = $(this).attr('a-shared-name');
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';

			if(checkVisi || $(this).parent().is(':visible')){
				var counter2 = 0;
				if($('input[data-shared-name="' + checkName+'"]').is(":checked")){
					counter2++;
				}
                if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
				if(counter2 === 0){
                    $(this).parent().parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().parent().addClass('a-form-error');
					displayMsg && err.push({elem:$(this), errorMessage:error, name: name});
                    blocage = true;
				}  
			}
		});

        /**
         * --------- Vérification Des Radios  ----------
         * 
         * Verification simple que l'un des boutons radio a été sélectionné dans la liste des radio de méme noms
         * 
         *  @use optional  a-alternate-verif    : Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         *  @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         *  @use optional  a-name		        : nom du champ pour identifcation de l'erreur
         *  @use optional  a-disable-message    : Permet de désactiver l'affichage des message sous les champs input
         */
        $('.a-verify-radio', form).each(function(){

            var error        = "Attention, " + ($(this).attr('a-name') ? $(this).attr('a-name') : ' Boutons Radios :') + " aucune selection. ";
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Radio';
            var radioName    = $(this).attr('name');
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';

            if(checkVisi || $(this).parent().is(':visible')){            
                var counter = 0;
                if($('input[name="' + radioName+'"]').is(":checked")){
                    counter++;
                }
                if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                if( counter === 0){
                    $(this).parent().parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().parent().addClass('a-form-error');
                    displayMsg && err.push({elem:$(this), errorMessage:error, name: name});
                    blocage = true;
                }
            }
        });

        /**
         * --------- Vérification Des Input Files  ----------
         * Verification simple que l'un des input files a bien un fichier sélectionné
         * 
         * @use optional  a-alternate-verif     : Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message       : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name                : Nom du champs pour l'affichage des erreurs
         * @use optional  a-disable-message     : Permet de désactiver l'affichage des message sous les champs input
         */
        $('.a-verify-file', form).each(function(){

            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Fichier';
            var error        = "Attention, " + name + " Aucune selection. ";
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;

            if(checkVisi || $(this).is(':visible')){
                if(!$(this)[0].files.length && !nullable){
                    $(this).parent().find('.a-input-error-text').detach();
                    displayMsg && err.push({elem:$(this), errorMessage:error, name: name});
                    !colorInput && $(this).parent().parent().addClass('a-form-error');
                    blocage = true;
                }else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().parent().addClass('a-form-error');
                    blocage = true;
                }else{
                    $(this).parent().find('.a-input-error-text').detach();
                }
            }
        });

        // Si une fonction perso est définie, on évalue le blocage
        if(optVerif !== false && await eval(optVerif) === true){
            blocage = true;
        }
        
        if(blocage === true){

            //Création d'un id unique pour éviter les collisions de blocs
            var uniqID = Date.now() * (Math.round(Math.random() * 100));

            !notifyInputNone && err.forEach(function(element) {
				if(element.elem.parent().hasClass('a-count-area')) {
					element.elem.parent().append('<span class="a-input-error-text-with-count">'+ element.errorMessage +'</span>');
				}else{
					element.elem.parent().append('<span class="a-input-error-text">'+ element.errorMessage +'</span>');
				}
			});

            var errMsg =  [...new Map(err.map(item =>
                [item['name'], item])).values()];

            if(notifyAll){
                errMsg.forEach(function(element) {
                    $.atomNotification((element.name ? element.name : 'Champ incorrect ') + ' : ' + element.errorMessage, "danger");
                });
            }else if(!notifyNone){
                $.atomNotification('Des erreurs ont été détectées dans le formulaire. Merci de vérifier les données.', "danger");
            }
            
            // reinit les flux de données
            err = {};
        }else{
            if(callback){
                eval(callback);
                $((form ? '#' + form  : 'form')).submit(function(e) {e.preventDefault();});
            }else{
                $((form ? '#' + form  : 'form')).unbind('submit').submit();
            }
        }
        reinitColor();
		self.blur();
    }
 
});
 
/* #####################################################
*	Réinitialisation des couleurs des champs de saisie
####################################################### */

function reinitColor(){

    $('select').change(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-text').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });
	
	$('.a-verify-textarea-with-count').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text-with-count').detach();
    });

    $('.a-verify-int').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-email').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-date').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-phone').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-float').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-checked').change(function(){
        $(this).parent().parent().removeClass('a-form-error');
        $(this).parent().parent().find('.a-input-error-text').detach();
    });

    $('input[type="radio"]').change(function(){
        $(this).parent().parent().removeClass('a-form-error');
        $(this).parent().parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-file').change(function(){
        $(this).parent().parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

}