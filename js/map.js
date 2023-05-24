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
        this.map_width = 0;
        this.map_height = 0;
        this.set_navigation = false;
        this.canvas_stamp = -1;
        this.time_gap = 0.01;
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
            //self.startX = e.clientX - self.canvas.offsetLeft - self.div.offsetLeft + window.scrollX;
            self.startX = e.offsetX;
            self.startY = e.offsetY;
            self.start_anchor_x = self.anchor_x;
            self.start_anchor_y = self.anchor_y;
        });

        this.canvas.addEventListener('mousemove', function(e) {
            if (self.mouseDown) {
                var mouseX = e.offsetX;
                var mouseY = e.offsetY;
                if(self.set_navigation){


                }
                else{
                    console.log(213);
                    self.anchor_x = self.start_anchor_x + (mouseX - self.startX);
                    self.anchor_y = self.start_anchor_y + (mouseY - self.startY);
                    self.updateMap(-1);
                }
            }
        });

        this.canvas.addEventListener('mouseup', function(e) {
            self.mouseDown = false;
            var mouseX = e.offsetX;
            var mouseY = e.offsetY;
            if(self.set_navigation){
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
            }
        });
        this.canvas.addEventListener('mousewheel', function(e){
            var previous_scale = self.scale;
            if(e.wheelDelta > 0){
                self.scale *= 1.1;
                if(self.scale < 7){
                    self.anchor_x -= (e.offsetX - self.map_width / 2) / 11;
                    self.anchor_y -= (e.offsetY - self.map_height / 2) / 11;
                }
            }
            if(e.wheelDelta < 0)
                self.scale /= 1.1;
            self.updateMap(-1);
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
    
    getMapPosition(x, y, width, height, self){ // canvas to map
        var relative_x = x - width / 2;
        var relative_y = y - height / 2;

        var target_x = parseInt(relative_x / self.scale + width / 2 - self.anchor_x);
        var target_y = parseInt(relative_y / self.scale + height / 2 - self.anchor_y);

        return [target_x, target_y];
    }
    getCanvasPosition(x, y, width, height, self){ // map to canvas
        return [(x - width / 2 + self.anchor_x) * self.scale + width / 2, (y - height / 2 + self.anchor_y) * self.scale + height / 2];
    }

    updateMap(mapMessage){
        let T = Date.parse(new Date()) / 1000;
        if(T - this.canvas_stamp < this.time_gap){
            return;
        }
        this.canvas_stamp = T;
        if(mapMessage === -1)
            if(this.message == -1) return;
            else mapMessage = this.message;
        else this.message = mapMessage;
        var width = mapMessage.info.width, height = mapMessage.info.height;
        this.map_width = width;
        this.map_height = height;
        var imageData = new ImageData(width, height);
        function getIndex(x, y, width){
            return x + y * width;
        }
        function getPosition(index, width){
            return [index % width, parseInt(index / width)];
        }
        for (var i = 0; i < width * height; i++) {
            var tmp_x, tmp_y;
            tmp_x = getPosition(i, width)[0];
            tmp_y = getPosition(i, width)[1];

            var target_x = this.getMapPosition(tmp_x, tmp_y, width, height, this)[0];
            var target_y = this.getMapPosition(tmp_x, tmp_y, width, height, this)[1];

            let index = getIndex(target_x, target_y, width);

            if((target_x >= width || target_x < 0 || target_y >= height || target_y < 0) || mapMessage.data[index] == -1){
                imageData.data[i * 4] = 128;
                imageData.data[i * 4 + 1] = 128;
                imageData.data[i * 4 + 2] = 128;
                imageData.data[i * 4 + 3] = 255;
            }
            else{
                imageData.data[i * 4] = 255;
                imageData.data[i * 4 + 1] = (100 - mapMessage.data[index]) / 100 * 255;
                imageData.data[i * 4 + 2] = (100 - mapMessage.data[index]) / 100 * 255;
                imageData.data[i * 4 + 3] = 255;
            }


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
            var target_x = this.getCanvasPosition(this.pos_x, this.pos_y, width, height, this)[0];
            var target_y = this.getCanvasPosition(this.pos_x, this.pos_y, width, height, this)[1];
            if(!(target_x >= width || target_x < 0 || target_y >= height || target_y < 0)){
                context.fillStyle = 'green';
                context.beginPath();
                context.arc(target_x, target_y, 2 * this.scale, 0, 2 * Math.PI);
                context.fill();
            }
        }
    }
    //<div id="lidarDiv" style="text-align: center;"><canvas id="lidarCanvas"></canvas></div>
}