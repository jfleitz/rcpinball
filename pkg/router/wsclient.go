package router

import (
	"encoding/json"
	"fmt"

	log "github.com/sirupsen/logrus"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
}

type Message struct {
	Type int    `json:"type"`
	Body string `json:"body"`
}

type RecMessage struct {
	Name string `json:"name"`
	Data string `json:"data"`
}

type Control struct {
	PlayerID string `json:"playerID"`
	Pin      string `json:"pin"`
	Button   string `json:"button"`
	Action   string `json:"action"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()
	log.Infoln("Message processing 1")
	for {
		log.Infoln("Message processing 2")
		messageType, p, err := c.Conn.ReadMessage()
		log.Infoln("Message processing 3")
		if err != nil {
			log.Println(err)
			return
		}
		log.Infoln("Message processing 123")
		message := Message{Type: messageType, Body: string(p)}
		fmt.Printf("Message Received: %+v\n", message)

		var msg RecMessage
		err = json.Unmarshal([]byte(message.Body), &msg)

		if err != nil {
			log.Printf("Error with unmarshalling: %v", err)
			return
		}

		data := []byte(msg.Data)

		log.Infof("Message Name is: %v", msg.Name)

		switch msg.Name {
		case "action":
			c.action(data)
		case "updatePlayers":
			c.updatePlayers(data)
		case "updateGame":
			c.updateGame(data)
		case "refreshGame":
			c.sendGameStats()
		case "refreshPlayers":
			c.sendPlayerList()
		}

		//c.Pool.Broadcast <- message
	}
}

func (c *Client) action(data []byte) {
	//unmarshall data here too
	var ctl Control
	err := json.Unmarshal(data, &ctl)

	if err != nil {
		log.Printf("Error with unmarshalling: %v", err)
		return
	}

	if !config.TestMode {
		switch ctl.Button {
		case "0":
			raspi.SetSolenoid(SolLeft, ctl.Action == "down")
			raspi.SetSolenoid(SolUpperLeft, ctl.Action == "down")
		case "1":
			raspi.SetSolenoid(SolRight, ctl.Action == "down")
			raspi.SetSolenoid(SolUpperRight, ctl.Action == "down")
		case "plunge":
			raspi.LaunchBall()
		default:
			log.Errorf("Invalid Button case: %v", ctl.Button)
		}
	} else {
		log.Infof("Received PlayerID: %v, Pin: %v, Button: %v, Action: %v ", ctl.PlayerID, ctl.Pin, ctl.Button, ctl.Action)
	}
}

func (c *Client) updatePlayers(data []byte) {
	//unmarshall data here too

	err := json.Unmarshal(data, &config.Players)

	if err != nil {
		log.Printf("Error with unmarshalling: %v", err)
		return
	}

	c.sendPlayerList()
}

func (c *Client) updateGame(data []byte) {
	//unmarshall data here too
	err := json.Unmarshal(data, &config.Game)

	if err != nil {
		log.Printf("Error with unmarshalling: %v", err)
		return
	}

	//log.Infof("Received PlayerID: %v, Pin: %v, Button: %v, Action: %v ", ctl.PlayerID, ctl.Pin, ctl.Button, ctl.Action)

	c.sendGameStats()
}

func (c *Client) sendGameStats() {
	log.Infoln("SendGameStats called")

	//send gameState
	b, err := json.Marshal(config.Game)

	if err != nil {
		log.Printf("Error with unmarshalling. Not sending gamestats: %v", err)
		return
	}

	var msg RecMessage
	msg.Data = string(b)
	msg.Name = "gamestate"

	//send gameState
	b, err = json.Marshal(msg)
	if err != nil {
		log.Printf("Error with marshing the message to send for game stats: %v", err)
		return
	}

	c.Pool.Broadcast <- msg
}

func (c *Client) sendPlayerList() {

	log.Infoln("SendPlayerList called")
	//send gameState
	b, err := json.Marshal(config.Players)

	if err != nil {
		log.Printf("Error with marshalling. Not sending players: %v", err)
		return
	}

	var msg RecMessage
	msg.Data = string(b)
	msg.Name = "players"

	//send gameState
	b, err = json.Marshal(msg)
	if err != nil {
		log.Printf("Error with marshing the message to send for player list: %v", err)
		return
	}

	//message := Message{Type: websocket.TextMessage, Body: string(b)}

	c.Pool.Broadcast <- msg
}
