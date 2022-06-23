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
            collsion: new KCollisionComponentObject(this.testPlayer)
        }
        player.collsion.addTriangle(PointUtil.makeTriangle(PointUtil.makePoint(0,0),PointUtil.makePoint(10,0),PointUtil.makePoint(0,10)));
        player.collsion.addTriangle(PointUtil.makeTriangle(PointUtil.makePoint(0,10),PointUtil.makePoint(10,0),PointUtil.makePoint(10,10)));
        player.collsion.debugRenderOpen();
        this.gamePlay.startLoop();
    }

    end(){
        delete this
    }
}