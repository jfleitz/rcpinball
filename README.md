# Why
Yes there is major latency issues in this style, but that is completely fine when the goal is to provide fun in a quarantined environment. 
Bonus Fun tournament at RecBar anyone? Same goal.

This was inspired by the first ReplayFX, where they had a webcam on a pinball machine playfield, with the flipper buttons mounted in front of a screen (where you can't see the playfield). My brother, Antz and I had a blast playing it when we weren't working the Retro Trivia booth.

# How this works
Basically, there is a shared webcam on the playfield, a Raspberry PI that is used as a webserver that also interfaces with the flipper buttons and the plunger (Later on that).

1. The Tournament Director sets up a MatchPlay tournament like they always do. Areanas shoulld only be the pinball machines that are connected up to the RPI.
2. Players join the same video conference call (use Zoom, whatever), and they contact the tournament director.
3. Players then get instructed to go to the URL that is publically available to the Raspberry PI from any device. Mobile would prob be the best experience.
4. The Player will be given a list of MatchPlay players, where they choose who they are. They will then need to enter a PIN number that was given to just them from the Tournament Director
5. Once the player's turn is up, the Player will be given the oppurtunity to control the plunger or flippers.




You first setup a MatchPlay tournament. It doesn't matter the format etc, but 



## Links to building this:
https://dev.to/codehakase/building-a-web-app-with-go-gin-and-react-5ke
