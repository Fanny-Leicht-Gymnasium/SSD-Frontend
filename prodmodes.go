//go:build !devmode

package main

import (
	"bytes"
	"os"
)

const devMode = false

var ApiEndpoint = "${window.location.protocol}//api.${window.location.hostname}"

// BuildVersion can be supplied with:
// go build -ldflags "-X main.BuildVersion=1.2.3"
var BuildVersion = "prod"

func getBuildVersion() (string, error) {
	version, err := os.ReadFile("./html/.version")
	if err != nil {
		return "", err
	}

	return string(bytes.TrimSpace(version)), nil
}
