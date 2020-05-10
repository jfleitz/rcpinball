package data

import (
	"fmt"
	"math/rand"
	"time"
)

//Player contains the information about a player listed to play
type Player struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	MatchPlayID int    `json:"-"`
	IsConnected bool   `json:"connected"`
	Pin         string `json:"pin"`
}

/*
   game: {
     name: 'Mike Bossy',
     numberOfPlayers: 4,
     playerUp: '1',
     playerName: 'Joe Doe',
     ballInPlay: 2,
     gameOver: false
   }
*/
//Game is the information for a specific Pinball Machine
type Game struct {
	Name                  string `json:"name"`
	ImageFile             string `json:"-"`
	GameOver              bool   `json:"gameOver"`
	CurrentPlayer         string `json:"playerUp"`
	BallInPlay            string `json:"ballInPlay"`
	NumberOfPlayers       string `json:"numberOfPlayers"`
	LeftFlipperPort       string `json:"leftFlipperPort"`
	RightFlipperPort      string `json:"rightFlipperPort"`
	UpperLeftFlipperPort  string `json:"upperLeftFlipperPort"`
	UpperRightFlipperPort string `json:"upperRightFlipperPort"`
	PlungerPort           string `json:"PlungerPort"`
}

//Configuration is the overall config for the application
type Configuration struct {
	MatchPlayAPIURL string
	TournamentID    string
	AdminPin        int
	TestMode        bool
	Game            Game
	Players         []Player
	PinNumbers      []int
}

//GeneratePin sets the Pin Number for the given player
func (p *Player) GeneratePin() {
	rand.Seed(time.Now().UnixNano())
	p.Pin = fmt.Sprintf("%04d", rand.Intn(9999))

}
