package KOFServer

import (
	"context"
	"fmt"
	"sync"

	"github.com/gorilla/websocket"
)

type Server struct {
	timer      *Timer
	_mutex     sync.Mutex
	connects   []*websocket.Conn
	logicFrame *LogicFrame
}

func NewServer() *Server {
	return &Server{
		timer:      NewTimer(16),
		_mutex:     sync.Mutex{},
		connects:   make([]*websocket.Conn, 0),
		logicFrame: NewLogicFrame(),
	}
}

func (server *Server) AddConn(conn *websocket.Conn) context.CancelFunc {
	server._mutex.Lock()
	defer server._mutex.Unlock()
	server.connects = append(server.connects, conn)
	ctx, cancel := context.WithCancel(context.Background())
	go server.handleFunc(conn, ctx)
	return cancel
}

func (server *Server) handleFunc(conn *websocket.Conn, ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
			for {
				var playerOptions PlayerOptions
				// _, bytes, err := conn.ReadMessage()
				// if err != nil {
				// 	fmt.Printf("读取出错:%v\n", err)
				// 	return
				// }
				// fmt.Println(string(bytes))
				// fmt.Println("=====")
				err := conn.ReadJSON(&playerOptions)
				if err != nil {
					fmt.Printf("读取出错:%v\n", err)
					server._mutex.Lock()
					j := 0
					for _, v := range server.connects {
						if v != conn {
							server.connects[j] = v
							j++
						}
					}
					server.connects = server.connects[:j]
					server._mutex.Unlock()
					return
				}
				//fmt.Println(playerOptions)
				server.addPlayerOptionsToFrame(&playerOptions)
			}
		}
	}
}

func (server *Server) Close() {
	for _, x := range server.connects {
		x.Close()
	}
}

func (server *Server) addPlayerOptionsToFrame(playerOptions *PlayerOptions) {
	server._mutex.Lock()
	defer server._mutex.Unlock()
	server.logicFrame.CollectPlayerOptions(playerOptions)
}

func (server *Server) StartTick(ctx context.Context) {
	timerCtx, _ := context.WithCancel(ctx)
	server.timer.Start(timerCtx)
	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			default:
				server.timer._mutex.Lock()
				server.timer.cond.Wait()
				server.timer._mutex.Unlock()
				server._mutex.Lock()
				if len(server.logicFrame.Input) > 0 {
					for _, x := range server.connects {
						err := x.WriteJSON(server.logicFrame)
						if err != nil {
							fmt.Printf("写入错误:%v\n", err)
							server._mutex.Lock()
							j := 0
							for _, v := range server.connects {
								if v != x {
									server.connects[j] = v
									j++
								}
							}
							server.connects = server.connects[:j]
							server._mutex.Unlock()
							return
						}
					}
					server.logicFrame = NewLogicFrame()
				}
				server._mutex.Unlock()
			}
		}
	}()
}
