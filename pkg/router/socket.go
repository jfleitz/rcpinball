package router

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type gameStats struct {
	GameOver   bool `json:"gameOver"`
	BallInPlay int  `json:"ballInPlay"`
	PlayerUp   int  `json:"playerUp"`
}

var clients = make(map[int]*websocket.Conn) //keeping track of who is connected.
var statsUpdate = make(chan *gameStats)

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func socketHandle(c *gin.Context) {
	conn, err := wsupgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Printf("Failed to set websocket upgrade: %+v", err)
		return
	}
	player := 1 //TODO substitute this for the actual player. (check pin again too)
	clients[player] = conn

	/*
		for {

			t, msg, err := conn.ReadMessage()
			if err != nil {
				break
			}
			conn.WriteMessage(t, msg)
		}
	*/
}

func statsRoutine() {
	for {
		val := <-statsUpdate
		toSend, _ := json.Marshal(val)
		// send to every client that is currently connected
		for i, client := range clients {

			err := client.WriteMessage(websocket.TextMessage, []byte(toSend))
			if err != nil {
				log.Printf("Websocket error: %s", err)
				client.Close()
				delete(clients, i)
			}
		}
	}
}
