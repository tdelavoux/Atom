$(document.body).on("click", ".a-collapsable", function () {
  const object = $(this);
  const target = object.attr("collapse-target")
    ? $(object.attr("collapse-target"))
    : object.next(".a-panel-content"); // By default, use the a-panel-content following the header
  if (target.hasClass("collapsed") || target.hasClass("a-collapsed")) {
    target.show(300);
    target.removeClass("collapsed");
    target.removeClass("a-collapsed");
  } else {
    target.addClass("collapsed");
    target.hide(300);
  }
});

(function ($) {
  $.fn.atomCollapse = function (customOptions) {
    this.initialize = function (customOptions) {
      var options = {
        collapsedText: null,
        startingPosition: null,
      };
      $.extend(options, customOptions);

      var object = $(this);
      var text = object.html();
      var target = $($(this).attr("collapse-target"));
      object.addClass("a-pointer");
      object.on("click", function () {
        if (object.hasClass("collapsed")) {
          object.html(text);
          object.removeClass("collapsed");
          target.show(300);
        } else {
          options.collapsedText && object.html(options.collapsedText);
          object.addClass("collapsed");
          target.hide(300);
        }
      });
      options.startingPosition === "collapsed" &&
        object.addClass("collapsed") &&
        target.hide() &&
        options.collapsedText &&
        object.html(options.collapsedText);
      return this;
    };

    this.destroy = function () {
      this.unbind();
      return null;
    };

    if (this.length > 1) {
      var collection = [];
      this.each(function () {
        collection.push($(this).atomCollapse(customOptions));
      });
      return collection;
    } else {
      return this.initialize(customOptions);
    }
  };
})(jQuery);
