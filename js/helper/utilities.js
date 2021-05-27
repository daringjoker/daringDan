function randomChoice(arr){
    let index=Math.round(Math.random()*arr.length);
    return arr[index];
}

function distance(gameObject1,gameObject2)
{
    let deltaX=gameObject1.x-gameObject2.x;
    let deltaY=gameObject1.y-gameObject2.y;
    return Math.sqrt(deltaX*deltaX+deltaY*deltaY);
}
function rectsCollide(rect1,rect2){
    return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y)     
}

function colorForHealth(health){
    let colors=["#FF0D0D","#FF4E11","#FF8E15"," #FAB733","#ACB334","#69B34C","#00ff00"];
    let hIndex=Math.floor(health*(colors.length-1)/100);
    return colors[hIndex];
}

function scale(x, from_low,from_high, to_low, to_high)
{
    // this function scales a value x from the range (from_low,from_high) to the range (to_low , to_high)
    return to_low+((x-from_low)/(from_high-from_low))*(to_high-to_low)
}

function random(a,b){
    //returns a random decimal value between a and b inclusive;
    return a+Math.random()*(b-a);
}

function randomInt(a,b){
    //returns a random Integer value between a and b inclusive;
    return a+Math.round((b-a)*Math.random());
}
