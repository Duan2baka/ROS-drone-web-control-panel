var JOYSTICK_DIV = null;

function __init_joystick_div(father_element){
	JOYSTICK_DIV = document.createElement('div');
	if(father_element) {father_element.appendChild( JOYSTICK_DIV );}
	else {document.body.appendChild( JOYSTICK_DIV );}
}
var JoyStick = function( attrs ) {
	this.radius = attrs.radius || 50;
	this.inner_radius = attrs.inner_radius || this.radius / 2;
	this.x = attrs.x || 0;
	this.y = attrs.y || 0;
	this.mouse_support = attrs.mouse_support || true;
	this.father_element = attrs.father_element || null;

	if ( attrs.visible === undefined )
		attrs.visible = true;
	if ( attrs.visible )
		this.__create_fullscreen_div(this.father_element);
};

JoyStick.prototype.left = false;
JoyStick.prototype.right = false;
JoyStick.prototype.up = false;
JoyStick.prototype.down = false;

JoyStick.prototype.__is_up = function ( dx, dy ){
	if( dy >= 0 )
		return false;
	if( Math.abs(dx) > 2*Math.abs(dy) )
		return false;
	return true;
};

JoyStick.prototype.__is_down = function down( dx, dy ){
	if( dy <= 0 )
		return false;
	if( Math.abs(dx) > 2*Math.abs(dy) )
		return false;
	return true;	
};

JoyStick.prototype.__is_left = function( dx, dy ){
	if( dx >= 0 )
		return false;
	if( Math.abs(dy) > 2*Math.abs(dx) )
		return false;
	return true;	
};

JoyStick.prototype.__is_right = function( dx, dy ){
	if( dx <= 0 )
		return false;
	if( Math.abs(dy) > 2*Math.abs(dx) )
		return false;
	return true;	
};

JoyStick.prototype.__create_fullscreen_div = function(father_element){
	
	if ( JOYSTICK_DIV === null ){
		__init_joystick_div(father_element);
	}
	this.div = JOYSTICK_DIV;
	this.id = "Joystick";
	this.base = document.createElement('span');
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
	this.base.id = 'joystick';
	this.div.appendChild( this.base );
	///////////////////////////////////////////
	this.control = document.createElement('span');
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
	this.div.appendChild( this.control );
	var self = this;
    function getDistance(x, y, x1, y1){
        return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
    }
	function touch_hander( evt ){
        if(flag == false) return;
		var touch_obj = evt.changedTouches ? evt.changedTouches[0] : evt;
		var realX = window.scrollX + touch_obj.clientX - self.startdx;
		var realY = window.scrollY + touch_obj.clientY - self.startdy;
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
    function touch_start_hander( evt ){
        flag = true;
		var touch_obj = evt.changedTouches ? evt.changedTouches[0] : evt;
		var realX = window.scrollX + touch_obj.clientX;
		var realY = window.scrollY + touch_obj.clientY;
		self.startdx = realX - self.x;
		self.startdy = realY - self.y;
	}
	function clear_flags(){
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
	this.bind( 'touchend', clear_flags );
	if ( this.mouse_support ){
		this.bind( 'mousedown', touch_start_hander );
		this.bind( 'mousemove', touch_hander );
		this.bind( 'mouseup', clear_flags );
	}
};
JoyStick.prototype.bind = function( evt, func ){
	this.base.addEventListener( evt, func );
	this.control.addEventListener( evt, func );
};