package router

import (
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"

	"github.com/gorilla/websocket"
)

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

//Upgrade attemtps to upgrade the http connection to a websocker
func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	conn, err := wsupgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return conn, nil
}

func serveWs(pool *Pool, w http.ResponseWriter, r *http.Request) {
	conn, err := Upgrade(w, r)
	if err != nil {
		log.Errorf("Error from serveWS: %v", err)
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}
