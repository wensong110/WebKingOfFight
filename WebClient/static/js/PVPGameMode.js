class PVPGameMode{
    constructor(){
        this.gamePlay=new KingOfFight();
        environment_context.gamePlay=this.gamePlay;
        environment_context.gameMode=this;
    }

    start(){
        this.kCanvas = new KCanvasObject();
        this.testPlayer = new KCanvasActorObject(128,212,this.kCanvas);
        var ground = new KCanvasActorObject(0,710,this.kCanvas);
        ground.x=0;
        ground.y=710;
        var groundCollsion = new KCollisionComponentObject(ground);
        groundCollsion.addTriangle(PointUtil.makeTriangle(PointUtil.makePoint(0,0),PointUtil.makePoint(1280,0),PointUtil.makePoint(0,10)));
        groundCollsion.addTriangle(PointUtil.makeTriangle(PointUtil.makePoint(0,10),PointUtil.makePoint(1280,0),PointUtil.makePoint(1280,10)));
        var player = {
            actor:this.testPlayer,
            gravity:new KGravityComponent(this.testPlayer),
            move: new KMoveComponentObject(this.testPlayer),
            animation:new KAnimationStatusMechineComponent(this.testPlayer),
            collsion: new KCollisionComponentObject(this.testPlayer),
        }

        let idleAnim = new Animation("./image/player/kyo/0.gif",50,0,0,2,2);
        let rightAnim = new Animation("./image/player/kyo/1.gif",50,0,-30,2,2);
        let leftAnim = new Animation("./image/player/kyo/2.gif",50,0,-30,2,2);
        let jumpAnim = new Animation("./image/player/kyo/3.gif",50,0,-140,2,2);

        
        player.animation.addNode("idle",idleAnim);
        player.animation.addNode("right",rightAnim);
        player.animation.addNode("left",leftAnim);
        player.animation.addNode("jump",jumpAnim);
        player.animation.addEdge("init","idle",function(){return true});
        player.animation.addEdge("idle","left",function(){
            if(player.actor.xSpeed<0){
                return true;
            }
            return false;
        });
        player.animation.addEdge("left","idle",function(){
            if(player.actor.xSpeed==0){
                return true;
            }
            return false;
        });
        player.animation.addEdge("idle","right",function(){
            if(player.actor.xSpeed>0){
                return true;
            }
            return false;
        });
        player.animation.addEdge("right","idle",function(){
            if(player.actor.xSpeed==0){
                return true;
            }
            return false;
        });
        player.animation.addEdge("idle","jump",function(){
            if(player.collsion.isCollsionY()){
                return false;
            }
            return true;
        });
        player.animation.addEdge("left","jump",function(){
            if(player.collsion.isCollsionY()){
                return false;
            }
            return true;
        });
        player.animation.addEdge("right","jump",function(){
            if(player.collsion.isCollsionY()){
                return false;
            }
            return true;
        });

        player.animation.addEdge("jump","idle",function(){
            if(player.collsion.isCollsionY()){
                return true;
            }
            return false;
        });


        player.collsion.addTriangle(PointUtil.makeTriangle(PointUtil.makePoint(0,0),PointUtil.makePoint(128,0),PointUtil.makePoint(0,212)));
        player.collsion.addTriangle(PointUtil.makeTriangle(PointUtil.makePoint(0,212),PointUtil.makePoint(128,0),PointUtil.makePoint(128,212)));

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