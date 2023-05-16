var JOYSTICK_DIV = null;

function __init_joystick_div(father_element)
{
	JOYSTICK_DIV = document.createElement('div');
	/*var div_style = JOYSTICK_DIV.style;
	div_style.background = 'rgba(255,255,255,0)';
	div_style.position = 'absolute';
	div_style.top = '0px';
	div_style.bottom = '0px';
	div_style.left = '0px';
	div_style.right = '0px';
	div_style.margin = '0px';
	div_style.padding = '0px';
	div_style.borderWidth = '0px';
	div_style.position = 'absolute';
	div_style.overflow = 'hidden';
	div_style.zIndex = '10000';*/
	/*div_style.position = 'absolute';
	div_style.left = '40%';
	div_style.top = '40%';*/
	if(father_element) {father_element.appendChild( JOYSTICK_DIV );/*console.log("yeah");*/}
	else {document.body.appendChild( JOYSTICK_DIV );/*console.log("no~~~");*/}
}
var JoyStick = function( attrs ) {
	this.radius = attrs.radius || 50;
	this.inner_radius = attrs.inner_radius || this.radius / 2;
	this.x = attrs.x || 0;
	this.y = attrs.y || 0;
	this.mouse_support = attrs.mouse_support || true;
	this.father_element = attrs.father_element || null;

	if ( attrs.visible === undefined )
	{
		attrs.visible = true;
	}

	if ( attrs.visible )
	{
		this.__create_fullscreen_div(this.father_element);
	}
};

JoyStick.prototype.left = false;
JoyStick.prototype.right = false;
JoyStick.prototype.up = false;
JoyStick.prototype.down = false;

JoyStick.prototype.__is_up = function ( dx, dy )
{
	if( dy >= 0 )
	{
		return false;
	}
	if( Math.abs(dx) > 2*Math.abs(dy) )
	{
		return false;
	}
	return true;
};

JoyStick.prototype.__is_down = function down( dx, dy )
{
	if( dy <= 0 )
	{
		return false;
	}
	if( Math.abs(dx) > 2*Math.abs(dy) )
	{
		return false;
	}
	return true;	
};

JoyStick.prototype.__is_left = function( dx, dy )
{
	if( dx >= 0 )
	{
		return false;
	}
	if( Math.abs(dy) > 2*Math.abs(dx) )
	{
		return false;
	}
	return true;	
};

JoyStick.prototype.__is_right = function( dx, dy )
{
	if( dx <= 0 )
	{
		return false;
	}
	if( Math.abs(dy) > 2*Math.abs(dx) )
	{
		return false;
	}
	return true;	
};

