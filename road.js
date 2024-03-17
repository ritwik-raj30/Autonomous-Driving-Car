class Road{
    constructor(x,width,laneCount=3){
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;

        this.left=x-width/2;
        this.right=x+width/2;

        const infinity=1000000;
        //Same y axis wala concept, computer ka upar ka axis -ve hota hai aur niche ka +ve

        this.top=-infinity;
        this.bottom=infinity;


        //For Border collission
        const topLeft={x:this.left,y:this.top};
        const topRight={x:this.right,y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const bottomRight={x:this.right,y:this.bottom};
        this.borders=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
    }


    //Positon the car between the two lanes, but not on the lane line
    getLaneCenter(laneIndex){
        const laneWidth=this.width/this.laneCount;
        return this.left+laneWidth/2+
            Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }

    //Lane Indexing
    //Most left road = 0;
    //Most right road= n-1;


    //Drawing the lanes and borders
    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

         //Linear Interpolation:- It is a mathematical method  for estimating a point by assuming it lies on the line joining the nearest points to the left and right
        for(let i=1;i<=this.laneCount-1;i++){
            const x=lerp(
                this.left,
                this.right,
                i/this.laneCount
            );
            //Adding Dashes to the Road
            ctx.setLineDash([20,20]);  // [20,20] means the first argument will decide the size of dashes and the second argument will decide the spaces with adjacent dashes
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        });
    }
}