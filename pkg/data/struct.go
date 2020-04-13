package data

import (
	"fmt"
	"math/rand"
	"time"
)

//Player contains the information about a player listed to play
type Player struct {
	Name        string
	MatchPlayID int
	IsConnected bool
	Pin         string
}

//Game is the information for a specific Pinball Machine
type Game struct {
	Name                  string
	ImageFile             string
	InProgress            bool
	CurrentPlayer         int
	BallInPlay            int
	LeftFlipperPort       string
	RightFlipperPort      string
	UpperLeftFlipperPort  string
	UpperRightFlipperPort string
	PlungerPort           string
}

//Configuration is the overall config for the application
type Configuration struct {
	MatchPlayAPIURL string
	TournamentID    string
	TestMode        bool
	Games           []Game
	Players         []Player
	PinNumbers      []int
}

//GeneratePin sets the Pin Number for the given player
func (p *Player) GeneratePin() {
	rand.Seed(time.Now().UnixNano())
	p.Pin = fmt.Sprintf("%04d", rand.Intn(9999))

}
