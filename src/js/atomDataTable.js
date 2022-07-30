const a_direction = ["asc", "desc"];
const a_types = [
  "string",
  "number",
  "Ymd",
  "m/d/Y",
  "m-d-y",
  "d/m/Y",
  "d-m-y",
];


class AtomDatatable{

  constructor(table, customOptions) {
    if(!a_isHtml(table)){
      console.error('Atom Datatable : Can only initialize on a DOM Element.');
      return 1;
    }

    if(table.nodeName !== "TABLE"){
      console.error('Atom Datatable : Can only initialize on a <table> element.');
      return 2;
    }

    this.sortIcon = `<i class="fas fa-sort"></i>`;
    this.directionAttr = "data-direction";
    this.tableid =
      Date.now().toString(Math.floor(Math.random() * 10) + 10) +
      Math.floor(Math.random() * 1000).toString(
        Math.floor(Math.random() * 10) + 10
      );

    this.regex = {
      dateDb: /^((19|20)\d{2})((0|1)\d{1})([0-3]\d{1})/g,
      dateFrSlash: /^([0-3]\d{1})\/([0-1]\d{1})\/((19|20)\d{2})/g,
      dateEnSlash: /^((0|1|2)\d{1})\/([0-3]\d{1})\/((19|20)\d{2})/g,
      dateEnDash: /^((19|20)\d{2})-([0-1]\d{1})-([0-3]\d{1})/g,
      dateFrDash: /^([0-3]\d{1})-([0-1]\d{1})-((19|20)\d{2})/g,
    };

    this.options = {
      autoFilter: true,
      filterableColumn: false,
      orderableColumn: false,
      preOrderedColumn: false, // TODO Autosorting
      columnType: false,
      autoSort: false,
      nbPerPage: false,
      inputBorder: "",
    };
    

    this.table = table;
    Object.assign(this.options, customOptions);

    this.addClassSortHead();
    this.addClassFilter();
    this.addInputShuffleField();
    this.buildPagination(0);
    this.options.nbPerPage && this.displayPages(0);

  }

  addClassFilter() {
    for(var row of this.table.querySelectorAll("tbody tr"))
    row.classList.add(`atom-tr-${this.tableid}`);
  }

  addInputShuffleField() {
    
    var searchField = document.createElement('div');
    searchField.innerHTML = '<div class="ta-r"><i class="fas fa-search"></i><input id="atom-search-' +
    this.tableid +
    '" class="a-input a-table-filter ' +
    this.options.inputBorder +
    '" style="max-width: fit-content;" placeholder="Mot-clef"></div>';
    searchField = searchField.firstChild;
      
    this.table.before(searchField);
    var shuffler = new atomShuffle({
      itemSelector: `.atom-tr-${this.tableid}`,
      animationTime: 200,
    });

    document.getElementById(`atom-search-${this.tableid}`).addEventListener('keyup', () => {
      var inputValue = document.getElementById(`atom-search-${this.tableid}`).value.toLowerCase();
      shuffler.filter((element) => {
        return this.atomDatatableUpdateFilter(element, inputValue);
      });

      if (this.options.nbPerPage) {
        this.paginationShuffling();
      }
    });
  }

  atomDatatableUpdateFilter(element, inputValue) {
    if (this.options.filterableColumn instanceof Array) {
      var txtRes = "";
      this.options.filterableColumn.forEach(function (index) {
        txtRes += $(`td:nth-child(${index + 1})`, element).text();
      });
      return txtRes.toLowerCase().includes(inputValue);
    } else {
      return element.text().toLowerCase().includes(inputValue);
    }
  }


  addClassSortHead() {
    if (this.options.orderableColumn instanceof Array) {
      this.options.orderableColumn.forEach(colNumber => {
        if (!isNaN(colNumber)) {
          //colType = types.includes(options.columnType[colNumber]) ? options.columnType[colNumber] :  types[0];
          this.table.querySelector("th:nth-child("+colNumber+")").innerHTML += this.sortIcon;
          this.table.querySelector("th:nth-child("+colNumber+")").addEventListener('click', () => {
            this.sortColumn(colNumber);
          });
        }
      });
    } else {
      var tableHeader = this.table.querySelector('thead tr');
      let colNum = 0;
      for(var element of Object.values(tableHeader.children)){
        element.innerHTML+=this.sortIcon;
        element.dataset.col = colNum;
        colNum++;
      };
      tableHeader.addEventListener("click", (e) => {
        this.sortColumn(e.target.closest('th').dataset.col);
      });
    }
  }

