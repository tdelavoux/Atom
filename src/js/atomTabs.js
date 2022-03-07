$("body").on("click",".atom-pan-tab-header-item",function() {
    var parent = $(this).closest('.atom-pan-tab');
    parent.find('.atom-pan-tab-body div').removeClass('active');
    parent.find('.atom-pan-tab-header-item').removeClass('active');
    $(this).addClass('active');
    $($(this).attr('data-target')).addClass('active');
});