package main

import (
	"os"

	"github.com/jfleitz/rcpinball/pkg/data"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

func init() {
	log.SetOutput(os.Stdout)
	log.SetLevel(log.InfoLevel)
}

func main() {
	viper.SetConfigType("yaml")

	var conf data.Configuration
	conf.MatchPlayAPIURL = "https://matchplay.api.com"
	conf.Game = data.Game{Name: "Wizard of Oz", ImageFile: "woz.png", GameOver: true}
	//conf.Games = append(conf.Games, data.Game{Name: "Tron", ImageFile: "tron.png", InProgress: false})

	conf.Players = make([]data.Player, 0)
	conf.Players = append(conf.Players, data.Player{Name: "Mario", MatchPlayID: 0, IsConnected: false})
	conf.Players = append(conf.Players, data.Player{Name: "Luigi", MatchPlayID: 1, IsConnected: false})
	viper.Set("Players", conf.Players)
	viper.Set("Game", conf.Game)
	viper.Set("MatchPlayAPIURL", conf.MatchPlayAPIURL)
	viper.SetDefault("TestMode", false)
	viper.AddConfigPath("./")
	viper.WriteConfigAs("./config.yaml")
}
