class Controller{
    constructor(dan){
        this.dan=dan;
        this.paused=false;
        document.addEventListener("keydown",this.handleKeyDown.bind(this));
        document.addEventListener("keyup",this.handleKeyUp.bind(this));
    }
    handleKeyDown(e){
        console.log(e.key);
        if(!this.paused){
            switch(e.key){
                case "a":
                case "ArrowLeft":
                    this.dan.moveLeft();
                    break;
                case "d":                
                case "ArrowRight":
                    this.dan.moveRight();
                    break;
                case "d":
                case "ArrowUp":
                    this.dan.jump();
                    break;
                case "e":
                case "Control":
                    this.dan.kick();
                    break;
                case "f":
                case "0":
                    this.dan.punch();
                    break;
                case "q":
                case "Shift":
                    this.dan.shoot();
                    break;
                case "r":
                case "1":
                    this.dan.switchWeapon();
                    break;
            }
        }
    }
    handleKeyUp(e){
        if(!this.paused){
            switch(e.key){
                case "ArrowLeft":
                case "ArrowRight":
                    this.dan.stopRunning();
                    break;
            }
        }
    }
}