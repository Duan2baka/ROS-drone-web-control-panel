class Button {
    constructor(attrs) {
        this.x = attrs.x || 0;
        this.y = attrs.y || 0;
        this.father_element = attrs.father_element || null;
        this.src = attrs.src || "./images/clockwise.png";
        this.id = attrs.id || "button";
        this.div = null;
        this.size = attrs.size;
        this.onClick = attrs.onClick;
        this.flag = false;
        this.base = null;
        this.img = null;

        if (attrs.visible === undefined) {
            attrs.visible = true;
        }

        if (attrs.visible) {
            this.__create_div(this.father_element);
        }
        this.__init_listener();
        this.__init_parameter();
    }

    __init_div( father_element ){
        this.div = document.createElement('div');
        if(father_element) {father_element.appendChild( this.div );}
        else {document.body.appendChild( this.div );}
    }

    __create_div( father_element ){
        if ( this.div === null ){
            this.__init_div(father_element);
        }
        this.base = document.createElement('span');
        var div_style = this.base.style;
        div_style.width = this.size + "px";
        div_style.height = this.size + "px";
        div_style.position = 'absolute';
        div_style.top = this.y - this.size / 2 + "px";
        div_style.left = this.x - this.size / 2 + "px";
        div_style.borderRadius = "50%";
        div_style.touchAction = 'none';
        div_style.backgroundColor = "rgba(200, 200, 200, 0.7)";
        this.div.appendChild( this.base );

        this.img = document.createElement('img');
        this.img.src = this.src;
        var div_style = this.img.style;
        div_style.width = this.size * 2 / 3 + "px";
        div_style.height = this.size * 2 / 3  + "px";
        div_style.position = 'absolute';
        div_style.top = this.y - this.size / 3 + "px";
        div_style.left = this.x - this.size / 3 + "px";
        div_style.touchAction = 'none';
        // console.log(this.img.style);
        this.img.id = this.id;
        this.div.appendChild( this.img );
    }

    __init_parameter(){
        this.flag = false;
    }

    update_position(x, y){
        this.x = x;
        this.y = y;
        var div_style = this.base.style;
        div_style.top = this.y - this.size / 2 + "px";
        div_style.left = this.x - this.size / 2 + "px";
        var div_style = this.img.style;
        div_style.top = this.y - this.size / 3 + "px";
        div_style.left = this.x - this.size / 3 + "px";
    }

    setHidden(flag){
        this.img.hidden = flag;
        this.base.hidden = flag;
    }
    

    __init_listener(){
        var self = this;
        /*const TIMEOUT_MS = 500;

        function Clicking() {
            console.log("pressing");
            self.onClick();
            if (self.flag) {
                setTimeout(Clicking, TIMEOUT_MS);
            }
        }*/

        function clear_flags(){
            self.flag = false;
            var div_style = self.base.style;
            div_style.backgroundColor = "rgba(200, 200, 200, 0.7)";
        }
    
        function start_click(){
            self.flag = true;
            var div_style = self.base.style;
            div_style.backgroundColor = "rgba(255, 255, 255, 0.7)";
            // Clicking();
        }
        this.bind('mousedown', start_click );
        this.bind('touchstart', start_click );
        addEventListener( 'touchend', clear_flags );
        addEventListener( 'mouseup', clear_flags );
    }

    bind = function( evt, func ){
        this.base.addEventListener( evt, func );
        this.img.addEventListener( evt, func );
    }

}