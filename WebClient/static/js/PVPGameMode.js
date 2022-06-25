class PVPGameMode{
    constructor(){
        this.gamePlay=new KingOfFight();
        environment_context.gamePlay=this.gamePlay;
        environment_context.gameMode=this;
    }

    start(){
        this.kCanvas = new KCanvasObject();
        this.testPlayer = new KCanvasActorObject(10,10,this.kCanvas);
        var ground = new KCanvasActorObject(0,710,this.kCanvas);
        ground.x=0;
        ground.y=710;
        var groundCollsion = new KCollisionComponentObject(ground);
        groundCollsion.addTriangle(PointUtil.makeTriangle(PointUtil.makePoint(0,0),PointUtil.makePoint(1280,0),PointUtil.makePoint(0,10)));
        groundCollsion.addTriangle(PointUtil.makeTriangle(PointUtil.makePoint(0,10),PointUtil.makePoint(1280,0),PointUtil.makePoint(1280,10)));
        groundCollsion.debugRenderOpen();
        var player = {
            actor:this.testPlayer,
            gravity:new KGravityComponent(this.testPlayer),
            collsion: new KCollisionComponentObject(this.testPlayer),
            move: new KMoveComponentObject(this.testPlayer),
        }
        player.collsion.addTriangle(PointUtil.makeTriangle(PointUtil.makePoint(0,0),PointUtil.makePoint(10,0),PointUtil.makePoint(0,10)));
        player.collsion.addTriangle(PointUtil.makeTriangle(PointUtil.makePoint(0,10),PointUtil.makePoint(10,0),PointUtil.makePoint(10,10)));
        player.collsion.debugRenderOpen();

        let inputer = new NetworkInputer(player.move,0);
        inputer.addFunction(player.move,0,0,player.move.beginLeft);
        inputer.addFunction(player.move,1,0,player.move.endLeft);
        inputer.addFunction(player.move,2,0,player.move.beginRight);
        inputer.addFunction(player.move,3,0,player.move.endRight);
        inputer.addFunction(player.move,4,0,player.move.jump);
        inputer.init("127.0.0.1:8888/server");

        let sender = new KeyBoardSendInputer(player,0);
        sender.addFunction("a","keydown",0);
        sender.addFunction("a","keyup",1);
        sender.addFunction("d","keydown",2);
        sender.addFunction("d","keyup",3);
        sender.addFunction("k","keydown",4);

        
        this.gamePlay.startLoop();
    }

    end(){
        delete this
    }
}