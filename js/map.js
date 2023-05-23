class MapComponent{
    constructor(attrs) {
        this.x = attrs.x || 0;
        this.y = attrs.y || 0;
        this.father_element = attrs.father_element || null;
        this.canvas_id = attrs.canvas_id || "mapCanvas";
        this.div = null;
        this.width = attrs.width;
        this.height = attrs.height;
        this.flag = false;
        this.scaler = attrs.scaler || 4;
        this.message = -1;
        this.pos_x = -1;
        this.pos_y = -1;
        this.mouseDown = false;
        this.startX = 0;
        this.startY = 0;
        this.anchor_x = 0;
        this.anchor_y = 0;
        this.scale = 1;
        // this.update_time = attrs.update_time || 0.2;
        // this.time_stamp = -1;
        // this.time_stamp_ns = -1;

        this.__create_div(this.father_element);
        this.__init_canvas();
    }

    __create_div( father_element ){
        this.div = document.createElement('div');
        var div_style = this.div.style;
        div_style.position = 'absolute';
        div_style.top = this.y + "px";
        div_style.left = this.x + "px";
        // console.log(this.y);
        div_style.textAlign = "center";
        div_style.touchAction = 'none';
        div_style.userSelect = 'none';
        father_element.appendChild( this.div );

        this.canvas = document.createElement('canvas');
        // console.log(this.img.style);
        this.canvas.id = this.canvas_id;
        this.div.appendChild( this.canvas );
    }

    __init_canvas(){
        var self = this;
        this.canvas.addEventListener('mousedown', function(e) {
            self.mouseDown = true;
            self.startX = e.clientX - self.canvas.offsetLeft - self.div.offsetLeft + window.scrollX;
            self.startY = e.clientY - self.canvas.offsetTop - self.div.offsetTop + window.scrollY;
        });

        this.canvas.addEventListener('mousemove', function(e) {
            if (self.mouseDown) {
                var mouseX = e.clientX - self.canvas.offsetLeft - self.div.offsetLeft + window.scrollX;
                var mouseY = e.clientY - self.canvas.offsetTop - self.div.offsetTop + window.scrollY;
            }
        });

        this.canvas.addEventListener('mouseup', function(e) {
            self.mouseDown = false;
            var mouseX = e.clientX - self.canvas.offsetLeft - self.div.offsetLeft + window.scrollX;
            var mouseY = e.clientY - self.canvas.offsetTop - self.div.offsetTop + window.scrollY;

            if(map_resolution == -1) return;
            var real_x = self.startX * map_resolution + map_origin_x; 
            var real_y = self.startY * map_resolution + map_origin_y;

            var orientation = Math.atan(-(mouseY - self.startY) / (mouseX - self.startX)) / Math.PI;
            if(mouseX < self.startX && mouseY <= self.startY) orientation += 1;
            else if(mouseX < self.startX && mouseY >= self.startY) orientation -= 1; 
            orientation *= -1;
            // console.log(orientation);
             console.log(self.startX, self.startY);
            // set_goal(real_x, real_y, orientation);
        });
        this.canvas.addEventListener('mousewheel', function(e){
            if(e.wheelDelta > 0){

            }
            console.log(e.wheelDelta);
        });
    }
    
    setHidden(flag){
        this.canvas.hidden = flag;
    }
    
    update_position(x, y){
        // console.log(123);
        this.y = y;
        this.x = x;
        this.div.style.top = this.y + "px";
        this.div.style.left = this.x + "px";
    }

    updateMap(mapMessage){
        if(mapMessage === -1)
            if(this.message == -1) return;
            else mapMessage = this.message;
        else this.message = mapMessage;
        var width = mapMessage.info.width, height = mapMessage.info.height;
        var imageData = new ImageData(width, height);
        function getIndex(x, y, width){
            return x + y * width;
        }
        function getPosition(index, width){
            return index % width, parseInt(index / width);
        }
        for (var i = 0; i < width * height; i++) {
            var tmp_x, tmp_y;
            tmp_x, tmp_y = getPosition(i, width);
            
            /*
            if(mapMessage.data[i] == -1){
                imageData.data[i * 4] = 128;
                imageData.data[i * 4 + 1] = 128;
                imageData.data[i * 4 + 2] = 128;
                imageData.data[i * 4 + 3] = 255;
            }
            else{
                imageData.data[i * 4] = 255;
                imageData.data[i * 4 + 1] = (100 - mapMessage.data[i]) / 100 * 255;
                imageData.data[i * 4 + 2] = (100 - mapMessage.data[i]) / 100 * 255;
                imageData.data[i * 4 + 3] = 255;
            }*/

        }
        if(this.canvas.hidden) return;
        this.canvas.width = width;
        this.canvas.height = height;
        var context = this.canvas.getContext("2d");
        context.putImageData(imageData, 0, 0);
        if(this.pos_x != -1){
            context.fillStyle = 'green';
            context.beginPath();
            context.arc(this.pos_x, this.pos_y, 2, 0, 2 * Math.PI);
            context.fill();
        }
    }
    //<div id="lidarDiv" style="text-align: center;"><canvas id="lidarCanvas"></canvas></div>
}