  sortColumn(colNumber) {
    if (colNumber >= this.table.querySelectorAll("thead tr th").length) {
      console.log("Invalid column number. count start at 0.");
      return;
    }
    var ascending;
    var rows = a_detachAndGet(this.table.querySelector("tbody"));
    for(var row of rows){
      if (!row.hasAttribute(this.directionAttr)) {
        row.setAttribute(this.directionAttr, a_direction[0]);
        ascending = true;
      } else if (row.getAttribute(this.directionAttr) == a_direction[0]) {
        row.setAttribute(this.directionAttr, a_direction[1]);
        ascending = false;
      } else if (row.getAttribute(this.directionAttr) == a_direction[1]) {
        row.setAttribute(this.directionAttr, a_direction[0]);
        ascending = true;
      }
    };

    var colType = a_types.includes(this.options.columnType[colNumber])
      ? this.options.columnType[colNumber]
      : a_types[0];
    this.functionCaller(colType, ascending, colNumber, rows);
    
    this.reOrderNb(rows);
    for(var row of rows){
      this.table.querySelector("tbody").appendChild(row);
    }
    
    this.displayPages(this.table.dataset.page);
  }

  sortString(rows, value, ascending) {
    rows.sort(function (a, b) {
      if (ascending) {
        return a.children[value].innerHTML.toLowerCase() <
          b.children[value].innerHTML.toLowerCase()
          ? -1
          : 0;
      } else {
        return a.children[value].innerHTML.toLowerCase() >
          b.children[value].innerHTML.toLowerCase()
          ? -1
          : 0;
      }
    });
  }

  sortNumber(rows, value, ascending) {
    rows.sort(function (a, b) {
      if (
        isNaN(a.children[value].innerHTML) ||
        isNaN(b.children[value].innerHTML)
      ) {
        this.throwError(value, rows);
      }

      if (ascending) {
        return a.children[value].innerHTML - b.children[value].innerHTML;
      }

      return b.children[value].innerHTML - a.children[value].innerHTML;
    });
  }

  sortDbDate(rows, value, ascending) {
    rows.sort(function (a, b) {
      var allRegex = getRegexConstructs(regex.dateDb);
      if (
        (allRegex[0].test(a.children[value].innerHTML),
        allRegex[1].test(b.children[value].innerHTML))
      ) {
        if (ascending) {
          return a.children[value].innerHTML - b.children[value].innerHTML;
        } else {
          return b.children[value].innerHTML - a.children[value].innerHTML;
        }
      } else {
        this.throwError(value, rows);
      }
    });
  }

  sortDateEnSlash(rows, value, ascending) {
    rows.sort(function (a, b) {
      var allRegex = getRegexConstructs(regex.dateEnSlash);
      if (
        (allRegex[0].test(a.children[value].innerHTML),
        allRegex[1].test(b.children[value].innerHTML))
      ) {
        if (ascending) {
          return (
            new Date(a.children[value].innerHTML) -
            new Date(b.children[value].innerHTML)
          );
        } else {
          return (
            new Date(b.children[value].innerHTML) -
            new Date(a.children[value].innerHTML)
          );
        }
      } else {
        this.throwError(value, rows);
      }
    });
  }

  sortDateEnDash(rows, value, ascending) {
    rows.sort(function (a, b) {
      var allRegex = getRegexConstructs(regex.dateEnDash);
      if (
        (allRegex[0].test(a.children[value].innerHTML),
        allRegex[1].test(b.children[value].innerHTML))
      ) {
        var explodedDateA = a.children[value].innerHTML.split("-");
        var explodedDateB = b.children[value].innerHTML.split("-");
        if (ascending) {
          return (
            new Date(
              `${explodedDateA[1]}/${explodedDateA[2]}/${explodedDateA[0]}`
            ) -
            new Date(
              `${explodedDateB[1]}/${explodedDateB[2]}/${explodedDateB[0]}`
            )
          );
        } else {
          return (
            new Date(
              `${explodedDateB[1]}/${explodedDateB[2]}/${explodedDateB[0]}`
            ) -
            new Date(
              `${explodedDateA[1]}/${explodedDateA[2]}/${explodedDateA[0]}`
            )
          );
        }
      } else {
        this.throwError(value, rows);
      }
    });
  }

