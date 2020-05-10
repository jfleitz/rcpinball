package router

import (
	"net/http"
	"strconv"

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

	if !cfg.TestMode {
		log.Infoln("Initializing Raspi Ports")
		raspi.Initialize()
		raspi.LeftFlipper = cfg.Game.LeftFlipperPort
		raspi.RightFlipper = cfg.Game.RightFlipperPort
		raspi.UpperLeftFlipper = cfg.Game.UpperLeftFlipperPort
		raspi.UpperRightFlipper = cfg.Game.UpperRightFlipperPort
		raspi.AutoLaunch = cfg.Game.PlungerPort
		raspi.TurnOffSolenoids()
	}

	log.Infoln("Beginning CreateServer()")
	config = *cfg
	router := gin.Default()

	router.Use(static.Serve("/", static.LocalFile("./client/build", true)))

	router.NoRoute(func(c *gin.Context) {
		c.File("./client/build/index.html")
	})

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
	api.GET("/players", getPlayers) //List all players
	//Current game
	api.GET("/games", getGames)       //Game Status (Not Started, Ball 1, 2,3 Complete)
	api.GET("/game/:id", currentGame) //Game Status (Not Started, Ball 1, 2,3 Complete) //Which Player is up

	api.POST("/player/login", authPlayer) //Auth Player (passing playerID and pin)

	/// JAF uncheck api.Use(CheckUser())
	//Active Player control
	api.GET("/button/:buttonID/action/:actionID/player/:userid/pin/:pin", controlFlipper) //If "Playing" and it is your player ID, then allow for control to be passed back (flippers and plunger)
	api.GET("/autolaunch/player/:userid/pin/:pin", autoLaunchBall)

	admin := router.Group("/admin")
	//Admin page
	admin.Use(CheckAdmin())
	admin.GET("/pin/:pin/matchplay/retrieve/:id", retrieveMatchPlay) //Retrieve MatchPlay info (should get arenas and players)
	admin.POST("/pin/:pin/player/:id/pin", setPlayerPin)             //Set Pin ID for a player
	admin.POST("/pin/:pin/game/:id/player", setActivePlayer)         //Set Active Player
	admin.POST("/pin/:pin/game/:id/status", gameStatus)              //Set Active Game Status

	log.Infoln("Hosting on port 3000")

	pool := NewPool()
	go pool.Start()

	api.GET("/socket", func(c *gin.Context) {
		serveWs(pool, c.Writer, c.Request)
	})

	router.Run(":3000")
}

//CheckUser verifies the user id and pin number passed with the request
func CheckUser() gin.HandlerFunc {
	log.Infoln("CheckUser called")

	return func(c *gin.Context) {
		log.Infoln("CheckFunc called")
		user := c.Param("userid")
		pin := c.Param("pin")

		//user := c.Request.FormValue("mpid")
		uid, err := strconv.Atoi(user)
		if err != nil {
			c.AbortWithStatusJSON(400, gin.H{"error": "invalid user id"})
			return
		}

		//pin := c.Request.FormValue("pin_number")

		for _, p := range config.Players {
			if p.MatchPlayID == uid {
				if p.Pin == pin {
					//all good, so exit
					c.Next()
					return
				}
				c.AbortWithStatusJSON(400, gin.H{"error": "pin mismatch"})
				return

			}
		}

		if len(config.Players) == 0 {
			log.Infoln("players is 0")
		}

		c.AbortWithStatusJSON(400, gin.H{"error": "unknown user"})
	}
}

//CheckAdmin verifies the pin id passed to the configured admin pin number
func CheckAdmin() gin.HandlerFunc {
	log.Infoln("CheckAdmin called")

	return func(c *gin.Context) {
		log.Infoln("CheckAdminFunc called")
		pin := c.Param("pin")

		//user := c.Request.FormValue("mpid")
		pinID, err := strconv.Atoi(pin)
		if err != nil {
			c.AbortWithStatusJSON(400, gin.H{"error": "invalid pin number"})
			return
		}

		//pin := c.Request.FormValue("pin_number")
		if pinID != config.AdminPin {
			c.AbortWithStatusJSON(400, gin.H{"error": "admin pin mismatch"})
			return
		}
		c.Next()
	}
}
