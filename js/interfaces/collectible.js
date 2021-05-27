class Collectible{    
    constructor(type,x,y){
         this.type=type;
         this.spriteSheet=new Image();
         this.spriteSheet.src="assets/items.png";
         this.animator=new Animator(this.spriteSheet);
         this.animator.switchFrameSet("idle");
         this.animator.defaultDelay=3;
         this.animator.animationDelay=3;
         this.animator.defaultFrameSet="idle";
         this.x=x;
         this.y=y;
         this.oldY=y;
         this.oldX=x;
         this.velY=0;
         this.velX=0;
         this.damage=10+5*type;
         this.screenX=this.x-window.world.cameraX;
         this.screenY=this.y-window.world.cameraY;
         this.animator.getFrom(`assets/item${type}.json`);
         this.dead=false;
         this.width=5;
         this.height=5;
         this.gravity=world.gravity;
    }
    getFullRect(){
        return this.getHitBox();
    }
    getHitBox(){
        let fr=this.animator.getRenderFrame();
        let r={
            x:this.x-fr.width/2,
            y:this.y-fr.height/2,
            width:fr.width,
            height:fr.height
        }
        return r;
    }
    update(){
        this.animator.update();
        let fr=this.animator.getRenderFrame();
        this.width=fr.width;
        this.height=fr.height;
        this.oldY=this.y;
        this.oldX=this.x;
        this.velY+=this.gravity;
        this.y+=this.velY;
        this.screenX=this.x-world.cameraX;
        this.screenY=this.y-world.cameraY;
    }

    apply(obj){
        switch(this.type){
            case 1:{
                obj.weapons[1]+=10;
                break;
            }
            case 2:{
                obj.weapons[2]+=5;
                break;
            }
            case 3:{
                obj.health=Math.min(obj.health+10,100);
                break;
            }
            case 4:{
                obj.health=Math.min(obj.health+25,100);
                break;
            }
            case 5:{
                obj.score+=10;
                break;
            }
            case 6:{
                obj.score+=5;
                break;
            }
            case 7:{
                obj.score+=50;
                break;
            }
            case 8:{
                obj.score+=100;
                break;
            }
            case 9:{
                obj.score+=250;
                break;
            }
            case 10:{
                obj.score+=500;
                break;
            }
            case 11:{
                obj.health=Math.min(obj.health+50,100);
                break;
            }
            case 2:{
                obj.health=100;
                break;
            }
        }
        localStorage.setItem("daringDan-score",obj.score.toString());
    }
    land(){
        this.velY=0;
        this.gravity=0;
    }
    die(){
        this.dead=true;
    }
 }