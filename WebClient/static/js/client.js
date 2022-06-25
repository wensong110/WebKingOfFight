class Client{
    constructor(){}
    connectToServerDebug(url){
        if(Client.ws){
            this.ws=Client.ws;
            return;
        }
        this.ws = new WebSocket("ws://"+url)
        Client.ws=this.ws;
        this.ws.onopen = function(){
            console.log("连接成功");
            sendToServer(JSON.stringify(makeAPlayerOptions(1,[])))
        }
        this.ws.onmessage = function(e){
            console.log(e)
        }
    }

    connectToServer(url,f){
        this.ws = new WebSocket("ws://"+url)
        this.ws.onopen = function(){
            console.log("连接成功");
        }
        this.ws.onmessage = f
    }

    sendToServer(data){
        if(this.ws) this.ws.send(data)
    }

}


function makeAOption(key,option){
    return {
        Key:key,
        Option:option
    }
}

function makeAPlayerOptions(index,arr){
    return {
        PlayerIndex:index,
        Options:arr
    }
}