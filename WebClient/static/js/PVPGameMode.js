class PVPGameMode{
    constructor(){
        this.gamePlay=new KingOfFight();
        environment_context.gamePlay=this.gamePlay;
        environment_context.gameMode=this;
    }

    start(){
        this.kCanvas = new KCanvasObject(this.gamePlay);
        this.testPlayer = new KCanvasActorObject(10,10,this.kCanvas);
        var player = {
            actor:this.testPlayer,
            gravity:new KGravityComponent(this.testPlayer),
        }
        this.gamePlay.startLoop();
    }

    end(){
        delete this
    }
}