class player{
    constructor(spawnX,spawnY){
        this.x=spawnX;
        this.y=spawnY;
        this.oldX=spawnX;
        this.oldY=spawnY;
        this.screenX=spawnX;
        this.screenY=spawnY;
        this.width=20;
        this.height=52;
        this.velX=0;
        this.velY=0;
        this.xVelDelta=7;
        this.health=100;
        this.damage=8;
        this.jumping=false;
        this.shooting=false;
        this.score=parseInt(localStorage.getItem("daringDan-score")||0);
        this.weapons=[0,10,5];
        this.currentWeapon=1;
        this.kicks=["kick","push-kick","round-kick","low-kick","high-kick"]
        this.punches=["punch","super-punch","right-punch","right-super-punch","hook-punch","jab-punch"]
        this.status="idle";
        this.facingRight=true;
        this.lastAnimation=null;
        this.lastAnimationLoop=true;
        this.spriteSheet=getAsset("dan.png");
        this.animator=new Animator(this.spriteSheet);
        this.animator.getFrom("assets/dan.json");
        this.animator.switchFrameSet("idle",this.facingRight);
        this.animator.defaultFrameSet="idle";
        this.attackCounted=false;
        this.animator.onAnimationComplete(this.singleAnimationComplete.bind(this))
    }
    getFullRect(){
        return {
            x:this.x-this.width/2,
            y:this.y-this.height/2,
            width:this.width,
            height:this.height
        }
    }
    getHitBox(){
        let fr=this.animator.getRenderFrame();
        let x;
        let y=this.y-fr.height/2;
        let height=fr.height;
        let width;
        if(this.facingRight){
            x=this.x+0.5*fr.width;
            width=fr.width*0.2;
        }
        else{
            x=this.x-fr.width*0.7;
            width=fr.width*0.2;
        }
        return{
            x,
            y,
            width,
            height
        }
    }
    getAttackBox(){
        let fr=this.animator.getRenderFrame();
        let x;
        let y=this.y-fr.height/2;
        let height=fr.height;
        let width;
        if(this.facingRight){
            x=this.x+0.3*fr.width;
            width=fr.width*0.2;
        }
        else{
            x=this.x-fr.width*0.5;
            width=fr.width*0.2;
        }
        return{
            x,
            y,
            width,
            height
        }
    }
    update(){
        this.animator.update();
        if(Math.abs(this.velX)>10)this.velX=10*(this.velX/Math.abs(this.velX));
        if(Math.abs(this.velY)>35)this.velY=35*(this.velY/Math.abs(this.velY));
        this.velY+=window.world.gravity;
        this.oldX=this.x;
        if(Math.abs(this.oldY-this.y)>34)
        this.oldY=this.y;
        this.x+=this.velX;
        this.y+=this.velY;
        this.screenX=this.x-world.cameraX;
        this.screenY=this.y-world.cameraY;
    }
  
    moveLeft(){
        if(this.velX>=0)
        this.velX=-this.xVelDelta;
        else
        this.velX-=1;
        if(!(this.animator.currentFrameSet==="walk-left"&&this.facingRight===false)){
            this.facingRight=false;
            this.animator.switchFrameSet("walk-left",this.facingRight);
        }
    }
    
    moveRight(){
        if(this.velX<=0)
        this.velX=this.xVelDelta;
        else
        this.velX+=1;
        if(!(this.animator.currentFrameSet==="walk-left"&&this.facingRight===true)){
            this.facingRight=true;
            this.animator.switchFrameSet("walk-left",this.facingRight);
        }
    }
    stopRunning(){
        this.velX=0;
        this.animator.switchFrameSet(this.animator.defaultFrameSet,this.animator.flipped);
        this.animator.currentFrameIndex=0;
    }

    jump(){
        if(!this.jumping){
            this.jumping=true;
            this.velY = -35;
            if(this.animator.currentFrameSet!=="jump")
            {
                this.lastAnimation=this.animator.currentFrameSet;
                this.lastAnimationLoop=this.animator.currentFrameSetLoop;
                this.animator.switchFrameSet("jump",this.facingRight);
                this.animator.currentFrameSetLoop=false;
            }
        }
        
    }

    land(){
        if(this.jumping){
            this.jumping=false;
            this.animator.switchFrameSet(this.lastAnimation,this.facingRight);
            this.animator.currentFrameSetLoop=this.lastAnimationLoop;            
        }
    }

    kick(){
        if(!this.kicking&&!this.punching){        
            let selectedKick=randomChoice(this.kicks);
            {       this.attackCounted=false;
                    this.kicking=true;
                    this.lastAnimation=this.animator.currentFrameSet;
                    this.lastAnimationLoop=this.animator.currentFrameSetLoop;
                    this.animator.switchFrameSet(selectedKick,this.facingRight);
                    this.animator.currentFrameSetLoop=false;
                    this.animator.animationDelay=1;
            }
        }
    }

    punch(){
        if(!this.kicking&&!this.punching){
            let selectedPunch=randomChoice(this.punches);
            {   
                this.attackCounted=false;
                this.punching=true;
                this.lastAnimation=this.animator.currentFrameSet;
                this.lastAnimationLoop=this.animator.currentFrameSetLoop;
                this.animator.switchFrameSet(selectedPunch,this.facingRight);
                this.animator.animationDelay=1;
                this.animator.currentFrameSetLoop=false;
            }
        }
    }
    switchWeapon(){
        this.currentWeapon=(this.currentWeapon+1)%this.weapons.length;
        if(this.currentWeapon==0)this.currentWeapon=1;
    }
    shoot(){
        if(!this.kicking&&!this.punching&&!this.shooting){
            if(this.currentWeapon!==0&&this.weapons[this.currentWeapon]>0){
            this.shooting=true;
            new projectile(this.currentWeapon,this.x,this.y,(this.facingRight?20:-20));
            this.lastAnimation=this.animator.currentFrameSet;
            this.lastAnimationLoop=this.animator.currentFrameSetLoop;
            this.animator.switchFrameSet("throw",this.facingRight);
            this.animator.animationDelay=2;
            this.animator.currentFrameSetLoop=false;
            this.weapons[this.currentWeapon]--;
            if(this.weapons[this.currentWeapon]==0)this.switchWeapon();
            }
        }
    }
    singleAnimationComplete(){
        if(this.kicking||this.punching||this.shooting){
            this.animator.switchFrameSet(this.lastAnimation,this.facingRight);
            this.animator.currentFrameSetLoop=this.lastAnimationLoop;
        }
        if(this.kicking){
            this.kicking=false;
        }
        if(this.punching){
            this.punching=false;
        }
        if(this.shooting){
            this.shooting=false;
        }

    }

}