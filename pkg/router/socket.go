package router

import (
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"

	"github.com/gorilla/websocket"
)

/*
type gameStats struct {
	GameOver   bool          `json:"gameOver"`
	BallInPlay int           `json:"ballInPlay"`
	PlayerUp   int           `json:"playerUp"`
	Players    []data.Player `json:"players"`
}
*/

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	//	CheckOrigin:     func(r *http.Request) bool { return true },
}

func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	conn, err := wsupgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return conn, nil
}

func serveWs(pool *Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket Endpoint Hit")
	conn, err := Upgrade(w, r)
	if err != nil {
		log.Infoln("Error from serveWS")
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}
