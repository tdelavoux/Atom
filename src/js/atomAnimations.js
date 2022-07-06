function a_toggle(el, time = 0.4) {
  if (!(el instanceof HTMLElement)) {
    console.warn("A_Toggle: Element is not a valid HTMLElement");
    return;
  }
  el.style.transition = `max-height ${time}s ease-out`;
  el.style.overflow = "hidden";
  el.style.maxHeight = el.classList.contains("a-collapsed")
    ? null
    : el.scrollHeight + "px";
  el.style.height = el.classList.contains("a-collapsed")
    ? null
    : el.scrollHeight + "px";
  if (el.style.maxHeight) {
    el.style.maxHeight = null;
  } else {
    el.style.maxHeight = el.scrollHeight + "px";
  }
  el.classList.toggle("a-collapsed");
}
class AtomAnimation{

  static animTime  = 500;
  static visibleX  = { transform: 'translateX(0px)', opacity: '1' };
  static visibleY  = { transform: 'translateY(0px)', opacity: '1' };
  static rightOut  = { transform: 'translateX(80px)', opacity: '0' };
  static leftOut   = { transform: 'translateX(-80px)', opacity: '0' };
  static upOut     = { transform: 'translateY(-30px)', opacity: '0' };
  static bottomOut = { transform: 'translateY(30px)', opacity: '0' };
  
  static slideRightIn(el,time){
      el.animate([this.rightOut,this.visibleX],{duration: time ?? this.animTime});
  }

  static slideRightOut(el,time){
      el.animate([this.visibleX,this.rightOut,],{duration: time?? this.animTime});
  }

  static slideLeftIn(el,time){
      el.animate([this.leftOut,this.visibleX],{duration: time ?? this.animTime});
  }

  static slideLeftOut(el,time){
      el.animate([this.visibleX,this.leftOut,],{duration: time?? this.animTime});
  }

  static slideUpIn(el,time){
      el.animate([this.upOut,this.visibleY],{duration: time ?? this.animTime});
  }

  static slideUpOut(el,time){
      el.animate([this.visibleY,this.upOut,],{duration: time?? this.animTime});
  }

}