class Car{
    constructor(x,y,width,height,controlType,maxSpeed=3,color="blue"){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false;

        this.useBrain=controlType=="AI";
        //It means that the car actually has already is going to be in use



        if(controlType!="DUMMY"){
            this.sensor=new Sensor(this);
            this.brain=new NeuralNetwork(
                [this.sensor.rayCount,6,4]
                //6 is the hidden layer that is the number of nodes present in network canvas
                //4 is the four neuron one for forward one for backward one for left one for right
            );
        }
        this.controls=new Controls(controlType);


        //Referring the Car Image
        this.img=new Image();
        this.img.src="car.png"

        
        //Creating a canvas of size of car so that color canvas can be overlapped with the car
        this.mask=document.createElement("canvas");
        this.mask.width=width;
        this.mask.height=height;


        //Car move kre to canvas bhi sath mai move kre
        const maskCtx=this.mask.getContext("2d");
        this.img.onload=()=>{
            maskCtx.fillStyle=color;
            maskCtx.rect(0,0,this.width,this.height);
            maskCtx.fill();

            maskCtx.globalCompositeOperation="destination-atop";
            maskCtx.drawImage(this.img,0,0,this.width,this.height);
        }
        // The globalCompositeOperation property sets or returns how a source are drawn over a destination.
        // Source = drawings you are about to draw on the canvas.
        // Destination = drawings that are already drawn on the canvas.
    }

    update(roadBorders,traffic){
        if(!this.damaged){              //if the car is not damaged then it will move, otherwise not
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets=this.sensor.readings.map(
                s=>s==null?0:1-s.offset             //This is done in order to neurons can receive low values if the object is far away and higher values close to 1 if the object is close
            );
            const outputs=NeuralNetwork.feedForward(offsets,this.brain);

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
    }

    #assessDamage(roadBorders,traffic){
         //If car collides with road borders
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        //If car collides with traffic car
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }


    //Structure of Car
    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;          //Whole triangle ka radius nahi uske aadha ka radius chaiye issliye /2, See documentation
        const alpha=Math.atan2(this.width,this.height);          //alpha angle is width/height ,tan theta
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
            //this.y=this.y-2;
            //As said, on computer +y axis is in bottom and -y axis is at top
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        //to flip the left and right turn
        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                //this.x=this.x-2;
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                //this.x=this.x+2;
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }


    //Drawing the car and its different features
    draw(ctx,drawSensor=false){
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }

        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);
        if(!this.damaged){
            ctx.drawImage(this.mask,            //If car is crashed then color will change to white
                -this.width/2,
                -this.height/2,
                this.width,
                this.height);
            ctx.globalCompositeOperation="multiply";
        }
        ctx.drawImage(this.img,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height);
        ctx.restore();

    }
}