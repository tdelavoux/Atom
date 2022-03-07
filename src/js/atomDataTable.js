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
            autoSort    : false
        };
        
        this.initialize = function(customOptions){

            var table   = $(this);
            $.extend(options, customOptions);

            addClassSortHead();
            addClassFilter();
            addInputShuffleField();

            function addClassFilter(){
                table.find('tbody').find('tr').addClass(`atom-tr-${tableid}`);
            };

            function addInputShuffleField(){
                
                var searchField = '<div class="ar"><i class="fas fa-search"></i><input id="atom-search-'+ tableid +'" class="a-input a-table-filter" style="max-width: fit-content;" placeholder="Mot-clef"></div>';
                $(searchField).insertBefore(table);
                var shuffler = new atomShuffle({itemSelector : `.atom-tr-${tableid}`, animationTime :200});
                
                $(`#atom-search-${tableid}`).keyup(function(){
                    var inputValue = $(this).val().toLowerCase();
                    shuffler.filter(function(element){
                        return atomDatatableUpdateFilter(element, inputValue);
                    });
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
                table.children('tbody').append(rows);
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
            return this;
        }

        this.destroy = function(){ this.unbind(); return null;}

       if(this.length > 1){
            console.log('Atom Datatable : Can\'t initialize on mutilple objects.');
        }else{
            return this.initialize(customOptions);
        }
    }
})(jQuery)

