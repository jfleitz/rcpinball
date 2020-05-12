package main

import (
	"fmt"
	"os"

	"github.com/jfleitz/rcpinball/pkg/data"
	"github.com/jfleitz/rcpinball/pkg/router"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

func init() {
	log.SetOutput(os.Stdout)
	log.SetLevel(log.DebugLevel)
}

var conf data.Configuration

func main() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %s", err))
	}

	viper.Unmarshal(&conf)
	log.Infof("Admin pin is: \n", conf.AdminPin)
	log.Infof("Game configured is: %v", conf.Game.Name)
	router.CreateServer(&conf)
}
