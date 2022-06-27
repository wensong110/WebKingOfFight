class Inputer{
    constructor(owner){
        this.owner=owner;
        this.fMap={}
    }

    addFunction(key,f){
        this.fMap[key]=f;
    }

    inKey(key){
        if(this.fMap[key]){
            return this.fMap[key].bind(this.owner)();
        }
    }

}

class KeyBoardInputer extends Inputer{
    constructor(owner){
        super(owner)
    }

    addFunction(key,f,event){
        super.addFunction(key+event,f);
        document.addEventListener(event,function(e){
            if(e.key==key) this.inKey(key+event);
        })
    }

    inKey(key){
        return super.inKey(key);
    }



}


class KeyBoardSendInputer extends Inputer{
    constructor(owner,playerIndex){
        super(owner);
        this.client=new Client();
        this.playerIndex=playerIndex;
        this.buffer=[];
        environment_context.gamePlay.kObjects.push(this);
    }

    addFunction(key,event,option){
        var p=this;
        document.addEventListener(event,function(e){
            if(e.key==key) p.inKey(key+event,option);
        })
    }

    inKey(key,option){
        this.buffer.push(makeAOption(key,option));
    }

    start(){

    }

    tick(delta){
        if(this.buffer.length!=0){
            this.client.sendToServer({
                PlayerIndex:this.playerIndex,
                Options:this.buffer,
            })
            this.buffer=[];
        }
    }

    destroy(){

    }
}

class NetworkInputer extends Inputer{
    constructor(owner){
        super(owner)
        this.client=new Client();
        this.fOwner={};
    }

    addFunction(owner,option,index,f){
        let id = index*10000+option;
        super.addFunction(id,f);
        this.fOwner[id]=owner;
    }

    inKey(option){
        return super.inKey(option);
    }

    init(url){
        var fMap=this.fMap;
        var fOwner=this.fOwner;
        this.client.connectToServer(url,function(ee){
            let e = JSON.parse(ee.data);
            //console.log(ee.data);
            for(let i=0;i<e.Input.length;i++){
                let playerOption=e.Input[i];
                for(let op of playerOption.Options){
                    if(fMap[playerOption.PlayerIndex*10000+op.Option]){
                        fMap[playerOption.PlayerIndex*10000+op.Option].bind(fOwner[playerOption.PlayerIndex*10000+op.Option])();
                    }
                }
                break;
            }
        });
    }
    

}