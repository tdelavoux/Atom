function a_toggle(el, time = 0.4){
    if(!(el instanceof HTMLElement)){console.warn("A_Toggle: Element is not a valid HTMLElement");return;}
    el.style.transition = `max-height ${time}s ease-out`;
    el.style.overflow   = 'hidden';
    el.style.maxHeight  = el.classList.contains('a-collapsed') ? null : el.scrollHeight + "px";
    el.style.height     = el.classList.contains('a-collapsed') ? null : el.scrollHeight + "px";
    if (el.style.maxHeight){
        el.style.maxHeight = null;
    } else {
        el.style.maxHeight = el.scrollHeight + "px";
    }
    el.classList.toggle('a-collapsed');
}