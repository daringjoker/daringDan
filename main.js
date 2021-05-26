const display=new Display();
display.setBufferParameter(640,320);
display.resize();
let dan=new player(200,0);
let enemies=[new enemy(400,0,dan),new enemy(405,0,dan),new enemy(600,0,dan)];
let projectiles=[];
let ground=new Tiles("assets/ddlevel0.json");
let gameObjects=[...enemies,dan];
let onCurrentScreen;
let hb=new Image();
hb.src="assets/hb.png"
function render()
{
    display.fillBackground("rgba(255,255,255,1)");
    ground.render();
    let s=0.1;    
    display.drawRect(22,10,Math.floor((hb.width*s-19)*dan.health/100),hb.height*s-10,colorForHealth(dan.health));
    display.drawSprite(hb,0,0,hb.width,hb.height,5,5,hb.width*s,hb.height*s);
    projectiles.forEach(proj=>{
        display.drawSpriteFrame(proj,proj.animator.getRenderFrame());
    })
    onCurrentScreen.forEach(obj=>{
        display.drawSpriteFrame(obj,obj.animator.getRenderFrame());
        if(obj!==dan)
        {
            display.drawRect(obj.screenX-20,obj.screenY-obj.height/2,40,5,"rgba(0,0,0,0.2)");
            display.drawRect(obj.screenX-20,obj.screenY-obj.height/2,Math.round(40*obj.health/100),5,colorForHealth(obj.health));
        }
    });
    display.render();
}

function update()
{
    gameObjects=gameObjects.filter(o=>!o.dead);
    projectiles=projectiles.filter(p=>!p.dead);
    onCurrentScreen=gameObjects.filter((gameObject=>{
        let scr={
            x:world.cameraX,
            y:world.cameraY,
            width:world.width,
            height:world.height
        }
        return rectsCollide(scr,gameObject.getFullRect())
    }));

    projectiles.forEach(proj=>{
        proj.update();
        if(proj.x<0||proj.x>ground.totalWidth*world.tileWidth||proj.y<0||proj.y>ground.totalHeight*world.tileHeight){
            proj.die();
        }
        onCurrentScreen.forEach(enemy=>{
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
    onCurrentScreen.forEach(obj=>{
        // let r=obj.getAttackBox();
        // display.drawRect(r.x-world.cameraX,r.y,r.width,r.height,"#0f0");
        // let v=obj.getFullRect();
        // display.drawRect(v.x-world.cameraX,v.y,v.width,v.height,"#ff0");
        obj.update();
        if(rectsCollide(dan.getAttackBox(),obj.getHitBox())&&obj!==dan){
            if(dan.kicking||dan.punching){
                obj.health-=dan.damage;
                if(Math.random()>0.5)obj.kickHit();
                else obj.punchHit();
            }
        }
        if(rectsCollide(obj.getAttackBox(),dan.getHitBox())&&obj!==dan&&!obj.punchCounted){
            if(obj.kicking||obj.punching){
                obj.punchCounted=true;
                dan.health-=obj.damage;
                console.log("dan is hit");
                // if(Math.random()>0.5)dan.kickHit();
                // else dan.punchHit();
            }
        }
    });
    ground.collision([...onCurrentScreen].filter(i=>!i.dying));
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