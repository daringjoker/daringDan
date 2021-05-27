class Menu{
    constructor(){
        this.finished=false;
        this.nextFrame();
        this.frameref=null;
    }
    render(){
        display.buffer.clearRect(0,0,display.buffer.canvas.width,display.buffer.canvas.height);
        display.buffer.fillStyle="black";
        display.buffer.font="40px monospace";
        display.buffer.textAlign="center";
        display.buffer.fillText("Loading Assets...",display.buffer.canvas.width/2,display.buffer.canvas.height/2);
        display.buffer.fillStyle=colorForHealth((assets.length-incomplete_assets)*100/assets.length);
        display.buffer.fillText((assets.length-incomplete_assets)+"/"+assets.length,display.buffer.canvas.width/2,display.buffer.canvas.height/2+40);
        display.render();

    }
    update(){

    }
    quit(){
        cancelAnimationFrame(this.frameref);
        this.finished=true;
    }
    nextFrame(){
        this.update();
        this.render();
        if(!this.finished)
        this.frameref=requestAnimationFrame(this.nextFrame.bind(this));
    }
}