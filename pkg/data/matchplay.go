package data

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

//MatchPlayEvents holds matchplay info
type MatchPlayEvents struct {
	TournamentID  int    `json:"tournament_id"`
	Name          string `json:"name"`
	Type          string `json:"type"`
	Status        string `json:"status"`
	URLLabel      string `json:"url_label"`
	Start         string `json:"start"`
	PointsMap     string `json:"points_map"`
	Test          int    `json:"test"`
	GamesPerRound int    `json:"games_per_round"`
	Players       []struct {
		PlayerID   int    `json:"player_id"`
		UserID     int    `json:"user_id"`
		ClaimedBy  int    `json:"claimed_by"`
		IfpaID     int    `json:"ifpa_id"`
		Name       string `json:"name"`
		Status     string `json:"status"`
		Tournament struct {
			TournamentID int         `json:"tournament_id"`
			Status       string      `json:"status"`
			Seed         interface{} `json:"seed"`
		} `json:"tournament"`
	} `json:"players"`
	Arenas []struct {
		ArenaID    int    `json:"arena_id"`
		Name       string `json:"name"`
		Status     string `json:"status"`
		Tournament struct {
			TournamentID int    `json:"tournament_id"`
			Status       string `json:"status"`
		} `json:"tournament"`
	} `json:"arenas"`
}

//MPResults are the results from the matchplay tournament
type MPResults []struct {
	RoundID      int    `json:"round_id"`
	TournamentID int    `json:"tournament_id"`
	Status       string `json:"status"`
	Games        []struct {
		GameID  int         `json:"game_id"`
		ArenaID int         `json:"arena_id"`
		BankID  interface{} `json:"bank_id"`
		Status  string      `json:"status"`
		Players []struct {
			PlayerID  int    `json:"player_id"`
			UserID    int    `json:"user_id"`
			ClaimedBy int    `json:"claimed_by"`
			IfpaID    int    `json:"ifpa_id"`
			Name      string `json:"name"`
			Status    string `json:"status"`
			Game      struct {
				GameID int `json:"game_id"`
				Index  int `json:"index"`
			} `json:"game"`
		} `json:"players"`
		Results []struct {
			ResultID int         `json:"result_id"`
			PlayerID int         `json:"player_id"`
			Points   string      `json:"points"`
			Score    interface{} `json:"score"`
			Bye      bool        `json:"bye"`
		} `json:"results"`
	} `json:"games"`
}

//GetMatchPlayInfo gets the matchplay players for the mp tournament id
func GetMatchPlayInfo(tournamentID int) (mpTournament MatchPlayEvents, err error) {
	//Get MatchPlay players
	//For each Player, query IFPA to see if they are included as well as their raiting,ranking, and current points
	//Calculate Base value

	//Calculate the TGP for the Matchplay Tourney
	//Determine what the est worth of the tournament is.
	//Spit out the

	url := fmt.Sprintf("https://matchplay.events/data/tournaments/%d", tournamentID)

	// Build the request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatal("NewRequest: ", err)
		return mpTournament, err
	}

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		log.Fatal("Do: ", err)
		return mpTournament, err
	}

	defer resp.Body.Close()

	var record MatchPlayEvents

	err = json.NewDecoder(resp.Body).Decode(&record)

	if err != nil {
		log.Println(err)
		return mpTournament, err
	}

	return record, nil
}
