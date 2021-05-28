class Menu{
    constructor(msg="",initial=true){
        this.msg=msg;
        if(this.msg==="GAME OVER")
        this.firstMenu="RETRY"
        else if (this.msg==="Next")
        this.firstMenu="Play Next Level"
        else
        this.firstMenu="New Game";
        this.finished=false;
        this.currentScreen="main";
        this.currentOption=0;
        this.selectedColor="yellow";
        this.defaultColor="black";
        this.selectedStroke="red";
        this.defaultStroke="#00f";
        this.selectedSize=40;
        this.defaultSize=30;
        this.frameref=null;
        this.bg=getAsset("menubg.png");
        this.clearedLevels=parseInt(localStorage.getItem("daringDan-cleared")||(-1));
        this.history=["main"];
        this.gameMenuOptions={
            main:[this.firstMenu,"Levels","Controls","Settings"],
            levels:["LEVEL 1","LEVEL 2","LEVEL 3","LEVEL 4"]
        }
        this.nextFrame();
        window.addEventListener("keydown",this.handleKey.bind(this));

    }
    render(){
        display.drawSprite(this.bg,0,0,this.bg.width,this.bg.height,0,0,display.buffer.canvas.width,display.buffer.canvas.height);
        if(this.msg==="GAME OVER")
        display.drawText("GAME OVER",0.5,0.25,"lowpixel",55,"red","brown",1,"center");
        if(this.msg==="Next")
        display.drawText("Level Complete",0.5,0.25,"lowpixel",55,"#04ce13","brown",1,"center");
        switch(this.currentScreen){
            case "main":
                {
                    let startY =Math.min(0.6,0.9-this.gameMenuOptions[this.currentScreen].length*0.1);
                    this.gameMenuOptions[this.currentScreen].forEach((opt,ind)=>{
                        if(this.currentOption==ind)
                        display.drawText(opt,0.5,startY,"lowpixel",this.selectedSize,this.selectedColor,this.selectedStroke,1,"center");
                        else  
                        display.drawText(opt,0.5,startY,"lowpixel",this.defaultSize,this.defaultColor,this.defaultStroke,1,"center");
                        startY+=0.1;
                    })   
                    break;
                }
            case "levels":
                {
                    let totalLevels=this.gameMenuOptions[this.currentScreen].length;
                    let numRows=4;
                    let numCols=Math.ceil(totalLevels/numRows);
                    let optWidth=0.22;
                    let totalWidth=numCols*optWidth;
                    let startX=0.5-totalWidth/2;                    
                    let startY =0.6;
                    display.drawText("Select Level",0.5,startY-0.12,"lowpixel",35,"yellow","brown",1,"center");
                    this.gameMenuOptions[this.currentScreen].forEach((opt,ind)=>{
                        if(this.currentOption==ind&&ind<=this.clearedLevels)
                        display.drawText(opt,startX,startY,"lowpixel",this.selectedSize,this.selectedColor,this.selectedStroke,1,"start");
                        else if(this.currentOption==ind&&ind>this.clearedLevels)
                        display.drawText(opt,startX,startY,"lowpixel",this.selectedSize,"#888","#333",1,"start");
                        else if(ind>this.clearedLevels)
                        display.drawText(opt,startX,startY,"lowpixel",this.defaultSize,"#888","#333",1,"start");
                        else
                        display.drawText(opt,startX,startY,"lowpixel",this.defaultSize,this.defaultColor,this.defaultStroke,1,"start");
                        startY+=0.1;
                        if(startY>=0.9){
                            startX+=optWidth;
                            startY=0.6;
                        }
                    })   
                    break;
                }
                case "controls":
                    {
                        display.drawText("W/UP-ARROW => JUMP",0.5,0.2,"lowpixel",this.defaultSize,this.defaultColor,this.defaultStroke,1,"center");
                        display.drawText("A/LEFT-ARROW => Walk LEFT",0.5,0.3,"lowpixel",this.defaultSize,this.defaultColor,this.defaultStroke,1,"center");
                        display.drawText("D/RIGHT-ARROW => WALK RIGHT",0.5,0.4,"lowpixel",this.defaultSize,this.defaultColor,this.defaultStroke,1,"center");
                        display.drawText("Q/SHIFT => SHOOT",0.5,0.5,"lowpixel",this.defaultSize,this.defaultColor,this.defaultStroke,1,"center");
                        display.drawText("R/1(ONE) => SWITCH WEAPON",0.5,0.6,"lowpixel",this.defaultSize,this.defaultColor,this.defaultStroke,1,"center");
                        display.drawText("E/CTRL => KICK",0.5,0.7,"lowpixel",this.defaultSize,this.defaultColor,this.defaultStroke,1,"center");                      
                        display.drawText("F/0(ZERO) => PUNCH",0.5,0.8,"lowpixel",this.defaultSize,this.defaultColor,this.defaultStroke,1,"center");
                        break;
                    }


        }

        display.drawText("ARROW: Navigate   ENTER: Select    BACKSPACE: Back    ESC: Main Menu",0.5,0.9,"lowpixel",15,"#ddd","#ddd",0,"center");

        display.render();
    }
    update(){

    }
    quit(){
        cancelAnimationFrame(this.frameref);
        removeEventListener("keydown",this.handleKey.bind(this));
        this.finished=true;
    }
    nextFrame(){
        this.update();
        this.render();
        if(!this.finished)
        this.frameref=requestAnimationFrame(this.nextFrame.bind(this));
    }
    selectOption(){
        this.msg="";
        switch(this.currentScreen){
            case "main":
                {
                    switch(this.currentOption)
                    {
                        case 0:{
                            cancelAnimationFrame(this.frameref);
                            if(!game.playing)game=new Game((this.clearedLevels+1)%this.gameMenuOptions["levels"].length);
                            controller=new Controller(game.dan);
                            this.quit();
                            break;
                        }
                        case 1:{
                            this.history.push(this.currentScreen);
                            this.currentScreen="levels";
                            this.currentOption=0;
                            break;
                        }
                        case 2:{
                            this.history.push(this.currentScreen);
                            this.currentScreen="controls";
                            this.currentOption=0;
                            break;
                        }
                    }

                    break;
                }
            case "levels":
                {
                    if(this.clearedLevels<this.currentOption){
                        //play something later
                    }else{
                        cancelAnimationFrame(this.frameref);
                        if(!game.playing)game=new Game(this.currentOption);
                        controller=new Controller(game.dan);
                        this.quit();
                    }
                    break;
                }
            case "settings":
                {

                    break;
                }
        }
    }
    handleKey(e){
        if(!this.finished){
            switch(e.key){
                case "ArrowUp":
                    this.currentOption--;
                    if(this.currentOption<0)this.currentOption=this.gameMenuOptions[this.currentScreen].length-1;
                    break;
                
                case "ArrowRight":
                    if(this.currentScreen==="levels")
                    {
                        this.currentOption=(this.currentOption+4)%this.gameMenuOptions[this.currentScreen].length;
                    }
                    break;

                case "ArrowLeft":
                    if(this.currentScreen==="levels")
                    {
                        this.currentOption=(this.gameMenuOptions[this.currentScreen].length+this.currentOption-4)%this.gameMenuOptions[this.currentScreen].length;
                    }
                    break;
                
                case "ArrowDown":
                    this.currentOption++;
                    if(this.currentOption>this.gameMenuOptions[this.currentScreen].length-1)this.currentOption=0;
                    break;
            
                case "Enter":
                    this.selectOption()
                    break;

                case "Backspace":
                    this.currentScreen=this.history.pop()||"main";
                    this.currentOption=0;
                    break;
                case "Escape":
                    this.currentScreen="main";
                    this.currentOption=0;
                    break;
            }
        }
    }
}