# Why
Yes there is major latency issues in this style, but that is completely fine when the goal is to provide fun in a quarantined environment. 

Bonus Fun tournament at RecBar anyone? Same goal.

This was inspired by the first ReplayFX, where they had a webcam on a pinball machine playfield, with the flipper buttons mounted in front of a screen (where you can't see the playfield). My brother, Antz (from Zanzabar) and I had a blast playing it when we weren't working the Retro Trivia booth.

# How this works
Basically, there is a shared webcam on the playfield, a Raspberry PI that is used as a webserver that also interfaces with the flipper buttons and the plunger.

1. The owner of the game is the game director, and adds players into the config or through the admin screen.
2. Players join the same video conference call (use Zoom, whatever), and they contact the tournament director.
3. Players then get instructed to go to the URL that is publically available to the Raspberry PI from any device. Mobile would prob be the best experience.
4. The Player will be given a list of players, where they choose who they are. They will then need to enter a PIN number that was given to just them from the game director
5. Once the player's turn is up, the Player will be given the oppurtunity to control the plunger or flippers.

## Wiring the rpi into the machine
The game chosen is a Wizard of Oz pinball machine by Jersey Jack pinball, because there is "No place like home" during a pandemic. A relay board was used for interfacing with the flipper buttons to the raspberry PI. The flipper buttons themselves on the WOZ machine deliver low current to the driver board in the pinball machine, which board mounted relays can easily handle this. 

For the auto launch, that is a different story. The solenoid for the auto launch can draw approx 20 amps (assuming 70volts with a 4ohm coil), which a board mount relay typically can not handle this. To effectively control this in an isolated fashion, an N-Channel Mosfet was hard wired into the opto-isolator output of the relay board to ground the control side of the auto launch solenoid. You may not want to try this at home, as you can damage your machine (and burn coils)!

## Other notes / why things were chosen
1. Used Go language for the backend, as Go is portable, can cross compile, and is fun.
2. React was chosen mainly because we use React for our product, Critical Stack, at work, which I wanted to learn how react works.
3. Relay board, Mosfet, etc. was chosen because I had them laying around

### packages reqd:
npm install react-scripts@2.1.8

### for debugging with npm, max files had to be set in local deskop Linux
Settings max open files:
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
