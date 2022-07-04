class AtomSpinnerElement{
    constructor(el) {
        if(!(el instanceof HTMLElement)){console.warn("AtomCollapse: Element is not a valid HTMLElement");return null;}
        this.target = el;
        this.pre_content = null;
    }

    spin(content=null){
        this.pre_content = this.target.innerHTML;
        this.target.innerHTML = `<span class="flex ai-c jc-c"><i class="fas fa-circle-notch fa-spin mr-05"></i>${content}</span>`;
        this.target.disabled = true;
        this.target.classList.add("spin");
    }

    stop(){
        this.target.innerHTML = this.pre_content ?? '';
        this.target.disabled = false;
        this.target.classList.remove("spin");
        this.pre_content = null;
    }

    stopAndUpdate = function (userContent='') {
        this.target.innerHTML = userContent;
        this.stop;
    };
}