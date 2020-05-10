package router

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jfleitz/mpremote/pkg/data"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

// getPlayers retrieves the list of players in the tournament
func getPlayers(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, config.Players)
}

type usr struct {
	UserID string `json:"user"`
	PinID  string `json:"pin"`
}

// authPlayer authorizes the player in the tournament
func authPlayer(c *gin.Context) {

	c.Header("Content-Type", "application/json")
	usr := usr{}
	err := c.BindJSON(&usr)
	if err != nil {
		log.Infof("Error was: %v", err)
	}

	log.Infof("12 UserID is: %v, pin is %v\n", usr.UserID, usr.PinID)

	for i, player := range config.Players {
		if player.ID == usr.UserID {
			if player.Pin == usr.PinID {
				log.Infoln("user and pin match\n")

				//logged in
				c.JSON(http.StatusOK, gin.H{
					"loggedIn": true,
				})

				config.Players[i].IsConnected = true

			} else {
				//not logged in
				log.Infoln("user and pin do not match\n")

				config.Players[i].IsConnected = false
				c.JSON(http.StatusUnauthorized, gin.H{
					"error":    "invalid pin",
					"loggedIn": false,
				})

			}

			return
		}

	}

	log.Infoln("user and pin not found\n")
	c.JSON(http.StatusUnauthorized, gin.H{
		"error": "user not found",
		"ok":    false,
	})
}

// getGames retrieves the list of games in the tournament
func getGames(c *gin.Context) {
	log.Infoln("Called getGames()")
	//log.Infof("****Total Players %v \n", len(config.Players))

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, config.Game)
}

// currentGame retrieves the current game
func currentGame(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{
		"message": "not implemented",
	})
}

func autoLaunchBall(c *gin.Context) {
	playerID := c.Param("playerID")
	log.Infof("autoLaunch called!  playerID: %v\n", playerID)

	raspi.LaunchBall()
}

// controlGame for the game, player passed.. passes the action on to the actual game
func controlFlipper(c *gin.Context) {
	buttonID := c.Param("buttonID")
	actionID := c.Param("actionID")
	playerID := c.Param("playerID")
	log.Infof("controlGame called! buttonID: %v, actionID: %v, playerID: %v\n", buttonID, actionID, playerID)
	sol, err := strconv.Atoi(buttonID)
	if err != nil {
		log.Errorf("Button not valid %v, error:", buttonID, err)
		c.Header("Content-Type", "application/json")
		c.JSON(http.StatusOK, gin.H{
			"message": err,
		})
		return
	}

	raspi.SetSolenoid(sol, actionID == "1")
	/*	c.Header("Content-Type", "application/json")
		c.JSON(http.StatusOK, gin.H{
			"message": "not implemented",
		})*/
}

// retrieveMatchPlay retrieves matchplay info
func retrieveMatchPlay(c *gin.Context) {
	log.Infoln("Retrieving MatchPlay info")
	config.Players = make([]data.Player, 0)
	mpID := c.Param("id")
	matchplayID, err := strconv.Atoi(mpID)

	if err != nil {
		log.Errorf("MatchPlay ID not valid %v, error:", mpID, err)
		c.Header("Content-Type", "application/json")
		c.JSON(http.StatusOK, gin.H{
			"message": err,
		})
		return
	}
	log.Infof("MatchPlayID is %v", matchplayID)
	m, err := data.GetMatchPlayInfo(matchplayID)

	for _, p := range m.Players {
		player := data.Player{Name: p.Name, MatchPlayID: p.PlayerID}
		player.GeneratePin()
		config.Players = append(config.Players, player)
	}

	log.Infof("Players loaded %v \n", len(config.Players))
	viper.SetConfigType("yaml")
	viper.Set("Players", config.Players)
	log.Infoln("Writing config file")
	err = viper.WriteConfigAs("./config.yaml")
	if err != nil {
		log.Infof("Error writing config file %v", err)
	}
}

// setPlayerPin sets the pin id for the player
func setPlayerPin(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{
		"message": "not implemented",
	})
}

// setActivePlayer sets the player that is up for the game
func setActivePlayer(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{
		"message": "not implemented",
	})
}

// gameStatus sets the status of the game, (not started, what ball, game over etc)
func gameStatus(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{
		"message": "not implemented",
	})
}

// authMiddleware intercepts the requests, and check for a valid jwt token
func authCheck() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the client secret key
		//err := jwtMiddleWare.CheckJWT(c.Writer, c.Request)
		//if err != nil {
		// Token not found
		//fmt.Println(err)
		//c.Abort()
		//c.Writer.WriteHeader(http.StatusUnauthorized)
		//c.Writer.Write([]byte("Unauthorized"))
		//return
		//}
	}
}
