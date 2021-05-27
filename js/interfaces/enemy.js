class enemy{    
    constructor(spawnX,spawnY,player=null,type=1){
        this.player=player;
        this.originalX=spawnX;
        this.roamingCoeff=80;
        this.x=spawnX;
        this.y=spawnY;
        this.oldX=spawnX+1;
        this.oldY=spawnY;
        this.screenX=spawnX;
        this.screenY=spawnY;
        this.width=40;
        this.height=70;
        this.velX=0;
        this.velY=0;
        this.xVelDelta=3;
        this.health=100;
        this.damage=5;
        this.jumping=false;
        this.dying=false;
        this.dead=false;
        this.punchCounted=false;
        this.status="idle";
        this.facingRight=true;
        this.lastAnimation=null;
        this.lastAnimationLoop=true;
        this.lastHitTime=performance.now()+Math.random()*2000;
        this.idleSince=performance.now()+Math.random()*2000;
        this.spriteSheet=new Image();
        this.animator=new Animator(this.spriteSheet);
        switch(type){
            case 1:{
                this.spriteSheet.src="assets/simpleEnemy.png";
                this.animator.getFrom("assets/simpleEnemy.json");
                this.damage=5;
                break;
            }
            case 2:{
                this.spriteSheet.src="assets/cyberDog.png";
                this.animator.getFrom("assets/cyberDog.json");
                this.damage=10;
                this.height=35;
                break;
            }
            case 3:{
                this.spriteSheet.src="assets/shield.png";
                this.animator.getFrom("assets/shield.json");
                this.damage=20;
                this.animator.defaultDelay=5;
                this.animator.animationDelay=5;
                this.height=90;
                break;
            }
        }
        this.animator.switchFrameSet("idle",this.facingRight);
        this.animator.defaultFrameSet="idle";
        this.animator.onAnimationComplete(this.singleAnimationComplete.bind(this));
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
            x=this.x+0.3*fr.width;
            width=fr.width*0.4;
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
    getAttackBox(){
        let fr=this.animator.getRenderFrame();
        let x;
        let y=this.y-fr.height/2;
        let height=fr.height;
        let width;
        if(this.facingRight){
            x=this.x-0.3*fr.width;
            width=fr.width*0.8;
        }
        else{
            x=this.x-fr.width*0.5;
            width=fr.width*0.8;
        }
        return{
            x,
            y,
            width,
            height
        }

    }

    update(){
        if(!this.dying){
            this.AI();
            this.animator.update();
            if(Math.abs(this.velX)>10)this.velX=10*(this.velX/Math.abs(this.velX));
            if(Math.abs(this.velY)>32)this.velY=32*(this.velY/Math.abs(this.velY));
            this.velY+=window.world.gravity;
            this.oldX=this.x;
            this.oldY=this.y;
            this.x+=this.velX;
            this.y+=this.velY;
            if(this.health<=0)this.die();
        }
        else{
            this.velY+=world.gravity;
            this.y+=this.velY;
            this.animator.currentFrameSet="die";
            this.animator.currentFrameSetLoop=true;
        }
        this.screenX=this.x-world.cameraX;
        this.screenY=this.y-world.cameraY;
        if(this.screenY>window.world.height-1) this.dead=true;
    }
    AI(){
        if(distance(this.player,this)<60){
            if(distance(this.player,this)<(this.width/2+this.player.width/2))
            {
               if(!this.punching&&this.status!=="iamhit")
                {   
                    this.status="punch-waiting";
                    this.facingRight=this.x<this.player.x;
                    if(this.velX!==0)
                        this.stopRunning();
                    this.punch();
                }                
                
            }
            else if(this.player.x<this.x){
                this.moveLeft();
            }
            else if (this.player.x>this.x){
                this.moveRight();
            }
        }
        else{
            let dist=this.x-this.originalX;
            if(Math.abs(dist)>=this.roamingCoeff){
                this.x=this.originalX+(this.roamingCoeff-1)*(dist/Math.abs(dist))
                if(this.status!=="idle"){
                    this.status="idle";
                    this.stopRunning();
                    this.idleSince=performance.now()+Math.random()*2000;
                }
               
            }
            if(performance.now()-this.idleSince>2000&&this.status==="idle"){
                if(this.facingRight){ 
                    this.moveLeft();
                 }
                 else{
                     this.moveRight();
                 }
            }
        } 
       
       
    }
    die(){
        this.dying=true;
        this.animator.switchFrameSet("die");
        this.animator.currentFrameSetLoop=true;
        this.animator.lastAnimation="die";
        this.animator.lastAnimationLoop=true;
    }
  
    moveLeft(){
        this.velX=-this.xVelDelta;
        this.status="walking";
        if(!(this.animator.currentFrameSet==="walk-left"&&this.facingRight===false)){
            this.facingRight=false;
            this.animator.switchFrameSet("walk-left",this.facingRight);
        }
    }
    
    moveRight(){
        this.velX=this.xVelDelta;
        this.status="walking"
        if(!(this.animator.currentFrameSet==="walk-left"&&this.facingRight===true)){
            this.facingRight=true;
            this.animator.switchFrameSet("walk-left",this.facingRight);
        }
    }
    stopRunning(){
        this.idleSince=performance.now()+Math.random()*2000;
        this.velX=0;
        if(this.animator.currentFrameSet!==this.animator.defaultFrameSet)
        this.animator.switchFrameSet(this.animator.defaultFrameSet,this.facingRight);
    }

    jump(){
    }

    land(){
        if(this.jumping){
            this.jumping=false;
        }
    }

    kickHit(){
        this.status="iamhit";
        this.lastHitTime=performance.now()+Math.random()*2000;
        this.animator.switchFrameSet("kick-hit",this.facingRight);
        this.animator.currentFrameSetLoop=false;
        this.animator.animationDelay=5;
    }
    punchHit(){
        this.status="iamhit";
        this.lastHitTime=performance.now()+Math.random()*2000;
        this.animator.switchFrameSet("punch-hit",this.facingRight);
        this.animator.currentFrameSetLoop=false;
        this.animator.animationDelay=3;
    }

    punch(){
        if(!this.punching&&performance.now()-this.lastHitTime>=1500){
                this.lastHitTime=performance.now()+Math.random()*2000;
                this.punchCounted=false;
                this.punching=true;
                this.lastAnimation=this.animator.currentFrameSet;
                this.lastAnimationLoop=this.animator.currentFrameSetLoop;
                this.animator.switchFrameSet("attack",this.facingRight);
                this.animator.animationDelay=2;
                this.animator.currentFrameSetLoop=false;
        }
    }
    singleAnimationComplete(){
        if(this.status="iamhit"){
            this.animator.currentFrameSetLoop=true;
            this.status="idle";
        }
        this.animator.switchFrameSet(this.lastAnimation,this.facingRight);
        this.animator.currentFrameSetLoop=this.lastAnimationLoop;
        if(this.kicking){
            this.kicking=false;
        }
        if(this.punching){
            this.punching=false;
        }
    }
}