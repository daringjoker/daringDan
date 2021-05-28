class Display{
    constructor(canvasId="mycanvas"){

        this.canvas=document.getElementById(canvasId);
        this.ctx=this.canvas.getContext("2d");
        // console.log(this.canvas);

        this.minPadding=16;

        //create a buffer for sharp refresh

        this.buffer=document.createElement("canvas").getContext("2d");

        //making sure that the canvas reacts well to the window resize and also becomes more responsive
        window.addEventListener("resize",this.resize.bind(this));
    }

    setBufferParameter(width,height)
    {
        this.buffer.canvas.width=width;
        this.buffer.canvas.height=height;
    }

    resize(){
        let width=document.documentElement.clientWidth-2*this.minPadding;
        let height=document.documentElement.clientHeight-2*this.minPadding;
        let aspectRatio=this.buffer.canvas.height/this.buffer.canvas.width;
        if(height/width>aspectRatio){
            //max width Situation
            this.ctx.canvas.width=width;
            this.ctx.canvas.height=width*aspectRatio;
        }
        else{
            //max height situation
            this.ctx.canvas.height=height;
            this.ctx.canvas.width=height/aspectRatio;
        }
        // console.log(this.ctx.canvas.height/this.ctx.canvas.width,aspectRatio);
        this.ctx.imageSmoothingEnabled=false;
        this.render();
    }

    drawRect(x,y,width,height,color,strokeColor="#fff",stroke=0,fill=true){
        this.buffer.beginPath();
        this.buffer.rect(x,y,width,height);
        if(fill){
            this.buffer.fillStyle=color;
            this.buffer.fill();
        }
        if(stroke>0){
            this.buffer.lineWidth=stroke;
            this.buffer.strokeStyle=strokeColor;
            this.buffer.stroke();
        }
    }

    drawCircle(x,y,radius,color,strokeColor="#fff",stroke=0,fill=true){
        this.buffer.beginPath();
        this.buffer.arc(x,y,radius,0,2*Math.PI);
        if(fill){
            this.buffer.fillStyle=color;
            this.buffer.fill();
        }
        if(stroke>0){
            this.buffer.lineWidth=stroke;
            this.buffer.strokeStyle=strokeColor;
            this.buffer.stroke();
        }
    }

    drawSprite(spriteSheet,sourceX,sourceY,sourceWidth,sourceHeight,targetX,targetY,targetWidth,targetHeight){
        try {
            this.buffer.drawImage(
                spriteSheet,
                sourceX,sourceY,sourceWidth,sourceHeight,
                targetX,targetY,targetWidth,targetHeight
            ); 
        } catch (error) {
            console.log(spriteSheet)
        }
       

    }

    drawSpriteFrame(gameObject,spriteFrame){
        let spriteSheet=spriteFrame.sheet;

        let sourceX=Math.round(spriteFrame.x);
        let sourceY=Math.round(spriteFrame.y);
        let sourceWidth=Math.round(spriteFrame.width);
        let sourceHeight=Math.round(spriteFrame.height);

        let targetX=Math.round(gameObject.screenX-spriteFrame.width/2);
        let targetY=Math.round(gameObject.screenY-spriteFrame.height/2);
        let targetWidth=Math.round(spriteFrame.width);
        let targetHeight=Math.round(spriteFrame.height);
        if(spriteFrame.flip){
            this.buffer.save();
            this.buffer.translate(targetX+targetWidth/2,targetY+targetHeight/2);
            this.buffer.scale(-1, 1);
            this.buffer.translate(-targetX-targetWidth/2,-targetY-targetHeight/2);
        }
        this.drawSprite(spriteSheet,sourceX,sourceY,sourceWidth,sourceHeight,targetX,targetY,targetWidth,targetHeight);       
        if(spriteFrame.flip){
            this.buffer.restore();
        }
    }
    drawText(text,x,y,font,size=30,fillColor="#000",strokeColor="#000",strokeWeight=0,align="left")
    {
        this.buffer.fillStyle=fillColor;
        this.buffer.font=`${size}px ${font}`;
        this.buffer.textAlign=align;
        this.buffer.strokeStyle=strokeColor;
        this.buffer.lineWidth=strokeWeight;
        if(x<=1)x=Math.round(x*this.buffer.canvas.width);
        if(y<=1)y=Math.round(y*this.buffer.canvas.height);
        // console.log(x,y)
        this.buffer.fillText(text,x,y);
        if(strokeWeight>0)
        this.buffer.strokeText(text,x,y);        
    }
    clear(){
        this.buffer.clearRect(0,0,this.buffer.canvas.width,this.buffer.canvas.height);
    }

    fillBackground(color="#000"){
        this.drawRect(0,0,this.buffer.canvas.width, this.buffer.canvas.height,color);
    }

    render(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.drawImage(this.buffer.canvas,
             0, 0, this.buffer.canvas.width, this.buffer.canvas.height,
             0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

}