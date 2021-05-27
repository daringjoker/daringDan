class Controller{
    constructor(dan){
        this.dan=dan;
        document.addEventListener("keydown",this.handleKeyDown.bind(this));
        document.addEventListener("keyup",this.handleKeyUp.bind(this));
    }
    handleKeyDown(e){
        console.log(e.key);
        switch(e.key){
            case "ArrowLeft":
                this.dan.moveLeft();
                break;
            case "ArrowRight":
                this.dan.moveRight();
                break;
            case "ArrowUp":
                this.dan.jump();
                break;
            case "Control":
                this.dan.kick();
                break;
            case "0":
                this.dan.punch();
                break;
            case "Shift":
                this.dan.shoot();
                break;
            case "1":
                this.dan.switchWeapon();
                break;
        }
    }
    handleKeyUp(e){
        switch(e.key){
            case "ArrowLeft":
            case "ArrowRight":
                this.dan.stopRunning();
                break;
        }
    }
}