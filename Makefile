BIN_NAME = bin/mpremote

export GO111MODULE := on
export CGO_ENABLED := 0
export GOOS := linux


build:
	@go build -a -o $(BIN_NAME) cmd/server/main.go

util:
	@go build -a -o bin/util cmd/util/main.go

#rpi_parm:
#	BIN_NAME = rpi/mpremote 
#	export GOARCH := arm GOARM:=6

build_rpi:
	@echo "Building for Raspberry PI"
	env GOARCH=arm GOARM=7 GOOS=linux go build -a -o rpi/mpremote cmd/server/main.go

deps:
	@go mod download

clean:
	@rm -f ./bin/*

all: clean deps build

client:
	cd client; npm run build

upload:
	scp -r client/build pi@weakflipper:./client/
	scp rpi/mpremote pi@weakflipper:.

.PHONY: client clean build all deps upload
