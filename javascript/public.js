/**
 * @fileoverview
 * @author lihaomin@lan-bridge.com(passerby.li)
 */
function init() {
	var iWinH = $(window).height();
	yyq_iWinW = $(window).width();
	var iSidebarH = $('.side-bar').height();
	$('.side-bar').css('top', (iWinH - iSidebarH) / 2);
}

$(function() {
	init();
	$(window).resize(function() {
		init();
	});
});

//导航下拉
$(function() {
	$(".nav").find('.item103').remove();

	$(".nav").find('.parent').hover(function() {
		(function(obj) {
			var objoffl = obj.offset().left;
			obj.stop();
			var iObj = obj.find("ul");
			obj.addClass('hover');

			//showTimer = setTimeout(function() {
			obj.children(".subnav").find("ul").css({

				"left": objoffl - (($(window).width() - 960) / 2) - 280
			});
			obj.children(".subnav").show();
			//}, 1);
		})($(this));
	}, function() {
		(function(obj) {
			if (!obj.is(":animated")) {
				//clearTimeout(showTimer);
				$(this).removeClass('hover');
				$(".subnav").hide();
			}
		})($(this));
	});


});
//语言选择
$(function() {
	var $langinline = $('.lang-inline');
	$('.mod-languages').click(function() {
		if ($langinline.is(':hidden')) {
			$(this).find("i").removeClass('lang-icon-dropdown').addClass('lang-icon-dropup');
			$('.lang-inline').show();
		} else {
			$(this).find("i").removeClass('lang-icon-dropup').addClass('lang-icon-dropdown');
			$('.lang-inline').hide();
		}

	});
});