  sortDateFrSlash(rows, value, ascending) {
    rows.sort(function (a, b) {
      var allRegex = getRegexConstructs(regex.dateFrSlash);
      if (
        (allRegex[0].test(a.children[value].innerHTML),
        allRegex[1].test(b.children[value].innerHTML))
      ) {
        var explodedDateA = a.children[value].innerHTML.split("/");
        var explodedDateB = b.children[value].innerHTML.split("/");
        if (ascending) {
          return (
            new Date(
              `${explodedDateA[1]}/${explodedDateA[0]}/${explodedDateA[2]}`
            ) -
            new Date(
              `${explodedDateB[1]}/${explodedDateB[0]}/${explodedDateB[2]}`
            )
          );
        } else {
          return (
            new Date(
              `${explodedDateB[1]}/${explodedDateB[0]}/${explodedDateB[2]}`
            ) -
            new Date(
              `${explodedDateA[1]}/${explodedDateA[0]}/${explodedDateA[2]}`
            )
          );
        }
      } else {
        this.throwError(value, rows);
      }
    });
  }

  sortDateFrDash(rows, value, ascending) {
    rows.sort(function (a, b) {
      var allRegex = getRegexConstructs(regex.dateFrDash);
      if (
        (allRegex[0].test(a.children[value].innerHTML),
        allRegex[1].test(b.children[value].innerHTML))
      ) {
        var explodedDateA = a.children[value].innerHTML.split("-");
        var explodedDateB = b.children[value].innerHTML.split("-");
        if (ascending) {
          return (
            new Date(
              `${explodedDateA[1]}/${explodedDateA[0]}/${explodedDateA[2]}`
            ) -
            new Date(
              `${explodedDateB[1]}/${explodedDateB[0]}/${explodedDateB[2]}`
            )
          );
        } else {
          return (
            new Date(
              `${explodedDateB[1]}/${explodedDateB[0]}/${explodedDateB[2]}`
            ) -
            new Date(
              `${explodedDateA[1]}/${explodedDateA[0]}/${explodedDateA[2]}`
            )
          );
        }
      } else {
        this.throwError(value, rows);
      }
    });
  }

  functionCaller(funcName, ascending, value, rows) {
    value--; //Because we access the array of children that starts from 0 whereas the selector nth-child starts from 1
    var functions = {
      string: () => {
        this.sortString(rows, value, ascending);
      },
      number: () => {
        this.sortNumber(rows, value, ascending);
      },
      Ymd: () => {
        this.sortDbDate(rows, value, ascending);
      },
      "m/d/Y":  () => {
        this.sortDateEnSlash(rows, value, ascending);
      },
      "d/m/Y":  () => {
        this.sortDateFrSlash(rows, value, ascending);
      },
      "m-d-y":  () => {
        this.sortDateEnDash(rows, value, ascending);
      },
      "d-m-y":  () => {
        this.sortDateFrDash(rows, value, ascending);
      },
    };

    functions[funcName]();
  }

  getRegexConstructs(regex) {
    return [new RegExp(regex), new RegExp(regex)];
  }

  throwError(value, rows) {
    this.table.querySelector("tbody").append(rows);
    throw ("Error", `Wrong format type for column ${value} !`);
  }

  /**
    * Build the pagination at the start
    */
  buildPagination() {
    if (!this.options.nbPerPage) {
      return;
    }
    var rows = a_detachAndGet(this.table.querySelector("tbody"));
    var nb = 0;

    rows.forEach((row) => {
      row.dataset.nb = nb;
      nb++;
    });

    for(var row of rows){
      this.table.querySelector("tbody").appendChild(row);
    }

    var classNames = [];
    var tableHeader = this.table.querySelector('thead[class*="a-table-header"]');
    var paginateClass = "a-primary";
    if (tableHeader) {
      for(var value of tableHeader.classList){
        if(value.match("a-table-header")){
          var split = value.split("-");
          paginateClass = "a-" + split[split.length - 1];
        }
      }
    }

    var nbPages = parseInt(rows.length / this.options.nbPerPage);
    if(parseInt(rows.length)%parseInt(this.options.nbPerPage) != 0){nbPages++;}

    var colspan = this.table
      .querySelector("thead tr:first-child").children.length;

    var tfoot = document.createElement('tfoot');
    tfoot.innerHTML = `<tr><td class="center a-paginate-line" colspan="${colspan}">`;
    this.table.appendChild(tfoot);

    for (var i = 0; i < nbPages; i++) {
      this.table
        .querySelector("tfoot tr td")
        .innerHTML +=
          `<button type="button" data-index="${i}" class="a-btn-sm ${paginateClass} a-paginate-btn ${i === 0 ? "a-active" : ""}">
          ${i + 1}</button>`;
    }

    var btns = this.table.querySelectorAll('.a-paginate-btn')
    for(var btn of btns){
        btn.addEventListener('click', (e) => {
        var previousActiveBtn = this.table.querySelector('.a-paginate-btn.a-active');
        previousActiveBtn.classList.remove('a-active');
        e.target.closest('.a-paginate-btn').classList.add('a-active');
      })
    }
    // TODO réaffecter le bouton actif quand celui-ci disparait

    //Create buttons ...
    var etcBtn = document.createElement('button');
    etcBtn.classList.add(`a-btn-sm`, `${paginateClass}`);
    etcBtn.innerHTML = '...';
    etcBtn.id = 'etcBtnEnd';
    this.table.querySelector('tfoot button:last-child').before(etcBtn);

    var etcBtnStart = etcBtn.cloneNode(true);
    etcBtnStart.id = 'etcBtnStart';
    this.table.querySelector('tfoot button:first-child').after(etcBtnStart);

    //Change of page
    this.table.querySelector('tfoot').addEventListener('click', (e) => {
      if(e.target.closest('button'))
      this.displayPages(e.target.closest('button').dataset.index);
    });
  }

