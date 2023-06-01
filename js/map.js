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
        this.start_scale = 0;
        this.anchor_dx = 0;
        this.anchor_dy = 0;
        this.scale = 1;
        this.map_width = 0;
        this.map_height = 0;
        this.set_navigation = false;
        this.add_goal = false;
        this.canvas_stamp = -1;
        this.time_gap = 0;
        this.path_point = [];
        
        // this.update_time = attrs.update_time || 0.2;
        // this.time_stamp = -1;
        // this.time_stamp_ns = -1;

        this.__create_div(this.father_element);
        this.__init_canvas();

        ///console.log(this.canvas.getContext("2d"));
    }

    __create_div( father_element ){
        this.div = document.createElement('div');
        var div_style = this.div.style;
        //div_style.position = 'absolute';
        //div_style.top = this.y + "px";
        //div_style.left = this.x + "px";
        div_style.textAlign = "center";
        div_style.touchAction = 'none';
        div_style.userSelect = 'none';
        father_element.appendChild( this.div );

        this.canvas = document.createElement('canvas');
        this.canvas.id = this.canvas_id;
        this.div.appendChild( this.canvas );
    }

    __init_canvas(){
        var self = this;
        let isPointerdown = false,
        pointers = [],
        lastPointermove = { x: 0, y: 0 },
        lastPoint1 = { x: 0, y: 0 },
        lastPoint2 = { x: 0, y: 0 };
        this.canvas.addEventListener('mousedown', function(e) {
            self.mouseDown = true;
            //self.startX = e.clientX - self.canvas.offsetLeft - self.div.offsetLeft + window.scrollX;
            self.startX = e.offsetX;
            self.startY = e.offsetY;
            self.start_x_map = self.getMapPosition(e.offsetX, e.offsetY, self.map_width, self.map_height, self)[0];
            self.start_y_map = self.getMapPosition(e.offsetX, e.offsetY, self.map_width, self.map_height, self)[1];
            self.start_anchor_dx = self.anchor_dx;
            self.start_anchor_dy = self.anchor_dy;
        });

        this.canvas.addEventListener('mousemove', function(e) {
            if (self.mouseDown) {
                let mouseX = e.offsetX;
                let mouseY = e.offsetY;
                if(self.set_navigation){
                    self.updateMap(-1);
                    self.drawArrow(self.start_x_map, self.start_y_map,
                        self.getMapPosition(e.offsetX, e.offsetY, self.map_width, self.map_height, self)[0],
                        self.getMapPosition(e.offsetX, e.offsetY, self.map_width, self.map_height, self)[1]);
                }
                else{
                    self.anchor_dx = self.start_anchor_dx + (mouseX - self.startX) / self.scale;
                    self.anchor_dy = self.start_anchor_dy + (mouseY - self.startY) / self.scale;
                    self.updateMap(-1);
                }
            }
            e.stopPropagation();
            e.preventDefault();
        });
        this.canvas.addEventListener('mouseup', function(e) {
            self.mouseDown = false;
            let mouseX = self.getMapPosition(e.offsetX, e.offsetY, self.map_width, self.map_height, self)[0];
            let mouseY = self.getMapPosition(e.offsetX, e.offsetY, self.map_width, self.map_height, self)[1];
            if(self.set_navigation){
                if(map_resolution == -1) return;
                let real_x = self.start_x_map * map_resolution + map_origin_x;
                let real_y = self.start_y_map * map_resolution + map_origin_y;
    
                let orientation = Math.atan(-(mouseY - self.start_y_map) / (mouseX - self.start_x_map)) / Math.PI;
                if(mouseX < self.start_x_map && mouseY <= self.start_y_map) orientation += 1;
                else if(mouseX < self.start_x_map && mouseY >= self.start_y_map) orientation -= 1;
                orientation *= -1;
                self.updateMap(-1);
                self.set_navigation = false;
                document.getElementById("cancel").classList.add("disabled");
                if(self.add_goal){
                    self.add_goal = false;
                    let goal = prompt("Goal name", "Location " + (self.path_point.length + 1));
                    if (goal == null || goal == "") {
                        return;
                    } else {
                        self.path_point.push([real_x, real_y, orientation, goal, self.start_x_map, self.start_y_map]);
                        updateGoal(self.path_point);
                    }
                }
                else set_goal(real_x, real_y, orientation);
                self.updateMap(-1);
            }
        });
        this.canvas.addEventListener('mousewheel', function(e){
            if(e.wheelDelta > 0){
                self.scale *= 1.1;
                if(self.scale < 7){
                    self.anchor_dx -= (e.offsetX - self.map_width / 2) / 11;
                    self.anchor_dy -= (e.offsetY - self.map_height / 2) / 11;
                }
            }
            if(e.wheelDelta < 0)
                self.scale /= 1.1;
            self.updateMap(-1);
            e.stopPropagation();
            e.preventDefault();
        });

        this.canvas.addEventListener('pointerdown', function (e) {
            if(e.pointerType === 'mouse') return;
            pointers.push(e);
            if (pointers.length === 1) {
                isPointerdown = true;
                lastPointermove = { x: pointers[0].offsetX, y: pointers[0].offsetY };
                self.start_x_map = self.getMapPosition(e.offsetX, e.offsetY, self.map_width, self.map_height, self)[0];
                self.start_y_map = self.getMapPosition(e.offsetX, e.offsetY, self.map_width, self.map_height, self)[1];
            } else if (pointers.length === 2) {
                self.start_scale = self.scale;
                lastPoint2 = { x: pointers[1].offsetX, y: pointers[1].offsetY };
                self.set_navigation = false;
                self.set_goal = false;
            }
            lastPoint1 = { x: pointers[0].offsetX, y: pointers[0].offsetY };
        });
        this.canvas.addEventListener('pointermove', function (e) {
            if(e.pointerType === 'mouse') return;
            if (isPointerdown) {
                handlePointers(e, 'update');
                const current1 = { x: pointers[0].offsetX, y: pointers[0].offsetY };
                if (pointers.length === 1) {
                    if(self.set_navigation){
                        self.updateMap(-1);
                        self.drawArrow(self.start_x_map, self.start_y_map,
                            self.getMapPosition(current1.x, current1.y, self.map_width, self.map_height, self)[0],
                            self.getMapPosition(current1.x, current1.y, self.map_width, self.map_height, self)[1]);
                    }
                    else{
                        self.anchor_dx += (current1.x - lastPointermove.x) / self.scale;
                        self.anchor_dy += (current1.y - lastPointermove.y) / self.scale;
                        lastPointermove = { x: current1.x, y: current1.y };
                        self.updateMap(-1);
                    }
                } else if (pointers.length === 2) {
                    const current2 = { x: pointers[1].offsetX, y: pointers[1].offsetY };
                    let ratio = getDistance(current1, current2) / getDistance(lastPoint1, lastPoint2);
                    self.scale = self.start_scale * ratio;
                    self.updateMap(-1);
                }
            }
            e.preventDefault();
        });
        
        this.canvas.addEventListener('pointerup', function (e) {
            if(e.pointerType === 'mouse') return;
            if (isPointerdown) {
                handlePointers(e, 'delete');
                if (pointers.length === 0) {
                    isPointerdown = false;

                    let mouseX = self.getMapPosition(e.offsetX, e.offsetY, self.map_width, self.map_height, self)[0];
                    let mouseY = self.getMapPosition(e.offsetX, e.offsetY, self.map_width, self.map_height, self)[1];
                    if(self.set_navigation){
                        if(map_resolution == -1) return;
                        let real_x = self.start_x_map * map_resolution + map_origin_x; 
                        let real_y = self.start_y_map * map_resolution + map_origin_y;
            
                        let orientation = Math.atan(-(mouseY - self.start_y_map) / (mouseX - self.start_x_map)) / Math.PI;
                        if(mouseX < self.start_x_map && mouseY <= self.start_y_map) orientation += 1;
                        else if(mouseX < self.start_x_map && mouseY >= self.start_y_map) orientation -= 1; 
                        orientation *= -1;
                        self.updateMap(-1);
                        self.set_navigation = false;
                        document.getElementById("cancel").classList.add(disabled);
                        if(self.add_goal){
                            self.add_goal = false;
                            let goal = prompt("Goal name", "Location " + (self.path_point.length + 1));
                            if (goal == null || goal == "") {
                                return;
                            } else {
                                self.path_point.push([real_x, real_y, orientation, goal, self.start_x_map, self.start_y_map]);
                                updateGoal(self.path_point);
                            }
                        }
                        else set_goal(real_x, real_y, orientation);
                        self.updateMap(-1);
                    }
                } else if (pointers.length === 1) {
                    lastPointermove = { x: pointers[0].offsetX, y: pointers[0].offsetY };
                }
            }
        });
        
        this.canvas.addEventListener('pointercancel', function (e) {
            if(e.pointerType === 'mouse') return;
            if (isPointerdown) {
                isPointerdown = false;
                pointers.length = 0;
            }
        });
        
        /**
         * @param {PointerEvent} e
         * @param {string} type
         */
        function handlePointers(e, type) {
            for (let i = 0; i < pointers.length; i++) {
                if (pointers[i].pointerId === e.pointerId) {
                    if (type === 'update') {
                        pointers[i] = e;
                    } else if (type === 'delete') {
                        pointers.splice(i, 1);
                    }
                }
            }
        }
        function getDistance(a, b) {
            const x = a.x - b.x;
            const y = a.y - b.y;
            return Math.hypot(x, y);
        }
    }
    
    setHidden(flag){
        this.div.hidden = flag;
        this.canvas.hidden = flag;
    }
    
    update_position(x, y){
        this.y = y;
        this.x = x;
        this.div.style.top = this.y + "px";
        this.div.style.left = this.x + "px";
    }
    
    getMapPosition(x, y, width, height, self){ // canvas to map
        let relative_x = x - width / 2;
        let relative_y = y - height / 2;

        let target_x = parseInt(relative_x / self.scale + width / 2 - self.anchor_dx);
        let target_y = parseInt(relative_y / self.scale + height / 2 - self.anchor_dy);

        return [target_x, target_y];
    }
    getCanvasPosition(x, y, width, height, self){ // map to canvas
        return [(x - width / 2 + self.anchor_dx) * self.scale + width / 2, (y - height / 2 + self.anchor_dy) * self.scale + height / 2];
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
        let width = mapMessage.info.width, height = mapMessage.info.height;
        this.map_width = width;
        this.map_height = height;
        let imageData = new ImageData(width, height);
        function getIndex(x, y, width){
            return x + y * width;
        }
        function getPosition(index, width){
            return [index % width, parseInt(index / width)];
        }
        for (let i = 0; i < width * height; i++) {
            let tmp_x, tmp_y;
            tmp_x = getPosition(i, width)[0];
            tmp_y = getPosition(i, width)[1];

            let target_x = this.getMapPosition(tmp_x, tmp_y, width, height, this)[0];
            let target_y = this.getMapPosition(tmp_x, tmp_y, width, height, this)[1];

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
        }
        if(this.canvas.hidden) return;
        this.canvas.width = width;
        this.canvas.height = height;
        let context = this.canvas.getContext("2d");

        context.putImageData(imageData, 0, 0);
        this.path_point.forEach(item =>{
            let target_x = this.getCanvasPosition(item[4], item[5], width, height, this)[0];
            let target_y = this.getCanvasPosition(item[4], item[5], width, height, this)[1];
            if(!(target_x >= width || target_x < 0 || target_y >= height || target_y < 0)){
                context.fillStyle = 'black';
                context.beginPath();
                context.arc(target_x, target_y, 2 * this.scale, 0, 2 * Math.PI);
                context.fill();
            }
        });
        if(this.pos_x != -1){
            let target_x = this.getCanvasPosition(this.pos_x, this.pos_y, width, height, this)[0];
            let target_y = this.getCanvasPosition(this.pos_x, this.pos_y, width, height, this)[1];
            if(!(target_x >= width || target_x < 0 || target_y >= height || target_y < 0)){
                context.fillStyle = 'green';
                context.beginPath();
                context.arc(target_x, target_y, 2 * this.scale, 0, 2 * Math.PI);
                context.fill();
            }
        }
    }

    drawArrow(start_x_map, start_y_map, end_x_map, end_y_map){
        let start_x = this.getCanvasPosition(start_x_map, start_y_map, this.map_width, this.map_height, this)[0];
        let start_y = this.getCanvasPosition(start_x_map, start_y_map, this.map_width, this.map_height, this)[1];
        let end_x = this.getCanvasPosition(end_x_map, end_y_map, this.map_width, this.map_height, this)[0];
        let end_y = this.getCanvasPosition(end_x_map, end_y_map, this.map_width, this.map_height, this)[1];
        
        let context = this.canvas.getContext("2d");
        let angle = Math.atan2(end_y - start_y, end_x - start_x);
        let arrowLength = 10;
        context.strokeStyle = context.fillStyle = 'black';
      
        context.beginPath();
        context.moveTo(start_x, start_y);
        context.lineTo(end_x, end_y);
        context.stroke();
      
        context.beginPath();
        context.moveTo(end_x, end_y);
        context.lineTo(end_x - arrowLength * Math.cos(angle - Math.PI / 6), end_y - arrowLength * Math.sin(angle - Math.PI / 6));
        context.lineTo(end_x - arrowLength * Math.cos(angle + Math.PI / 6), end_y - arrowLength * Math.sin(angle + Math.PI / 6));
        context.lineTo(end_x, end_y);
        context.fill();
    }
}