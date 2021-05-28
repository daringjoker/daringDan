let assets=["menubg.png","ddlevel2.json","ddlevel3.json","level3bg.png","level0bg.png","level1bg.png","level2bg.png","cyberDog.json","ddlevel0.json","item10.json","item3.json","item7.json","proj1.json","shield.png","weapons.png","cyberDog.png","ddlevel1.json","item11.json","item4.json","item8.json","proj2.json","simpleEnemy.json","dan.json","hb.png","item12.json","item5.json","item9.json","projs.png","simpleEnemy.png","dan.png","item1.json","item2.json","item6.json","items.png","shield.json","tileset.png"]
incomplete_assets=assets.length;
processedAssets={}
let loadAsset=asset=>{
    let ext=asset.split(".").pop();
    let data;
    switch(ext)
    {
        case "json":
            fetch(`assets/${asset}`)
            .then(res=>res.json())
            .then(data=>{
                processedAssets[asset]=data;
                incomplete_assets--;
            });
            break;

        case "jpg":
        case "png":
            let img=new Image()
            img.onload=e=>{
                incomplete_assets--;
                processedAssets[asset]=e.target;
            }
            img.src=`assets/${asset}`;
            break;
        case "wav":
            let sound=new Audio();
            sound.onload=e=>{
                incomplete_assets--;
                processedAssets[asset]=e.target;
            }
            sound.src=`assets/${asset}`;
            break;
    }
}
assets.forEach(loadAsset);

function getAsset(asset){
    let ret=processedAssets[asset.replace("assets/","")]
    if(ret===undefined){
        console.log("could not find",asset);
    }
    return ret;
}