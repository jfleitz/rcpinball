package router

import (
	"errors"
	"time"

	log "github.com/sirupsen/logrus"
	"periph.io/x/periph/conn/gpio"
	"periph.io/x/periph/conn/gpio/gpioreg"
	"periph.io/x/periph/host"
	"periph.io/x/periph/host/rpi"
)

//Machine controls the pinball machine from the RPI / GPIO
type Machine struct {
	LeftFlipper       string
	RightFlipper      string
	AutoLaunch        string
	UpperLeftFlipper  string
	UpperRightFlipper string
	LaunchPulseMS     int
	Test              bool
}

const (
	//SolLeft is the left flipper
	SolLeft = iota
	//SolRight is the right flipper
	SolRight
	//SolUpperLeft is the upper left flipper (if there is one)
	SolUpperLeft
	//SolUpperRight is the upper right flipper (if there is one)
	SolUpperRight
	//SolAutoLaunch is the auto launcher
	SolAutoLaunch
)

func initGPIO() error {
	if !rpi.Present() {
		return errors.New("Not running on raspberry pi")
	}

	if _, err := host.Init(); err != nil {
		log.Errorln("gpioAccess:Could not initialize periph gpio")
		return err
	}

	return nil
}

//TurnOffSolenoids turns off all solenoids
func (r *Machine) TurnOffSolenoids() {
	r.SetSolenoid(SolLeft, false)
	r.SetSolenoid(SolRight, false)
	r.SetSolenoid(SolUpperLeft, false)
	r.SetSolenoid(SolUpperRight, false)
	r.SetSolenoid(SolAutoLaunch, false)
}

//Initialize sets up the GPIO host
func (r *Machine) Initialize() error {
	if err := initGPIO(); err != nil {
		log.Errorf("Could not initialize GPIO ports: \n", err)
		return err
	}
	return nil
}

func (r *Machine) launch() {
	defer r.SetSolenoid(SolAutoLaunch, false)

	t := time.NewTicker(20 * time.Millisecond)
	r.SetSolenoid(SolAutoLaunch, true)
	<-t.C

}

//LaunchBall calls a goroutine to autolaunch the ball
func (r *Machine) LaunchBall() {
	go r.launch()
}

//SetSolenoid turns the solenoid by ID on or off
func (r *Machine) SetSolenoid(solID int, On bool) {
	if r.Test {
		log.Debugf("SetSolenoid called: solID: %v, On: %v", solID, On)
		return
	}
	log.Debugf("SetSolenoid called: solID: %v, On: %v\n", solID, On)

	log.Debugf("Solenoids configured: %v,%v,%v,%v,%v\n", r.LeftFlipper, r.RightFlipper, r.UpperLeftFlipper, r.UpperRightFlipper, r.AutoLaunch)

	/*

		if solID == SolAutoLaunch {
			if On {
				gpioreg.ByName(r.AutoLaunch).Out(gpio.High)
			} else {
				gpioreg.ByName(r.AutoLaunch).Out(gpio.Low)
			}

			return
		}
	*/

	output := gpio.High
	if On {
		output = gpio.Low
	}

	switch solID {
	case SolLeft:
		gpioreg.ByName(r.LeftFlipper).Out(output)
	case SolRight:
		gpioreg.ByName(r.RightFlipper).Out(output)
	case SolUpperLeft:
		gpioreg.ByName(r.UpperLeftFlipper).Out(output)
	case SolUpperRight:
		gpioreg.ByName(r.UpperRightFlipper).Out(output)
	case SolAutoLaunch:
		gpioreg.ByName(r.AutoLaunch).Out(output)
	}
}
