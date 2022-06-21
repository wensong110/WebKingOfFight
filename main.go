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
	server.StartTick(context.Background())
	http.ListenAndServe(":8888", nil)
}
