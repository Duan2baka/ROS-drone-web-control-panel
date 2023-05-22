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
        for (var i = 0; i < width * height; i++) {
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
            }
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