
class KAnimationStatusMechineComponent extends KComponent{
    constructor(parent,id){
        super(parent,id);
        if(parent.ctx){
            this.ctx=parent.ctx;
        }
        this.nodes={};
        this.edges=[];
        this.nowStatusTickCnt=0;
        this.status="init";
    }

    addNode(statusId,statusAnim){
        if(this.nodes[statusId]) return false;
        this.nodes[statusId]=statusAnim;
    }

    removeNode(statusId){
        delete this.nodes.statusId;
    }

    addEdge(fromId,toId,f,fthis){
        let tmpThis;
        if(fthis){
            tmpThis=fthis;
        }else{
            tmpThis=this;
        }
        this.edges.push({
            fromId:fromId,
            toId:toId,
            f:f,
            fthis:tmpThis
        })
    }

    start(){
        super.start();
    }

    tick(delta){
        let flag = true;
        let nxtStatus=this.status;
        let loopCnt=0;
        while(flag){
            loopCnt++;
            if(loopCnt>=100) break;
            flag=false;
            for(let e of this.edges){
                if(e.fromId!=this.status){
                    continue;
                }
                if(e.f.bind(e.fthis)()){
                    nxtStatus=e.toId;
                    flag=true;
                    break;
                }
            }
        }
        if(this.status!=nxtStatus){
            this.nowStatusTickCnt=0;
            this.sumTime=0;
            this.finish=false;
        }else{
            this.nowStatusTickCnt++;
            this.sumTime+=delta;
        }
        this.status=nxtStatus;
        if(this.status!="init") this.rendNow(this.nodes[this.status],this.nowStatusTickCnt,this.sumTime);
    }

    rendNow(statusAnim,time){
        if(this.parent instanceof KActorObject){
            let ctx=this.ctx;
            let gif=statusAnim.gif;
            if(statusAnim.load){
                let frameCnt=(time)/(statusAnim.totalTime/gif.frames.length)%gif.frames.length;
                frameCnt=parseInt(frameCnt);
                if(statusAnim.signal[frameCnt]){
                    for(let f of statusAnim.signal[frameCnt]){
                        f();
                    }
                }
                ctx.drawImage(gif.frames[frameCnt].image,this.parent.x+statusAnim.offsetX,this.parent.y+statusAnim.offsetY,gif.image.width*statusAnim.scaleX,gif.image.height*statusAnim.scaleY);
                if(frameCnt==gif.frames.length){
                    this.finish=true;
                }
            }
        }
    }

    destroy(){
        super.destroy();
    }

}

class Animation{
    constructor(url,totalTime,offsetX,offsetY,scaleX,scaleY){
        this.url=url;
        this.totalTime=totalTime;
        this.signal={};
        this.gif = new GIF();
        let outer=this;
        this.load=false;
        this.gif.onload=function(){
            outer.load=true;
        }
        this.gif.load(url);
        if(offsetX){
            this.offsetX=offsetX;
        }else{
            this.offsetX=0;
        }
        if(offsetY){
            this.offsetY=offsetY;
        }else{
            this.offsetY=0;
        }
        if(scaleX){
            this.scaleX=scaleX;
        }else{
            this.scaleX=1;
        }
        if(scaleY){
            this.scaleY=scaleY;
        }else{
            this.scaleY=1;
        }
    }

    addSignal(frameCnt,f){
        if(!this.signal[frameCnt]){
            this.signal[frameCnt]=[];
        }
        this.signal[frameCnt].push(f);
    }


}