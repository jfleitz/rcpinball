package router

import (
	"net/http"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/jfleitz/mpremote/pkg/data"
	log "github.com/sirupsen/logrus"
)

var config data.Configuration
var raspi Machine

//CreateServer creates the gin server to serve the api calls etc.
func CreateServer(cfg *data.Configuration) {
	raspi.Test = cfg.TestMode

	if cfg.TestMode {
		log.Infoln("Initializing Raspi Ports")
		raspi.Initialize()
		raspi.LeftFlipper = cfg.Games[0].LeftFlipperPort
		raspi.RightFlipper = cfg.Games[0].RightFlipperPort
		raspi.UpperLeftFlipper = cfg.Games[0].UpperLeftFlipperPort
		raspi.UpperRightFlipper = cfg.Games[0].UpperRightFlipperPort
		raspi.AutoLaunch = cfg.Games[0].PlungerPort
		raspi.TurnOffSolenoids()
	}

	log.Infoln("Beginning CreateServer()")
	config = *cfg
	router := gin.Default()

	router.Use(static.Serve("/", static.LocalFile("./client/build", true)))
	api := router.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status": "ok",
			})
		})

	}

	//API calls needed:
	//Players
	api.GET("/players", getPlayers)                //List all players
	api.POST("/players/:id/auth/:pin", authPlayer) //Auth Player (passing playerID and pin)

	//Current game
	api.GET("/games", getGames)       //Game Status (Not Started, Ball 1, 2,3 Complete)
	api.GET("/game/:id", currentGame) //Game Status (Not Started, Ball 1, 2,3 Complete) //Which Player is up

	//Active Player control
	api.GET("/button/:buttonID/action/:actionID/player/:playerID", controlFlipper) //If "Playing" and it is your player ID, then allow for control to be passed back (flippers and plunger)
	api.GET("/autolaunch/player/:playerID", autoLaunchBall)

	//Admin page
	api.GET("/admin/matchplay/retrieve/:id", retrieveMatchPlay) //Retrieve MatchPlay info (should get arenas and players)
	api.POST("/admin/player/:id/pin", setPlayerPin)             //Set Pin ID for a player
	api.POST("/admin/game/:id/player", setActivePlayer)         //Set Active Player
	api.POST("/admin/game/:id/status", gameStatus)              //Set Active Game Status

	log.Infoln("Hosting on port 3000")
	router.Run(":3000")
}
