class AtomNotificationWraper{
  static globalAlignments = {
      tr : {
          top  : '70px',
          right: '10px'
      },
      tl : {
          top : '70px',
          left: '10px'
      },
      bl : {
          bottom: '30px',
          left  : '10px'
      },
      br : {
          bottom: '30px',
          right : '10px'
      }
  }
  static wrappers = {
      id   : "atomNotify-wrapper-",
      style: "position:fixed;z-index:99999;pointer-events:none;",
  };
  constructor(position){
      const wrapper = document.createElement("div");
      wrapper.setAttribute('id', AtomNotificationWraper.wrappers.id + position);
      wrapper.style.cssText = AtomNotificationWraper.wrappers.style;
      for (const [key, value] of Object.entries(AtomNotificationWraper.globalAlignments[position])) {
          wrapper.style[key] = value;
      } 
      document.body.appendChild(wrapper);
      this.element = wrapper;
  }
  static getWrapper(position){
      var    key          = position in AtomNotificationWraper.globalAlignments ? position : 'tr';
      return this.element = document.getElementById(this.wrappers.id + key) ?? new this(key);
  }
  static setGlobalConfig(config) { // TODO gérer les conflits de types
      this.globalConfig = {
          ...this.globalConfig,
          ...config,
      };
  }
}

// TODO gerer l'html dans le contenu
class AtomNotification {

  static globalConfig = {
      clickToHide          : true,
      autoHide             : true,
      autoHideDelay        : 15000,
      alignment            : "tr",
      type                 : "success",
      showAnimationTime    : 450,
      hideAnimationDuration: 500,
      htmlEnable           : true,
      maxElements          : 5,           // TODO gérer le cas
  };
  static wrappers          = {}
  static acceptedAlignment = ["tl","tr","bl","br"];
  static acceptedTypes     = ["success","danger","info","warning","light","dark","primary","secondary"];
  static styles            = {
      commun   : "font-size:14px;font-weight:bold;padding: 0.7em 1em;border-radius:7px; margin: 0.5em 1em 0.5em auto;overflow:hidden;max-width:600px;width:fit-content;align-self:end;pointer-events:fill;cursor: pointer;",
      success  : ["a-text-success", "a-h-success"],
      danger   : ["a-text-danger", "a-h-danger"],
      info     : ["a-text-info", "a-h-info"],
      light    : ["a-text-light", "a-h-light"],
      warning  : ["a-text-warning", "a-h-warning"],
      dark     : ["a-text-dark", "a-h-dark"],
      primary  : ["a-text-primary", "a-h-primary"],
      secondary: ["a-text-secondary", "a-h-secondary"]
  };

  constructor(text="This is a notification", localConfig) {
      this.localConfig = {
          ...AtomNotification.globalConfig,
          ...localConfig,
      };
      AtomNotification.wrappers[this.localConfig.alignment] = AtomNotification.wrappers[this.localConfig.alignment] ?? AtomNotificationWraper.getWrapper(this.localConfig.alignment);
                                this.wrappers               = AtomNotification.wrappers;
                                this.text                   = text;
  }

  show(){
      var element           = document.createElement('div');
      element.innerText     = this.text;
      if(this.localConfig.htmlEnable){
          element.innerHTML = this.text;
      }
      element.style.cssText = AtomNotification.styles.commun;
      element.classList.add('atom-notification-content');

      // TODO faire mieux :)
      switch(this.localConfig.alignment){
          case 'tr': 
          case 'br': 
              AtomAnimation.slideRightIn(element, this.localConfig.showAnimationTime);
              break;
          case 'tl'   : 
          case 'bl'   : 
               default: 
              AtomAnimation.slideLeftIn(element, this.localConfig.showAnimationTime);
              break;
      }
     
      AtomNotification.styles[this.localConfig.type].forEach(className => element.classList.add(className));// TODO protect against wrong type
      this.wrappers[this.localConfig.alignment].element.appendChild(element);

      if (this.localConfig.autoHide) {
          setTimeout(
              () => this.destroy(element),
              this.localConfig.autoHideDelay
          );
      }
      element.onclick = this.localConfig.clickToHide ? () => this.destroy(element) : null;
  }


  destroy(element){ 
      // TODO faire mieux :)
      switch(this.localConfig.alignment){
          case 'tr': 
          case 'br': 
              AtomAnimation.slideRightOut(element,this.localConfig.hideAnimationDuration);
              break;
          case 'tl'   : 
          case 'bl'   : 
               default: 
              AtomAnimation.slideLeftOut(element,this.localConfig.hideAnimationDuration);
              break;
      }
      
      setTimeout(
          () => a_detach(element),
          this.localConfig.hideAnimationDuration
      );
  }

  static trigger(text, style){
      var config = (typeof style === "string" ? {type : style} : style);
      (new AtomNotification(text, config)).show();
  }

  static setGlobalConfiguration(config) {
      this.globalConfig = {
          ...this.globalConfig,
          ...config,
      };
  }
  setLocalConfig(config) {
      this.localConfig = {
          ...this.localConfig,
          ...config,
      };
  }
  getLocalConfig() {
      return this.localConfig;
  }
}