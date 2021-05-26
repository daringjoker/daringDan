class projectile{    
   constructor(type,x,y,velX,velY=0){
        this.spriteSheet=new Image();
        this.spriteSheet.src="assets/projs.png";
        this.animator=new Animator(this.spriteSheet);
        this.animator.switchFrameSet("idle",velX>0);
        this.animator.defaultDelay=1;
        this.animator.animationDelay=1;
        this.animator.defaultFrameSet="idle";
        this.x=x;
        this.y=y;
        this.oldY=y;
        this.oldX=x;
        this.damage=10+5*type;
        this.screenX=this.x-window.world.cameraX;
        this.screenY=this.y-window.world.cameraY;
        this.velX=velX;
        this.velY=velY;
        this.animator.getFrom(`assets/proj${type}.json`);
        this.dead=false;
        projectiles.push(this);
   }
   getFullRect(){
       return this.getHitBox();
   }
   getHitBox(){
       return{
           x:this.x-this.animator.getRenderFrame().width/2,
           y:this.y-this.animator.getRenderFrame().height/2,
           width:this.animator.getRenderFrame().width,
           height:this.animator.getRenderFrame().height
       }
   }
   getAttackBox(){
       return this.getHitBox();
   }
   update(){
       this.animator.update();
       this.oldX=this.x;
       this.oldY=this.y;
       this.x+=this.velX;
       this.y+=this.velY;
       this.screenX=this.x-world.cameraX;
       this.screenY=this.y-world.cameraY;
   }
   die(){
       console.log("this projectile is dead now");
       this.dead=true;
   }
   stopRunning(){
       this.die();
   }
}