JoyStick.prototype.__create_fullscreen_div = function(father_element)
{
	
	if ( JOYSTICK_DIV === null )
	{
		__init_joystick_div(father_element);
	}
	this.div = JOYSTICK_DIV;
	this.id = "Joystick";
	///////////////////////////////////////////
	this.base = document.createElement('span');
	this.base.setAttribute("draggable", false);
    var flag = false;
	div_style = this.base.style;
	div_style.width = this.radius * 2 + 'px';
	div_style.height = this.radius * 2 + 'px';
	div_style.position = 'absolute';
	div_style.top = this.y - this.radius + 'px';
	div_style.left = this.x - this.radius + 'px';
	div_style.borderRadius = '50%';
	div_style.borderColor = 'rgba(200,200,200,0.5)';
	div_style.borderWidth = '1px';
	div_style.borderStyle = 'solid';
	div_style.touchAction = 'none';
	div_style.userSelect = 'none';
	div_style.webkitUserSelect = 'none';
	//console.log(div_style);
	this.base.id = 'joystick';
	this.div.appendChild( this.base );
	///////////////////////////////////////////
	this.control = document.createElement('span');
	this.control.setAttribute("draggable", false);
	this.control.id = "joystick_panel"
	div_style = this.control.style;
	div_style.width = this.inner_radius * 2 + 'px';
	div_style.height = this.inner_radius * 2 + 'px';
	div_style.position = 'absolute';
	div_style.top = this.y - this.inner_radius + 'px';
	div_style.left = this.x - this.inner_radius + 'px';
	div_style.borderRadius = '50%';
	div_style.backgroundColor = 'rgba(200,200,200,0.3)';
	div_style.borderWidth = '1px';
	div_style.borderColor = 'rgba(200,200,200,0.8)';
	div_style.borderStyle = 'solid';
	div_style.touchAction = 'none';
	div_style.userSelect = 'none';
	div_style.webkitUserSelect = 'none';
	console.log(div_style);
	this.div.appendChild( this.control );
	///////////////////////////////////////////
	var self = this;
	// the event is binded in all the screen
	// to captures fast movements
    function getDistance(x, y, x1, y1){
        return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
    }
	/*function getPosition(el) {
		var xPosition = 0;
		var yPosition = 0;
		
		while (el) {
			if (el.tagName == "BODY") {
				// deal with browser quirks with body/window/document and page scroll
				var xScrollPos = el.scrollLeft || document.documentElement.scrollLeft;
				var yScrollPos = el.scrollTop || document.documentElement.scrollTop;
				
				xPosition += (el.offsetLeft - xScrollPos + el.clientLeft);
				yPosition += (el.offsetTop - yScrollPos + el.clientTop);
			} else {
				xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
				yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
			}
			
			el = el.offsetParent;
		}
		return {
			x: xPosition,
			y: yPosition
		};
	}*/
	function touch_hander( evt ) /// mouse on the joystick
	{
		// console.log("enter");
        // console.log("enter");
        if(flag == false) return;
		// console.log("entered");
		var touch_obj = evt.changedTouches ? evt.changedTouches[0] : evt;
		// console.log(touch_obj.clientX);
		//if ( self.mouse_support && !(touch_obj.buttons === 1) )
		//{
		//	return;
		//} 
		// var realPosition = getPosition(self.div);
		var realX = window.scrollX + touch_obj.clientX - self.startdx;
		var realY = window.scrollY + touch_obj.clientY - self.startdy;
		// console.log(realX, realY);
        var dis = getDistance(realX, realY, self.x, self.y);
        if(dis < self.radius * 1.25){
            self.control.style.left = realX - self.inner_radius + 'px';
            self.control.style.top = realY - self.inner_radius + 'px';
    
            var dx = realX - self.x;
            var dy = realY - self.y;
            self.up = self.__is_up( dx, dy );
            self.down = self.__is_down( dx, dy );
            self.left = self.__is_left( dx, dy );
            self.right = self.__is_right( dx, dy );
            self.dx = dx;
            self.dy = dy;
        }
        else{
            var targetX = self.x + self.radius * 1.25 / dis * (realX - self.x);
            var targetY = self.y + self.radius * 1.25 / dis * (realY - self.y);
            self.control.style.left = targetX - self.inner_radius + 'px';
            self.control.style.top = targetY - self.inner_radius + 'px';
            //console.log(targetX,targetY,self.x,self.y);
            var dx = targetX - self.x;
            var dy = targetY - self.y;
            self.up = self.__is_up( dx, dy );
            self.down = self.__is_down( dx, dy );
            self.left = self.__is_left( dx, dy );
            self.right = self.__is_right( dx, dy );
            self.dx = dx;
            self.dy = dy;
        }
	}
    function touch_start_hander( evt ) /// mouse on the joystick
	{
		// aconsole.log("enter start");
        flag = true;
		var touch_obj = evt.changedTouches ? evt.changedTouches[0] : evt;
		//var realPosition = getPosition(self.div);
		var realX = window.scrollX + touch_obj.clientX;
		var realY = window.scrollY + touch_obj.clientY;
		if ( self.mouse_support && !(touch_obj.buttons === 1) )
		{
			return;
		} 
		self.startdx = realX - self.x;
		self.startdy = realY - self.y;
		/*
        var dis = getDistance(realX, realY, self.x, self.y);
        if(dis < self.radius * 1.25){
            self.control.style.left = realX - self.inner_radius + 'px';
            self.control.style.top = realY - self.inner_radius + 'px';
    
            var dx = realX - self.x;
            var dy = realY - self.y;
            self.up = self.__is_up( dx, dy );
            self.down = self.__is_down( dx, dy );
            self.left = self.__is_left( dx, dy );
            self.right = self.__is_right( dx, dy );
            self.dx = dx;
            self.dy = dy;
        }
        else{
            var targetX = self.x + self.radius / dis / 1.25 * (realX - self.x);
            var targetY = self.y + self.radius / dis / 1.25 * (realY - self.y);
            self.control.style.left = targetX - self.inner_radius + 'px';
            self.control.style.top = targetY - self.inner_radius + 'px';
            //console.log("target:" + targetX,targetY,self.x,self.y);
            var dx = targetX - self.x;
            var dy = targetY - self.y;
            self.up = self.__is_up( dx, dy );
            self.down = self.__is_down( dx, dy );
            self.left = self.__is_left( dx, dy );
            self.right = self.__is_right( dx, dy );
            self.dx = dx;
            self.dy = dy;
        }*/
	}
	function clear_flags()
	{
        flag = false;
		self.left = false;
		self.right = false;
		self.up = false;
		self.down = false;
        self.dx = 0;
        self.dy = 0;

		self.control.style.top = self.y - self.inner_radius + 'px';
		self.control.style.left = self.x - self.inner_radius + 'px';
	}
	//this.bind( 'touchmove', touch_hander );
    this.bind( 'touchmove', touch_hander )
	this.bind( 'touchstart', touch_start_hander );
	addEventListener( 'touchend', clear_flags );
	if ( this.mouse_support )
	{
		this.bind( 'mousedown', touch_start_hander );
		addEventListener( 'mousemove', touch_hander );
		addEventListener( 'mouseup', clear_flags );
	}
};
JoyStick.prototype.bind = function( evt, func )
{
	this.base.addEventListener( evt, func );
	this.control.addEventListener( evt, func );
};

