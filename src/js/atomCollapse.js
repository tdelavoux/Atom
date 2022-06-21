document.body.addEventListener('click', function(e) {
    var t = e.target;
    if(t && t.classList.contains('a-collapsable')){
        var content = document.getElementById(t.getAttribute('collapse-target')) ?? t.nextElementSibling;
        content ? a_toggle(content) : console.warn("AtomPanTab : No content found for this collapsable");   
    }
});

class AtomCollapse {

    constructor(el, customOptions) {
        if(!(el instanceof HTMLElement)){console.warn("AtomCollapse: Element is not a valid HTMLElement");return null;}

        this.options = {
            collapsedText   : null,
            startingPosition: null,
            collapseSpeed   : 0.4
        };
        $.extend(this.options, customOptions);

        this.innerText  = el.innerHTML;
        this.target     = document.getElementById(el.getAttribute('collapse-target')) ?? el.nextElementSibling;

        if(!this.target instanceof HTMLElement){console.warn("AtomCollapse: Target element is not a valid HTMLElement");return null;}

        el.classList.add("a-pointer");
        this.options.startingPosition === 'collapsed' && this.target.classList.add('a-collapsed');

        let obj = this;
        el.addEventListener('click', obj.collapse_toggle.bind(obj));

    }

    collapse_toggle(){
        a_toggle(this.target, a_isNumeric(this.options.collapseSpeed) ? this.options.collapseSpeed : 0.4);
    }

    setCollapsedText(text){
        this.options.collapsedText = text;
    }

    setcollapseSpeed(speed){
        this.options.collapseSpeed = speed;
    }

}