var stayCollapsed = true, active = false, over = false; paused =false, overWhat = false;
var _w;
jQ(document).ready(function($){
	setTimeout(function(){
		startInterval(10000);
		showNext();
	},1000);
	var curVisible = jQ(".featured_items:visible");
	$("#pagination li:eq("+curVisible.index(".featured_items")+")").addClass("active");
	$("#pagination li").click(function(){
		if($(this).hasClass("active")){ return false }
		paused = true;
		setTimeout("paused = false; startInterval()",60000);
		var idx = $(this).index();
		showNext(idx);
	});
	$(".featured_items li a").click(function(e){
		if(active){ e.preventDefault(); return false; } 
	})
	$(".featured_items li").hover(function(){
		over = true;
		overWhat = $(this).index();
		var isBanner = $(this).attr('class').indexOf('banner') > -1;

		if(active){ return false }

		if (!isBanner) {
		$(this).find(".label").remove();

		$(this).css({"z-index":8}).stop().animate({"width":428},400,"easeInOutCirc");
		if($(this).find("img").attr("rel")){ //has a label
			$(this).find("a").append("<div class='label'>"+$(this).find("img").attr("rel")+"</div>")
			.find(".label").stop().animate({"width":418,"opacity":1},400,"easeInOutCirc");
		}
		}
	},function(){
		over = false;
		if(active){ return false }

	    var isBanner = $(this).attr('class').indexOf('banner') > -1;

	    if (!isBanner) {
		$(this).stop().css({"z-index":7}).animate({"width":212},300,"easeOutCirc", function(){
			$(this).css({"z-index":1,"background-color":"white"});	
		});
		if($(this).find("img").attr("rel")){
			$(this).find(".label").stop().animate({"width":1,"opacity":0},300,"easeOutCirc",function(){
				$(this).remove();
			});
		}
		startInterval();
	    }
	});
		
		/*$("#home").append("<a href='http://store.irobot.com/' id='home_banner' style='display:none;position:absolute;right:0px;top:0'><img alt='Free Shipping On All Home Robots' src='/images/template/home/freeship-button.png' border=0 /></a>");
		
		setTimeout(function(){
			if(!isIE){
				$("#home_banner").fadeIn(1000);
			} else {
				$("#home_banner").show();
			}
		},1000);
		
	$("#home").append("<a href='/us/learn/home/scooba.aspx' id='home_banner' style='display:none;position:absolute;right:0px;top:-25px'><img alt='' src='/images/template/home/scooba400button.png' border=0 /></a>");
*/
});
function startInterval(time){
	if(typeof(time)=="undefined"){
		time = 7000;
	}	
	clearInterval(_w);
	_w = setInterval(function(){
		if(!paused && !over){
			if(jQ(".featured_items:visible").attr("class").indexOf("forthehome")!==-1){
				clearInterval(_w);
				showNext();
				startInterval();
			} else {
			showNext();	
		}
		}
	},time);	
}
function showNext(nextSectionIdx){
	if(active){ return false };
	active = true;
	var speed = 250;
	var curVisible = jQ(".featured_items:visible");

	if (typeof (nextSectionIdx) == "undefined") { //this means the slideshow has auto-animated vs. someone clicking the button
		if(curVisible.next(".featured_items").length){ //auto-animate, not the first slide
		    var nextSection = curVisible.next(".featured_items");

		    if (nextSection.children()l.length < 2) {
		        jQ(".shadow_1").attr("style", "background: url('/images/template/home/newbigshadow.png') no-repeat; width: 1150px;");
		    } else {
		        jQ(".shadow_1").attr("style","");
		    }
			
			jQ("#home_banner").fadeIn(500);
		} else {  //auto-animate, the first slide
			var nextSection = jQ(".featured_items:eq(0)");
			
			if (nextSection.children().length < 2) {
			    jQ(".shadow_1").attr("style", "background: url('/images/template/home/newbigshadow.png') no-repeat; width: 1150px;");
			} else {
			    jQ(".shadow_1").attr("style", "");
			}

			jQ("#home_banner").fadeOut(500);
		}
	} else if(nextSectionIdx){ //user clicked, but not the first slide
	    var nextSection = jQ(".featured_items:eq(" + nextSectionIdx + ")");

	    if (nextSection.children().length < 2) {
	        jQ(".shadow_1").attr("style", "background: url('/images/template/home/newbigshadow.png') no-repeat; width: 1150px;");
	    } else {
	        jQ(".shadow_1").attr("style", "");
	    }

		jQ("#home_banner").fadeIn(500);
	} else { //user clicked the first slide
		var nextSection = jQ(".featured_items:eq(0)");
		
		if (nextSection.children().length < 2) {
		    jQ(".shadow_1").attr("style", "background: url('/images/template/home/newbigshadow.png') no-repeat; width: 1150px;");
		} else {
		    jQ(".shadow_1").attr("style", "");
		}

		jQ("#home_banner").fadeOut(500);
	}
	curVisible.find("li").trigger("mouseout").each(function(idx){
		jQ(this).delay(100*idx).animate({"top":"-150px","opacity":0},speed,"easeInQuad");
		if(!isIE){
			jQ("#item_shadows li").eq(idx).delay(100*idx).fadeOut(250);
		} else {
			jQ("#item_shadows li").eq(idx).delay(100*idx).hide();
		}
	});
	var transitionNext = function(){
		nextSection.find("li").css({"opacity":0,"top":-150});
		curVisible.hide();
		nextSection.show().find("li").each(function(idx){
			jQ(this).delay(100*idx).animate({"top":0,"opacity":1},speed,"easeOutQuad", function(){
				if(idx+1 == nextSection.find("li").length)
				active = false;
				if(over){ nextSection.find("li:eq("+overWhat+")").trigger("mouseover"); }
			});
			if(!isIE){
				jQ("#item_shadows li").eq(idx).css("display","none").delay(100*idx).fadeIn(250);
			} else {
				jQ("#item_shadows li").eq(idx).css("display","none").delay(100*idx).show();
			}
		});
	}
	if(curVisible.length){
		setTimeout(transitionNext,200*curVisible.find("li").length);
	} else {
		transitionNext();	
	}
	changeTitle(nextSectionIdx);
	jQ("#pagination .active").removeClass("active");
	jQ("#pagination li:eq("+nextSection.index(".featured_items")+")").addClass("active");
}
function changeTitle(titleIdx){
	var curVisible = jQ("#cat_cont div:visible");
	var animateNext = function(){
			curVisible.hide();
			if(typeof(titleIdx) == "undefined"){
				var nextCont = curVisible.next("div").length ? curVisible.next("div") : jQ("#cat_cont div:eq(0)");
			} else if(titleIdx) {
				var nextCont = jQ("#cat_cont div:eq("+titleIdx+")");
			} else {
				var nextCont = jQ("#cat_cont div:eq(0)");
			}
			nextCont.css({"top":"-"+jQ("#cat_cont").height()+"px"}).show().animate({"top":0},300,"easeOutCirc");
	}
	if(curVisible.length){
		setTimeout(function(){
			curVisible.animate({"top":jQ("#cat_cont").height()},300,"easeInCirc", animateNext);
		},1200);
	} else {
		setTimeout(function(){
			animateNext();
		},600);
	}
}
