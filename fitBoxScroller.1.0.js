(function($) {
	$.fn.fitBoxScroller = function(userArgs) {
		if(!this.length) return false;
		
		var args = {
			incImages:true,
			bar:{
				size:20,
				backColor:'#f00',
				marginLeft:0,
				frameBorderWidth:0,
				frameBorderColor:'#ccc',
				frameBorderStyle:'solid',
				frameBackground:''
			},
			isTouchAreaBar:false,
			touch:{
				decrease:0.3,
				movement:2,
				fps:25
			}
		};
		$.extend(true,args,userArgs);
		
		var frame = this.css({overflow:'hidden',padding:0});
		var info = {
			id:frame.prop('id'),
			barId:'bar'+Date.now(),
			frameH:frame.height(),
			frameW:frame.width(),
			contentLength:0,
			contPos:0,
			maxScroll:0,
		};
		info.scrollFrameLength = info.frameH-args.bar.frameBorderWidth*2
		var barInfo = {
			drag:false,
			loc:0,
			move:0,
			speed:1
		}
		var key = {
			point:'pageY',
			move:'top'
		}
		var content, bar;
		
		if(args.incImages) {
			$(window).load( function() {
				createBox();
			});
		}else{
			createBox();
		}
		
//CREATE BOX AND SCROLL BAR
		function createBox() {
			content = $('<div></div>').addClass('fixBoxScroller_content').css({position:'relative',top:0,left:0,width:info.frameW-args.bar.size-args.bar.frameBorderWidth*2+'px','float':'left'}).append(frame.contents()).appendTo(frame);
			info.contentLength = content.outerHeight(true);
			
			info.maxScroll = (info.contentLength-info.frameH)*-1;
			bar = $('<div></div>').prop('id',info.barId).addClass('fixBoxScroller_bar').css({position:'absolute',top:0,left:0,backgroundColor:args.bar.backColor,cursor:'pointer',width:args.bar.size-args.bar.marginLeft+'px',height:parseInt(info.scrollFrameLength/info.contentLength*info.frameH)+'px'});
			
			var barframe = $('<div></div>').addClass('fixBoxScroller_frame').css({position:'relative',width:args.bar.size+'px',height:info.scrollFrameLength+'px','float':'left',backgroundColor:args.bar.frameBackground,border:args.bar.frameBorderWidth+'px '+args.bar.frameBorderStyle+' '+args.bar.frameBorderColor}).append(bar).appendTo(frame);
			
			barInfo.speed = info.contentLength/info.scrollFrameLength;
			barframe = null;
			
			setupEvent();
			return false;
		}
		
//SETUP EVENTS
		function setupEvent(){
			
			if('ontouchstart' in document.documentElement === true) {
				if(args.isTouchAreaBar) info.id = info.barId;
				args.touch.sendMovement = function(obj) {
					barInfo.move = obj.y*-1;
					if(args.isTouchAreaBar) barInfo.move = obj.y*barInfo.speed;
					
					moveContent();
					return false;	
				}
				touchmove = new TouchMove(info.id, args.touch);
			}else{
				bar.bind('mousedown', function(e) {
					e.preventDefault();
					barInfo.drag = true;
					barInfo.loc = e[key.point];
					return false;
				}).bind('mouseup', function(e) {
					e.preventDefault();
					barInfo.drag = false;
					return false;
				}).bind('mouseout', function(e) {
					barInfo.drag = false;
					return false;
				}).bind('mousemove', function(e) {
					e.preventDefault();
					if(barInfo.drag) {
						barInfo.move = (e[key.point]-barInfo.loc)*barInfo.speed;
						barInfo.loc = e[key.point];
						moveContent();
					}
					return false;
				});
				
				if($.fn.mousewheel) {
					frame.bind('mousewheel', function(e, delta) {
						e.preventDefault();
						barInfo.move = delta*10*barInfo.speed*-1;
						moveContent();
						return false;
					});
				}
			}
			
			return false;
		}
		
		function moveContent() {
			var newPos = info.contPos-barInfo.move;
			if(newPos > 0) newPos = 0;
			else if(newPos < info.maxScroll) newPos = info.maxScroll;
			content.css(key.move,newPos+'px');
			info.contPos = newPos;
			var barPos = newPos/info.contentLength*info.scrollFrameLength*-1;
			bar.css(key.move,barPos+'px');
				
			newPos = barPos = null;
			return false;
		}
		
		return this;
	}
})(jQuery);

var TouchMove = function(id, args) {
	if(!document.getElementById(id)) return false;
	else 
		var target = document.getElementById(id);
	
	var posiX = 0, posiY = 0;
	var accelX = 0, accelY = 0;
	var initPosiX = 0, initPosiY = 0;
	var endPosiX = 0, endPosiY = 0;
	var counter = 1;
	var touchend = true;
	var fpsRate = Math.ceil(1000/args.fps);
	var timer = null, timerRun = false;
	
	target.addEventListener('touchstart', function(e) {	
		e.preventDefault();
		if(timerRun) {
			window.clearInterval(timer);
			timerRun = false;
		}	
		counter = 1; 
		accel = 0; 
		touchend = false;
		posiX = e.touches[0].pageX;
		posiY = e.touches[0].pageY;
		initPosiX = posiX;
		initPosiY = posiY;
		endPosiX = posiX;
		endPosiY = posiY;
			
		timer = window.setInterval(function(){
			timerRun = true;
			counter++;		
			moving();
		}, args.fpsRate);
		return false;
	}, false);
		
	target.addEventListener('touchmove', function(e) {
		e.preventDefault();
		var newPosiX = e.touches[0].pageX;
		var newPosiY = e.touches[0].pageY;
		endPosiX = newPosiX;
		endPosiY = newPosiY;
		var gapX = newPosiX-posiX;
		var gapY = newPosiY-posiY;
		
		args.sendMovement({x:gapX, y:gapY});
		
		posiX = newPosiX;
		posiY = newPosiY;
		newPosiX = newPosiY = gapX = gapY = null;
		
		return false;
	}, false);
		
	target.addEventListener('touchend', function(e) {
		e.preventDefault();
		touchend = true;
		accelX = Math.round((endPosiX-initPosiX)/counter*args.movement);
		accelY = Math.round((endPosiY-initPosiY)/counter*args.movement);
		return false;
	}, false);
		
	function moving() {
		if(touchend) {
			args.sendMovement({x:accelX, y:accelY});
				
			if(accelX > 0) {
				accelX -= Number(args.decrease);
				if(accelX <= 0) {
					accelX = 0;
					stopTimer();
				}
			}else if(accelX < 0) {
				accelX += Number(args.decrease);
				if(accelX >= 0) {
					accelX = 0;
					stopTimer();
				}
			}
			if(accelY > 0) {
				accelY -= Number(args.decrease);
				if(accelY <= 0) {
					accelY = 0;
					stopTimer();
				}
			}else if(accelY < 0) {
				accelY += Number(args.decrease);
				if(accelY >= 0) {
					accelY = 0;
					stopTimer();
				}
			}
		}
		return false;
	}
	
	function stopTimer() {
		if(accelX == 0 && accelY == 0) {
			window.clearInterval(timer);
			timerRun = false;
		}
		return false;
	}
	return false;
}