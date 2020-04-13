package main

import (
	"os"

	"github.com/jfleitz/mpremote/pkg/data"
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
	conf.Games = make([]data.Game, 0)

	conf.Games = append(conf.Games, data.Game{Name: "Wizard of Oz", ImageFile: "woz.png", InProgress: false})
	conf.Games = append(conf.Games, data.Game{Name: "Tron", ImageFile: "tron.png", InProgress: false})

	conf.Players = make([]data.Player, 0)
	conf.Players = append(conf.Players, data.Player{Name: "Mario", MatchPlayID: 0, IsConnected: false})
	conf.Players = append(conf.Players, data.Player{Name: "Luigi", MatchPlayID: 1, IsConnected: false})
	viper.Set("Players", conf.Players)
	viper.Set("Games", conf.Games)
	viper.Set("MatchPlayAPIURL", conf.MatchPlayAPIURL)
	viper.SetDefault("TestMode", false)
	viper.AddConfigPath("./")
	viper.WriteConfigAs("./config.yaml")

	log.Infof("Before Reading, players from conf.players: %v", conf.Players)

	err := viper.ReadInConfig()
	if err != nil {
		log.Errorf("Error with Reading in Config: %v", err)
		return
	}

	players := viper.Get("Players")

	log.Infof("Players read: %v", players)

	//reset
	conf.Players = make([]data.Player, 0)

	viper.UnmarshalKey("Players", conf.Players)
	log.Infof("Unmarshall to conf Players read: %v", conf.Players)

}