/*
attributes:
	+ x
	+ y
	+ func
	+ mouse_support
*/
/*
var JoyStickButton = function( attrs )
{
	this.radius = attrs.radius || 50;
	this.x = attrs.x || 0;
	this.y = attrs.y || 0;
	this.text = attrs.text||'';
	this.mouse_support = attrs.mouse_support||false;
	this.father_element = attrs.father_element || null;
	if ( JOYSTICK_DIV === null )
	{
		__init_joystick_div(this.father_element);
	}
	this.base = document.createElement('span');
	this.base.innerHTML = this.text;
	div_style = this.base.style;
	div_style.width = this.radius * 2 + 'px';
	div_style.height = this.radius * 2 + 'px';
	div_style.position = 'absolute';
	div_style.top = this.y - this.radius + 'px';
	div_style.left = this.x - this.radius + 'px';
	div_style.borderRadius = '50%';
	div_style.backgroundColor = 'rgba(255,255,255,0.1)';
	div_style.borderWidth = '1px';
	div_style.borderColor = 'rgba(255,255,255,0.8)';
	div_style.borderStyle = 'solid';
	JOYSTICK_DIV.appendChild( this.base );

	if ( attrs.func )
	{
		if ( this.mouse_support )
		{
			this.bind( 'mousedown', attrs.func );
		}
		this.bind( 'touchstart', attrs.func );
	}

	var self = this;
	function __over()
	{
		div_style.backgroundColor = 'rgba(255,255,255,0.3)';
	}
	function __leave()
	{
		div_style.backgroundColor = 'rgba(255,255,255,0.1)';
	}
	self.bind( 'touchstart', __over );
	self.bind( 'touchend', __leave );
	if ( this.mouse_support )
	{
		self.bind( 'mousedown', __over );
		self.bind( 'mouseup', __leave );
	}
};
JoyStickButton.prototype.bind = function( evt, func )
{
	this.base.addEventListener( evt, func );
};*/