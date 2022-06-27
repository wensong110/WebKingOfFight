function PVPHeroCreater(width,height,canvasObject,networkInputer){
    let hero = new KCanvasActorObject(width,height,canvasObject);
    let heroObj = {
        actor:hero,
        gravity:new KGravityComponent(hero),
        collsion: new KCollisionComponentObject(hero,"collision"),
        move: new KMoveComponentObject(hero),
    }

    var playerIndex;

    $.ajax({
        url:"/getPlayerIndex",
        success:function(e){
            playerIndex = e.data.index;
        }
    })



    networkInputer.addFunction(heroObj.move,0,playerIndex,heroObj.move.beginLeft);
    networkInputer.addFunction(heroObj.move,1,playerIndex,heroObj.move.endLeft);
    networkInputer.addFunction(heroObj.move,2,playerIndex,heroObj.move.beginRight);
    networkInputer.addFunction(heroObj.move,3,playerIndex,heroObj.move.endRight);
    networkInputer.addFunction(heroObj.move,4,playerIndex,heroObj.move.jump);
    let sender = new KeyBoardSendInputer(player,playerIndex);
    sender.addFunction("a","keydown",0);
    sender.addFunction("a","keyup",1);
    sender.addFunction("d","keydown",2);
    sender.addFunction("d","keyup",3);
    sender.addFunction("k","keydown",4);

    heroObj.sender=sender;

    return heroObj;
}