class atomShuffleInstance {
  constructor(el, customClass=null) {
      if(!(el instanceof HTMLElement)){console.warn("AtomShuffleInstance: Element is not a valid HTMLElement");return null;}
      var className =customClass && customClass instanceof String ? customClass : "atomShuffleItem";
      el.addEventListener('keyup', function(){
          var val = el.value.toLowerCase();
          var items = document.getElementsByClassName(className);
          Array.from(items).forEach((it) => {
              if(val){
                  !a_is_visible(it) && it.dataset.title.toLowerCase().includes(val) && a_show(it);
                  a_is_visible(it) && !it.dataset.title.toLowerCase().includes(val) &&  a_hide(it);;
              }else{
                  !a_is_visible(it) && a_show(it);
              }
          });
      });
  }
};

let atomShuffle = function (customOptions) {
 
  var options = {
      itemSelector: "atomShuffleItem",
      animationTime: 500,
      visibility: false,
  };

  this.construct = function (customOptions) {
      options = { ...options, ...customOptions };
  };

  this.filter = function (funct) {

      var elements = document.getElementsByClassName(options.itemSelector);
      Array.from(elements).forEach((el) => {
          $visible = funct(el);
          $visible && (options.visibility || !a_is_visible(el)) && a_show(el, options.animationTime);
          !$visible && (options.visibility || a_is_visible(el)) && a_hide(el, options.animationTime);
      });
  };

  this.destroy = function (self) {delete self;};

  this.construct(customOptions);
};