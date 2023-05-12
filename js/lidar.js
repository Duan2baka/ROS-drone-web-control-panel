class Lidar{
    constructor(attrs) {
        this.x = attrs.x || 0;
        this.y = attrs.y || 0;
        this.father_element = attrs.father_element || null;
        this.canvas_id = attrs.canvas_id || "lidarCanvas";
        this.div = null;
        this.width = attrs.width;
        this.height = attrs.height;
        this.flag = false;
        this.scaler = attrs.scaler || 4;
        this.intensity = attrs.intensity || 4;
        this.update_time = attrs.update_time || 0.2;
        this.time_stamp = -1;
        this.lidar_time_stamp_ns = -1;

        this.__create_div(this.father_element);
        this.__init_canvas();
    }

    __create_div( father_element ){
        this.div = document.createElement('div');
        var div_style = this.div.style;
        //div_style.width = this.width + "px";
        //div_style.height = this.height + "px";
        div_style.position = 'absolute';
        div_style.top = this.y - this.height / 2 + "px";
        div_style.left = this.x - this.width / 2 + "px";
        div_style.textAlign = "center";
        div_style.touchAction = 'none';
        father_element.appendChild( this.div );

        this.canvas = document.createElement('canvas');
        // console.log(this.img.style);
        this.canvas.id = this.canvas_id;
        this.div.appendChild( this.canvas );
    }

    __init_canvas(){
        this.imageData = new ImageData(this.width, this.height);
        for (var i = 0; i < width * height; i++) {
            this.imageData.data[i * 4] = 128; // Red channel
            this.imageData.data[i * 4 + 1] = 128; // Green channel
            this.imageData.data[i * 4 + 2] = 128; // Blue channel
            this.imageData.data[i * 4 + 3] = 255; // Alpha channel
        }
        // console.log(canvas);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        var context = this.canvas.getContext("2d");
        this.context.putImageData(this.imageData, 0, 0);
        
        var centerX = this.canvas.width / 2;
        var centerY = this.canvas.height / 2;
        var radius = this.size * 0.4;

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#003300';
        context.stroke();

        var triangleSize = this.size * 30 / 500/ 4 * this.scaler;

        context.beginPath();
        context.moveTo(centerX, centerY - triangleSize/2);
        context.lineTo(centerX - triangleSize/2, centerY + triangleSize/2);
        context.lineTo(centerX + triangleSize/2, centerY + triangleSize/2);
        context.closePath();
        context.fillStyle = 'blue';
        context.fill();
    }
    //<div id="lidarDiv" style="text-align: center;"><canvas id="lidarCanvas"></canvas></div>
}