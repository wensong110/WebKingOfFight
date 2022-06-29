class KingOfFight{
    constructor(selector){
        this.kObjects=[];
        this.KComponents=[];
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
        for (let i=0;i<this.KComponents.length;i++){
            let obj=this.KComponents[i];
            if(obj.beginTick){
                obj.beginTick();
            }
        }
        for (let i=0;i<this.kObjects.length;i++){
            let obj=this.kObjects[i];
            if(obj.beginTick){
                obj.beginTick();
            }
        }
        for (let i=0;i<this.KComponents.length;i++){
            let obj=this.KComponents[i];
            if(obj.hasStarted==false){
                obj.start();
                obj.hasStarted=true;
            }
            obj.tick(timestamp-this.lastTimestamp);
        }
        for (let i=0;i<this.kObjects.length;i++){
            let obj=this.kObjects[i];
            if(obj.hasStarted==false){
                obj.start();
                obj.hasStarted=true;
            }
            obj.tick(timestamp-this.lastTimestamp);
        }
        for (let i=0;i<this.KComponents.length;i++){
            let obj=this.KComponents[i];
            if(obj.endTick){
                obj.endTick();
            }
        }
        for (let i=0;i<this.kObjects.length;i++){
            let obj=this.kObjects[i];
            if(obj.endTick){
                obj.endTick();
            }
        }
        this.lastTimestamp=timestamp;
        requestAnimationFrame(this.loop.bind(this));
    }

    startLoop(){
        requestAnimationFrame(this.loop.bind(this));
    }
}

var environment_context={};

class KObject{
    constructor(){
        this.id=environment_context.gamePlay.kObjectIdCnt++;
        if(this instanceof KComponent){
            environment_context.gamePlay.KComponents.push(this);
        }else{
            environment_context.gamePlay.kObjects.push(this);
        }
        this.hasStarted=false;
        this.gamePlay=environment_context.gamePlay;
        this.components={}
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
        gamePlay.kObjects=gamePlay.kObjects.slice(pos,1)
    }
}

class KComponent extends KObject{
    constructor(parent,id){
        super();
        this.parent=parent;
        if(id){
            parent.components[id]=this;
        }
    }
    start(){
        super.start();
    }
    tick(delta){
        super.tick(delta);
    }
    destroy(){

        super.destroy();
    }
}

class KCanvasObject extends KObject{
    constructor(){
        super();
        this.$canvas = $("<canvas></canvas>");
        this.$canvas.css("width",this.gamePlay.$window.css("width"));
        this.$canvas.css("height",this.gamePlay.$window.css("height"));
        this.$canvas.attr("height","720px");
        this.$canvas.attr("width","1280px");
        this.width=this.gamePlay.$window.css("width");
        this.height=this.gamePlay.$window.css("height");
        this.width=this.width.split("px")[0];
        this.height=this.height.split("px")[0];
        this.ctx = this.$canvas[0].getContext('2d');
        this.gamePlay.$window.append(this.$canvas);
    }
    start(){
        super.start();
        console.log(this.width)
    }
    tick(delta){
        super.tick(delta);
        
    }
    destroy(){

        super.destroy();
    }

    beginTick(){
        this.ctx.clearRect(0,0,this.width,this.height);
    }
}

//锚点在左上
class KActorObject extends KObject{
    constructor(width,height){
        super();
        this.x=0;
        this.y=0;
        this.width=width;
        this.height=height;
        this.xSpeed=0;
        this.ySpeed=0;
    }
    start(){
        super.start();
    }
    tick(delta){
        super.tick(delta);
        this.x+=this.xSpeed;
        this.y+=this.ySpeed;
    }

    destroy(){

        super.destroy();
    }
}

class KCanvasActorObject extends KActorObject{
    constructor(width,height,canvasObject){
        super(width,height);
        this.ctx=canvasObject.ctx;
    }
    start(){
        super.start();
    }
    tick(delta){
        super.tick(delta);
        this.render();
    }
    render(){
        // this.ctx.fillStyle = 'green';
        // this.ctx.fillRect(this.x,this.y,this.width,this.height);
    }

    destroy(){

        super.destroy();
    }
}

class KGravityComponent extends KComponent{
    constructor(parent,id){
        super(parent,id);
    }
    start(){
        super.start();
    }
    tick(delta){
        super.tick(delta);
        if(this.parent.ySpeed!=undefined){
            if(this.parent instanceof KActorObject){
                this.parent.ySpeed+=0.5;
            }
        }
    }
    destroy(){

        super.destroy();
    }
}

