package KOFServer

import (
	"context"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func TestServer(t *testing.T) {

	server := NewServer()
	http.HandleFunc("/server", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("!!!")
		theCon, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			fmt.Println(err)
			return
		}
		go func(con *websocket.Conn) {
			for {
				var playerOptions PlayerOptions
				con.ReadJSON(&playerOptions)
				fmt.Println(playerOptions)
			}
		}(theCon)
	})
	go http.ListenAndServe(":8888", nil)
	ctx, _ := context.WithTimeout(context.Background(), time.Second*100)
	server.StartTick(ctx)
	time.Sleep(time.Second * 100)
}
