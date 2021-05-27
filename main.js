const display=new Display();
display.setBufferParameter(640,320);
display.resize();
let dan=new player(200,0);
let ground=new Tiles("assets/ddlevel0.json");
let projectiles=[];
let collectibles=[];
let wList=new Image();
wList.src="assets/weapons.png";
let hb=new Image();
hb.src="assets/hb.png"
let enemies=[];
for(let _=100;_<2300;_+=2300/10){
    collectibles.push(new Collectible(randomInt(1,12),_+randomInt(-50,50),0));
}
function populateEnemies(){
    if(ground.enemyPos.length===0)
    {
        setTimeout(populateEnemies,500);
    }
    else{
        enemies=ground.enemyPos.map((e)=>{
            return new enemy(e.x,e.y, dan, e.type);
        })
    }
}
function onScreen(gameObjects){
   return gameObjects.filter((gameObject=>{
        let scr={
            x:world.cameraX,
            y:world.cameraY,
            width:world.width,
            height:world.height
        }
        return rectsCollide(scr,gameObject.getFullRect())||gameObject===dan;
    }));
}
populateEnemies();
function render()
{
    display.fillBackground("rgba(255,255,255,1)");
    ground.render();
    onScreen(collectibles).forEach(collectible=>{
        display.drawSpriteFrame(collectible,collectible.animator.getRenderFrame());
    })
    projectiles.forEach(proj=>{
        display.drawSpriteFrame(proj,proj.animator.getRenderFrame());
    })
    onScreen(enemies).forEach(obj=>{
        display.drawSpriteFrame(obj,obj.animator.getRenderFrame());        
        display.drawRect(obj.screenX-20,obj.screenY-obj.height/2,40,5,"rgba(0,0,0,0.2)");
        display.drawRect(obj.screenX-20,obj.screenY-obj.height/2,Math.round(40*obj.health/100),5,colorForHealth(obj.health));
    });
    display.drawSpriteFrame(dan,dan.animator.getRenderFrame());
    let s=0.1;    
    display.drawRect(22,10,Math.floor((hb.width*s-19)*dan.health/100),hb.height*s-10,colorForHealth(dan.health));
    display.drawSprite(hb,0,0,hb.width,hb.height,5,5,hb.width*s,hb.height*s);
    let index=0;
    dan.weapons.forEach((w,i)=>{
        if(i!==0&&w!==0){
            if(dan.currentWeapon==i){
                display.drawRect(0,30+20*(index),70,20,"rgba(255,0,0,0.2)")
            }
            display.drawSprite(wList,(i-1)*64,0,64,64,5,30+20*(index),20,20);
            display.buffer.fillStyle="black";
            display.buffer.font="15px Arial";
            display.buffer.fillText("x "+w.toString(),30,25+20*(index+1));
            index++;
        }
    })
    display.buffer.fillText("SCORE: "+dan.score.toString(),500,20);
    display.render();
}

function update()
{
    enemies=enemies.filter(o=>!o.dead);
    projectiles=projectiles.filter(p=>!p.dead);
    collectibles=collectibles.filter(p=>!p.dead);
    projectiles.forEach(proj=>{
        proj.update();
        if(proj.x<0||proj.x>ground.totalWidth*world.tileWidth||proj.y<0||proj.y>ground.totalHeight*world.tileHeight){
            proj.die();
        }
        onScreen(enemies).forEach(enemy=>{
            if(rectsCollide(enemy.getHitBox(),proj.getAttackBox())&&enemy!==dan)
            {
                enemy.health-=proj.damage;
                proj.die();
            }
        });
        if(ground.collidesWall(proj)){
            proj.die();
        }
    });
    onScreen(collectibles).forEach(coll=>{
        coll.update();
        if(rectsCollide(dan.getFullRect(),coll.getHitBox()))
        {
            coll.apply(dan);
            console.log("dan now has ",dan.weapons);
            coll.die();
        }
    })
    // let r=dan.getAttackBox();
    // display.drawRect(r.x-world.cameraX,r.y,r.width,r.height,"#0f0");
    // let v=dan.getFullRect();
    // display.drawRect(v.x-world.cameraX,v.y,v.width,v.height,"#ff0");
    onScreen(enemies).forEach(obj=>{
        // let r=obj.getAttackBox();
        // display.drawRect(r.x-world.cameraX,r.y,r.width,r.height,"#0f0");
        // let v=obj.getFullRect();
        // display.drawRect(v.x-world.cameraX,v.y,v.width,v.height,"#ff0");
        obj.update();
        if(rectsCollide(obj.getAttackBox(),dan.getHitBox())&&!obj.punchCounted){
            if(obj.kicking||obj.punching){
                obj.punchCounted=true;
                dan.health-=obj.damage;
                console.log("dan is hit");
                // if(Math.random()>0.5)dan.kickHit();
                // else dan.punchHit();
            }
        }
        if(rectsCollide(dan.getAttackBox(),obj.getHitBox())){
            if(dan.kicking||dan.punching){
                obj.health-=dan.damage;
                if(Math.random()>0.5)obj.kickHit();
                else obj.punchHit();
            }
        }
    }); 
    dan.update();
    ground.collision([dan,...enemies,...collectibles].filter(i=>!i.dying));
    let determiner=dan.x-world.width/2;
    if(determiner<0)world.cameraX=0;
    else if(determiner>(ground.totalWidth*world.tileWidth-world.width))world.cameraX=ground.totalWidth*world.tileWidth-world.width;
    else world.cameraX=determiner;
}
function nextFrame()
{
    setTimeout(requestAnimationFrame.bind(null,nextFrame),1000/30);
    update();
    render();
}

function handleKeyDown(e){
    console.log(e.key);
    switch(e.key){
        case "ArrowLeft":
            dan.moveLeft();
            break;
        case "ArrowRight":
            dan.moveRight();
            break;
        case "ArrowUp":
            dan.jump();
            break;
        case "Control":
            dan.kick();
            break;
        case "0":
            dan.punch();
            break;
        case "Shift":
            dan.shoot();
            break;
        case "1":
            dan.switchWeapon();
            break;
    }
}
function handleKeyUp(e){
    switch(e.key){
        case "ArrowLeft":
        case "ArrowRight":
            dan.stopRunning();
            break;
    }
}
document.addEventListener("keydown",handleKeyDown);
document.addEventListener("keyup",handleKeyUp);


requestAnimationFrame(nextFrame);