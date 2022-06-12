$(
  (function (factory) {
    if (typeof define === "function" && define.amd) {
      define(["jquery"], factory);
    } else if (typeof module === "object" && module.exports) {
      // Node/CommonJS
      module.exports = function (root, jQuery) {
        if (jQuery === undefined) {
          if (typeof window !== "undefined") {
            jQuery = require("jquery");
          } else {
            jQuery = require("jquery")(root);
          }
        }
        factory(jQuery);
        return jQuery;
      };
    } else {
      // Browser globals
      factory(jQuery);
    }
  })(function ($) {
    const pluginName = "atomNotification";

    var pluginOptions = {
      clickToHide: true,
      autoHide: true,
      autoHideDelay: 7000,
      alignment: "top right",
      type: "success",
      showAnimationTime: 450,
      hideAnimationDuration: 200,
      maxElements: 5, // TODO gérer le cas
    };

    const acceptedAlignment = [
      "top left",
      "top right",
      "bottom left",
      "bottom right",
    ];
    const acceptedTypes = [
      "success",
      "danger",
      "info",
      "warning",
      "light",
      "dark",
      "primary",
      "secondary",
    ];

    var styles = {
      commun:
        "font-size:14px;font-weight:bold;padding: 0.7em 1em;border-radius:7px; margin: 0.5em 1em;overflow:hidden;max-width:600px;",
      success: "background-color:#dff0d8;color:#3c763d;",
      danger: "background-color:#f2dede;color:#a94442;",
      info: "background-color:#d9edf7;color:#31708f;",
      light: "background-color:#ededed;color:#61605f;",
      warning: "background-color:#fcf8e3;color:#8a6d3b;",
      dark: "background-color:#807e7d;color:#f7f5f5;",
      primary: "background-color:#d0e0fc;color:#0b3d91;",
      secondary: "background-color:#f0d8ff;color:#6b2498;",
    };

    // TODO overight les position par des positions persos !
    var wrappers = {
      tr: {
        id: "#atomNotify-wrapper-tr",
        html: '<div id="atomNotify-wrapper-tr" style="position:fixed;top:70px;right:10px;z-index:99999;"></div>',
      },
      tl: {
        id: "#atomNotify-wrapper-tl",
        html: '<div id="atomNotify-wrapper-tl" style="position:fixed;top:70px;left:10px;z-index:99999;"></div>',
      },
      bl: {
        id: "#atomNotify-wrapper-bl",
        html: '<div id="atomNotify-wrapper-bl" style="position:fixed;bottom:30px;left:10px;z-index:99999;"></div>',
      },
      br: {
        id: "#atomNotify-wrapper-br",
        html: '<div id="atomNotify-wrapper-br" style="position:fixed;bottom:30px;right:10px;z-index:99999;"></div>',
      },
    };

    function getOptionDefaultValue(a) {
      return pluginOptions[a];
    }

    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function initializeWrappers() {
      for (const key in wrappers) {
        $(wrappers[key].id).length === 0 &&
          $("body").append(wrappers[key].html);
      }
    }

    function Notification(data, options) {
      this.options = {};
      $.extend(this.options, pluginOptions);

      this.id =
        Date.now().toString(Math.floor(Math.random() * 10) + 10) +
        Math.floor(Math.random() * 1000).toString(
          Math.floor(Math.random() * 10) + 10
        );

      if (typeof options === "string") {
        this.options.type = options;
      } else {
        $.extend(this.options, options);
      }

      this.element = $(
        '<div class="atom-notification-content" style="display:none;' +
          styles.commun +
          styles[this.getOption("type", acceptedTypes)] +
          '">' +
          data +
          "</div>"
      );

      initializeWrappers(
        this.getIntOption("xWrapperPos"),
        this.getIntOption("yWrapperPos")
      );
      this.run(data);
    }

    Notification.prototype.run = function (data) {
      switch (this.getOption("alignment", acceptedAlignment)) {
        case "top right":
          $(wrappers.tr.id).append(this.element);
          break;
        case "top left":
          $(wrappers.tl.id).append(this.element);
          break;
        case "bottom right":
          $(wrappers.br.id).append(this.element);
          break;
        case "bottom left":
          $(wrappers.bl.id).append(this.element);
          break;
      }
      this.show();
    };

    Notification.prototype.show = function () {
      this.element.toggle(this.getOption("showAnimationTime")).delay(2000);
      if (this.getOption("autoHide")) {
        setTimeout(
          () => this.destroy(),
          this.getOption("autoHideDelay") -
            this.getOption("hideAnimationDuration")
        );
      }
      if (this.getOption("clickToHide")) {
        this.element.click(() => this.destroy());
      }
    };

    Notification.prototype.destroy = function () {
      this.element.hide(this.getOption("hideAnimationDuration"));
      setTimeout(
        () => this.element.remove(),
        this.getOption("hideAnimationDuration")
      );
    };

    Notification.prototype.getOption = function (b, a = null) {
      return !a || a.includes(this.options[b])
        ? this.options[b]
        : getOptionDefaultValue(b);
    };

    Notification.prototype.getIntOption = function (a) {
      return isNumeric(this.options[a])
        ? this.options[a]
        : getOptionDefaultValue(a);
    };

    $[pluginName] = function (d, o) {
      new Notification(d, o);
      return;
    };
  })
);
