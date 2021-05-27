class Game{
    constructor(){
        this.dan=new player(200,0);
        this.ground=new Tiles("assets/ddlevel1.json");
        this.projectiles=[];
        this.collectibles=[];
        this.wList=getAsset("weapons.png");
        this.hb=getAsset("hb.png");
        this.enemies=[];
        for(let _=100;_<2300;_+=2300/10){
            this.collectibles.push(new Collectible(randomInt(1,12),_+randomInt(-50,50),0));
        }
        this.populateEnemies();
        requestAnimationFrame(this.nextFrame.bind(this));
    }

    populateEnemies(){
        if(this.ground.enemyPos.length===0)
        {
            setTimeout(this.populateEnemies,500);
        }
        else{
            this.enemies=this.ground.enemyPos.map((e)=>{
                return new enemy(e.x,e.y,this.dan, e.type);
            })
        }
    }

    onScreen(gameObjects){
       return gameObjects.filter((gameObject=>{
            let scr={
                x:world.cameraX,
                y:world.cameraY,
                width:world.width,
                height:world.height
            }
            return rectsCollide(scr,gameObject.getFullRect());
        }));
    }
    render()
    {
        display.fillBackground("rgba(255,255,255,1)");
        this.ground.render();
        this.onScreen(this.collectibles).forEach(collectible=>{
            display.drawSpriteFrame(collectible,collectible.animator.getRenderFrame());
        })
        this.projectiles.forEach(proj=>{
            display.drawSpriteFrame(proj,proj.animator.getRenderFrame());
        })
        this.onScreen(this.enemies).forEach(obj=>{
            display.drawSpriteFrame(obj,obj.animator.getRenderFrame());        
            display.drawRect(obj.screenX-20,obj.screenY-obj.height/2,40,5,"rgba(0,0,0,0.2)");
            display.drawRect(obj.screenX-20,obj.screenY-obj.height/2,Math.round(40*obj.health/100),5,colorForHealth(obj.health));
        });
        display.drawSpriteFrame(this.dan,this.dan.animator.getRenderFrame());
        let s=0.1;    
        display.drawRect(22,10,Math.floor((this.hb.width*s-19)*this.dan.health/100),this.hb.height*s-10,colorForHealth(this.dan.health));
        display.drawSprite(this.hb,0,0,this.hb.width,this.hb.height,5,5,this.hb.width*s,this.hb.height*s);
        let index=0;
        this.dan.weapons.forEach((w,i)=>{
            if(i!==0&&w!==0){
                if(this.dan.currentWeapon==i){
                    display.drawRect(0,30+20*(index),70,20,"rgba(255,0,0,0.2)")
                }
                display.drawSprite(this.wList,(i-1)*64,0,64,64,5,30+20*(index),20,20);
                display.buffer.fillStyle="black";
                display.buffer.textAlign="left";
                display.buffer.font="15px Arial";
                display.buffer.fillText("x "+w.toString(),30,25+20*(index+1));
                index++;
            }
        })
        display.buffer.fillText("SCORE: "+this.dan.score.toString(),500,20);
        display.render();
    }
    
    update()
    {
        this.enemies=this.enemies.filter(o=>!o.dead);
        this.projectiles=this.projectiles.filter(p=>!p.dead);
        this.collectibles=this.collectibles.filter(p=>!p.dead);
        this.projectiles.forEach(proj=>{
            proj.update();
            if(proj.x<0||proj.x>this.ground.totalWidth*world.tileWidth||proj.y<0||proj.y>this.ground.totalHeight*world.tileHeight){
                proj.die();
            }
            this.onScreen(this.enemies).forEach(enemy=>{
                if(rectsCollide(enemy.getHitBox(),proj.getAttackBox())&&enemy!==this.dan)
                {
                    enemy.health-=proj.damage;
                    proj.die();
                }
            });
            if(this.ground.collidesWall(proj)){
                proj.die();
            }
        });
        this.onScreen(this.collectibles).forEach(coll=>{
            coll.update();
            if(rectsCollide(this.dan.getFullRect(),coll.getHitBox()))
            {
                coll.apply(this.dan);
                coll.die();
            }
        })
        // let r=dan.getAttackBox();
        // display.drawRect(r.x-world.cameraX,r.y,r.width,r.height,"#0f0");
        // let v=dan.getFullRect();
        // display.drawRect(v.x-world.cameraX,v.y,v.width,v.height,"#ff0");
        this.onScreen(this.enemies).forEach(obj=>{
            // let r=obj.getAttackBox();
            // display.drawRect(r.x-world.cameraX,r.y,r.width,r.height,"#0f0");
            // let v=obj.getFullRect();
            // display.drawRect(v.x-world.cameraX,v.y,v.width,v.height,"#ff0");
            obj.update();
            if(rectsCollide(obj.getAttackBox(),this.dan.getHitBox())&&!obj.punchCounted){
                if(obj.kicking||obj.punching){
                    obj.punchCounted=true;
                    this.dan.health-=obj.damage;
                    // if(Math.random()>0.5)dan.kickHit();
                    // else dan.punchHit();
                }
            }
            if(rectsCollide(this.dan.getAttackBox(),obj.getHitBox())&&!this.dan.attackCounted){
                if(this.dan.kicking||this.dan.punching){
                    this.dan.attackCounted=true;
                    obj.health-=this.dan.damage;
                    if(Math.random()>0.5)obj.kickHit();
                    else obj.punchHit();
                }
            }
        }); 
        this.dan.update();
        this.ground.collision([this.dan,...this.enemies,...this.collectibles].filter(i=>!i.dying));
        if(this.dan.x-this.dan.width/2<0){
            this.dan.x=this.dan.width
        }
        if(this.dan.y-this.dan.height/2>world.height-5)
        {
            gameOver();
        }
        if(this.dan.x+this.dan.width/2>world.tileWidth*this.ground.totalWidth)
        {
            if(this.enemies.length===0){
                levelComplte();
            }
            else{
                this.dan.y=world.width;
            }
        }
        let determiner=this.dan.x-world.width/2;
        if(determiner<0)world.cameraX=0;
        else if(determiner>(this.ground.totalWidth*world.tileWidth-world.width))world.cameraX=this.ground.totalWidth*world.tileWidth-world.width;
        else world.cameraX=determiner;
    }

    levelComplte(){
    
    }

    gameOver(){
    
    }

    nextFrame()
    {
        setTimeout(requestAnimationFrame.bind(null,this.nextFrame.bind(this)),1000/30);
        this.update();
        this.render();
    }
}