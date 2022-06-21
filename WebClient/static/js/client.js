var ws
function connectToServer(url){
    ws = new WebSocket("ws://"+url)
    ws.onopen = function(){
        console.log("连接成功");
        sendToServer(JSON.stringify(makeAPlayerOptions(1,[])))
    }
    ws.onmessage = function(e){
        console.log(e)
    }
}

function sendToServer(data){
    if(ws) ws.send(data)
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