
const display=new Display();
display.setBufferParameter(640,320);
display.resize();
let game;
let controller;
let menu;
function init(){
    if(incomplete_assets>0){
        setTimeout(init,333);
        if(menu===undefined)menu=new Splash();
    }else
    {
        menu.quit();
        game =new Menu();
    }
}
init();