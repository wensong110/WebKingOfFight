class KingOfFight{
    constructor(selector){
        this.kObjects=[];
        this.kObjectIdCnt=1;
        this.lastTimestamp=0;
        if(!selector) this.$window=$("#game-div");
        else this.$window=$(selector)
    }

    findObkectById(id){
        var l=0;
        var r=this.kObjects.length
        while(l<r){
            var mid=math.floor((l+r)/2)
            if(this.kObjects[mid].id<id){
                l=mid+1;
            }else{
                r=mid;
            }
        }
        if(this.kObjects[l].id==id){
            return l;
        }
        return -1;
    }
    
    loop(timestamp){
        for (var obj of this.kObjects){
            if(obj.hasStarted==false){
                obj.start();
                obj.hasStarted=true;
            }
            obj.tick(timestamp-this.lastTimestamp);
        }
        this.lastTimestamp=timestamp;
        requestAnimationFrame(this.loop.bind(this));
    }

    startLoop(){
        requestAnimationFrame(this.loop.bind(this));
    }
}



class KObject{
    constructor(gamePlay){
        this.id=gamePlay.kObjectIdCnt++;
        gamePlay.kObjects.push(this);
        this.hasStarted=false;
        this.gamePlay=gamePlay;
    }
    start(){

    }

    tick(delta){

    }

    destroy(){
        var pos = gamePlay.findObkectById(this.id);
        if(pos==-1){
            return
        }
        gamePlay.kObjects.slice(pos,1)
    }
}

class KCanvasObject extends KObject{
    constructor(gamePlay){
        super(gamePlay);
        var $canvas = $("<canvas></canvas>");
        $canvas.css("width",this.gamePlay.$window.css("width"));
        $canvas.css("height",this.gamePlay.$window.css("height"));
        console.log(this.gamePlay.$window)
        this.ctx = $canvas[0].getContext('2d');
        this.gamePlay.$window.append($canvas);
    }
    start(){

    }

    tick(delta){
    }
    destroy(){

    }
}

