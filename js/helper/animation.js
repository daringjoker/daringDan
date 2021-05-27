class Animator{
    constructor(spriteSheet){
        this.frames=[];
        this.frameSet={};
        this.spriteSheet=spriteSheet;
        this.currentFrameIndex=0;
        this.currentFrameSet="";
        this.currentFrameStatus="playing";
        this.defaultFrameSet="";
        this.currentFrameSetLoop=true;
        this.flipped=false;
        this.defaultDelay=3;
        this.animationDelay=3;
        this.animCounter=0;
        this.animationCompleteCallback=null;
    }
    getFrom(url){
        let data=getAsset(url);
            Object.keys(data).forEach((key,index)=>{
                let arr=data[key].map(fr=>this.addFrame(new Frame(fr.x,fr.y,fr.width,fr.height,fr.offX||0,fr.offY||0)));
                this.addFrameSet(key,arr);
             })
    }

    onAnimationComplete(callback)
    {
        this.animationCompleteCallback=callback;
    }

    addFrame(frame)
    {
        this.frames.push(frame);
        return this.frames.length-1;
    }

    addFrameSet(setName,frameIndexList)
    {
        this.frameSet[setName]=frameIndexList;
    }

    switchFrameSet(setName,flip=false)
    {
        this.currentFrameSet=setName;
        this.currentFrameIndex=0;
        this.flipped=flip;
    }

    update()
    {
        this.animCounter++;
        if(this.currentFrameSet&&this.currentFrameStatus!=="paused"&&this.animCounter%this.animationDelay==0)
        {
            this.animCounter=0;
            this.currentFrameIndex++;
            if(this.currentFrameIndex>=this.frameSet[this.currentFrameSet].length){
                if(this.currentFrameSetLoop) this.currentFrameIndex=0;
                else{
                    this.switchFrameSet(this.defaultFrameSet,this.flipped);
                    this.animationDelay=this.defaultDelay;
                    if(this.animationCompleteCallback!==null){
                        this.animationCompleteCallback();
                    }
                } 
            }
        }     
    }
    getRenderFrame(){
        let frame;
        if(this.currentFrameSet){
             frame= this.frames[this.frameSet[this.currentFrameSet][this.currentFrameIndex]];
        }
        else{
            frame=this.frames[this.frameSet[this.defaultFrameSet][0]];
            this.currentFrameSet=this.defaultFrameSet;
        }
        return{
            sheet:this.spriteSheet,
            flip:this.flipped,
            x:frame.x-frame.offsetX,
            y:frame.y-frame.offsetY,
            width:frame.width-2*frame.offsetX,
            height:frame.height-2*frame.offsetY
        }
    }
}