  /**
   * Reorder rows in case of sorting, shuffling
   */
  reOrderNb(rows) {
    var nb = 0;
    rows.forEach((row) => {
      if (row.dataset.nb !== undefined) {
        row.dataset.nb = nb;
        nb++;
      }
    });
  }

  /**
   * Display buttons for change of pages.
   * If maxBtn is null, then the number of max buttons stay the same as before
   *
   */
  displayPagesBtn(maxBtn) {
    // TODO Fix launched as duplicate when input change
    if (maxBtn == null) {
      maxBtn = parseInt(this.table.querySelectorAll('tfoot button:not(.a-hide)')
      [this.table.querySelectorAll('tfoot button:not(.a-hide)').length-1].dataset.index)
    }

    var currPage = parseInt(this.table.dataset.page);

    var btns = this.table.querySelectorAll("tfoot button");

    for (var btn of btns) {
      var index = parseInt(btn.dataset.index);

      if (
        index != undefined &&
        index != maxBtn &&
        index != 0 &&
        (index > currPage + 2 || index > maxBtn || index < currPage - 2)
      ) {
        btn.classList.add("a-hide");
      } else {
        btn.classList.remove("a-hide");
      }
    }

    //Displaying ... buttons at the start and/or at the end
    if (maxBtn > 3 && maxBtn - 3 > currPage) {
      this.table.querySelector("#etcBtnEnd").classList.remove("a-hide");
      this.table.querySelector('button[data-index="' + maxBtn + '"]').before(this.table.querySelector("#etcBtnEnd"))
    } else {
      this.table.querySelector("#etcBtnEnd").classList.add("a-hide");
    }

    if (currPage - 2 > 1) {
      this.table.querySelector("#etcBtnStart").classList.remove("a-hide");
    } else {
      this.table.querySelector("#etcBtnStart").classList.add("a-hide");
    }
  }

  /**
   * Pagination in case of shuffling
   */
  paginationShuffling() {
    var rows = this.table.querySelectorAll("tbody tr:not(.a-hide)");
    for(var row of rows){
      row.dataset.nb = "";
    }
    Array.from(this.table.querySelectorAll("tbody tr.a-hide")).map((e) => {e.removeAttribute("data-nb")});

    this.reOrderNb(rows);

    var maxBtn = parseInt(rows.length / this.options.nbPerPage)-1;
    if(parseInt(rows.length)%parseInt(this.options.nbPerPage) != 0){maxBtn++;}

    this.displayPagesBtn(maxBtn);
    this.displayPages(0);
  }

  /**
   * Display the selected page
   */
  displayPages(nbPage) {
    if (nbPage == undefined) {
      return;
    }
    var rows = this.table.querySelectorAll("tbody tr");
    var min = nbPage * this.options.nbPerPage;
    var max = min + this.options.nbPerPage;
    for (var row of rows) {
      var dataNb = row.dataset.nb;
      if (dataNb === undefined || dataNb >= max || dataNb < min) {
        row.classList.add("a-hide");
      } else {
        row.classList.remove("a-hide");
      }
    }
    this.table.dataset.page = nbPage;
    this.displayPagesBtn();
  }

  destroy = function () {
    this.unbind();
    return null;
  }

};
