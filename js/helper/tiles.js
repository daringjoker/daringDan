class Tiles{
    constructor(filePath){
        this.map=[]
        this.tileWidth=64;
        this.tileHeight=64;
        this.totalWidth=80;
        this.totalHeight=10;
        this.tileSet= getAsset("tileset.png");
        this.enemyPos=[];
        let data=getAsset(filePath);
            this.totalHeight=data.height;
            this.totalWidth=data.width;
            let tileIndex=(data.layers[0].name.includes("enem"))?1:0;
            this.map=Array.from(data.layers[tileIndex].data);
            data.layers[1-tileIndex].data.forEach((item,index)=>{
                if(item!==0){
                    if(item>322)item-=322;
                    let x=(index%this.totalWidth)*world.tileWidth;
                    let y=(Math.floor(index/this.totalWidth))*world.tileHeight;
                    this.enemyPos.push({
                        x:x+world.tileWidth/2,
                        y:y-35,
                        type:item
                    });
                }
            })
        
    }
    
    render(){
        let startX=Math.floor(world.cameraX/world.tileWidth)*world.tileWidth;
        let startY=Math.ceil(world.cameraY/world.tileHeight)*world.tileHeight;
        let yOffset=startY;
        for(let y=startY/world.tileWidth;yOffset<world.cameraY+world.height;y++)
        {
            let xOffset=startX;
            for(let x=startX/world.tileWidth;xOffset<world.cameraX+world.width;x++)
            {
                let tileIndex=this.map[y*this.totalWidth+x];
                if(tileIndex!==0){
                    let i=(tileIndex-1)%23;
                    let j=Math.floor((tileIndex-1)/23);
                    display.drawSprite(this.tileSet,i*this.tileWidth,j*this.tileWidth,this.tileWidth,this.tileHeight,xOffset-world.cameraX,yOffset-world.cameraY,world.tileWidth,world.tileHeight);
                }
                xOffset+=world.tileWidth;
            }
            yOffset+=world.tileHeight;
        }
    }
    collidesWall(obj){
        obj=obj.getFullRect()
        for(let x=obj.x;x<=obj.x+obj.width;x+=obj.width){
            for(let y=obj.y;y<=obj.y+obj.height;y+=obj.height){
                let startX=Math.floor(x/world.tileWidth);
                let startY=Math.floor(y/world.tileHeight);
                let t={
                    x:startX*world.tileWidth,
                    y:startY*world.tileHeight,
                    width:world.tileWidth,
                    height:world.tileHeight
                }
                let tileIndex=this.map[startY*this.totalWidth+startX];
                if(tileIndex!==0)return true;            
            }
        }
        return false;
    }

    collision(gameObjects){
        let startX=Math.floor(world.cameraX/world.tileWidth)*world.tileWidth-world.width/4;
        let startY=Math.floor(world.cameraY/world.tileHeight)*world.tileHeight;
        let yOffset=startY;
        for(let y=startY/world.tileWidth;yOffset<world.cameraY+world.height;y++)
        {
            let xOffset=startX;
            for(let x=startX/world.tileWidth;xOffset<world.cameraX+world.width+world.width/4;x++)
            {
                let tileIndex=this.map[y*this.totalWidth+x];
                if(tileIndex!==0){
                    gameObjects.forEach(gameObject=>{
                       let tileRect={
                            x:xOffset,
                            y:yOffset,
                            width:world.tileWidth,
                            height:world.tileHeight
                        }
                        let objRect=gameObject.getFullRect();
                        // if(gameObject.spriteSheet.src.includes("item"))console.log(objRect);
                        if(rectsCollide(tileRect,objRect)){
                            // console.log(gameObject.spriteSheet.src);                        
                            if(gameObject.y+gameObject.height/2>tileRect.y&&gameObject.oldY+gameObject.height/2<tileRect.y){
                                gameObject.y=tileRect.y-gameObject.height/2-1;
                                // gameObject.oldY=gameObject.y-world.tileHeight-1;
                                gameObject.velY=0;
                                gameObject.land();
                            }
                            else if(gameObject.y-gameObject.height/2<tileRect.y+tileRect.height&&gameObject.oldY-gameObject.height/2>tileRect.y+tileRect.height){
                                gameObject.y=tileRect.y+tileRect.height+gameObject.height/2+1;
                                // gameObject.oldY=gameObject.y+world.tileHeight+1;
                                gameObject.velY=0;
                            }
                        }
                                              
                        objRect=gameObject.getFullRect();
                        if(rectsCollide(tileRect,objRect)){
                            if(gameObject.oldX<gameObject.x){
                                gameObject.x=tileRect.x-gameObject.width/2-1;
                                gameObject.stopRunning();
                            }
                            else if(gameObject.oldX>gameObject.x){
                                gameObject.x=tileRect.x+tileRect.width+gameObject.width/2+1;
                                gameObject.stopRunning();
                            }
                        }

                    })
                }
                xOffset+=world.tileWidth;
            }
            yOffset+=world.tileHeight;
        }
    }


}