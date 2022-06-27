package main

import (
	"context"
	"fmt"
	"net/http"

	"KOFServer"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {

	server := KOFServer.NewServer()
	http.HandleFunc("/server", func(w http.ResponseWriter, r *http.Request) {
		theCon, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			fmt.Println(err)
			return
		}
		server.AddConn(theCon)
	})
	var playerIndexCnt int = 0
	http.HandleFunc("/getPlayerIndex", func(w http.ResponseWriter, r *http.Request) {
		str := fmt.Sprintf("{ index: %d }", playerIndexCnt)
		playerIndexCnt++
		w.Write([]byte(str))
	})
	server.StartTick(context.Background())
	http.ListenAndServe(":8888", nil)
}
