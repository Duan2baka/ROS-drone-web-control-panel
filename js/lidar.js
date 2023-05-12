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
        div_style.top = this.y + "px";
        div_style.left = this.x + "px";
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
        for (var i = 0; i < this.width * this.height; i++) {
            this.imageData.data[i * 4] = 128; // Red channel
            this.imageData.data[i * 4 + 1] = 128; // Green channel
            this.imageData.data[i * 4 + 2] = 128; // Blue channel
            this.imageData.data[i * 4 + 3] = 0; // Alpha channel
        }
        // console.log(canvas);
        // console.log(this.context);
        // console.log(this.canvas);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        var context = this.canvas.getContext("2d");
        context.putImageData(this.imageData, 0, 0);
        
        var centerX = this.canvas.width / 2;
        var centerY = this.canvas.height / 2;
        var radius = this.width * 0.4;

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'rgba(100, 100, 100, 0.7)';
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = '#000000';
        context.stroke();

        var triangleSize = this.width * 30 / 500/ 4 * this.scaler;

        context.beginPath();
        context.moveTo(centerX, centerY - triangleSize/2);
        context.lineTo(centerX - triangleSize/2, centerY + triangleSize/2);
        context.lineTo(centerX + triangleSize/2, centerY + triangleSize/2);
        context.closePath();
        context.fillStyle = 'blue';
        context.fill();
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

    update_canvas(message, premsg, lidarScaler, lidar_intensity){
        function drawDot(x, y, ctx, radius = 3) {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
        var canvas = this.canvas;
        if(canvas.hidden) return;
        // console.log(canvas);
        canvas.width = this.width;
        canvas.height = this.height;
        var context = canvas.getContext("2d");
        context.putImageData(this.imageData, 0, 0);
        
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var radius = this.width * 0.4;

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'rgba(100, 100, 100, 0.7)';
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = '#000000';
        context.stroke();

        var triangleSize = this.width * 30 / 500 / 4 * lidarScaler;

        context.beginPath();
        context.moveTo(centerX, centerY - triangleSize/2);
        context.lineTo(centerX - triangleSize/2, centerY + triangleSize/2);
        context.lineTo(centerX + triangleSize/2, centerY + triangleSize/2);
        context.closePath();
        context.fillStyle = 'blue';
        context.fill();

        // deal with the message
        var increment = message.angle_increment;
        var angle_max = message.angle_max;
        var angle_min = message.angle_min;
        var range_max = message.range_max;
        var range_min = message.range_min;
        var st = message.angle_min;

        for(var i = 0; i < message.ranges.length; i += lidar_intensity){
            let tmpFlag = true;
            //console.log(premsg.length);
            for(var j = 0; j < premsg.length; j ++)
                if((!premsg[j].ranges[i])) tmpFlag = false;
            if(tmpFlag && message.ranges[i]){
                if(message.ranges[i] <= 0.5 / lidarScaler * range_max){
                    drawDot(centerX - (Math.cos(st + 0.5 * Math.PI) * message.ranges[i] / range_max) * (this.width * 0.8 - 5) * lidarScaler,
                    centerY + (Math.sin(st + 0.5 * Math.PI) * message.ranges[i] / range_max) * (this.width * 0.8 - 5) * lidarScaler, context,
                    Math.min(Math.max(3 * this.width / 300, 1), 3));
                }
                //console.log(typeof (0.4*range_max));
            }
            st = st + lidar_intensity *increment;
        }
    }
    //<div id="lidarDiv" style="text-align: center;"><canvas id="lidarCanvas"></canvas></div>
}