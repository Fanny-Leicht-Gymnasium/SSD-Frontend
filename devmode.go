//go:build devmode

package main

import (
	"crypto/sha256"
	"encoding/hex"
	"os"
	"path/filepath"
)

const devMode = true

var ApiEndpoint string = "${window.location.protocol}//${window.location.hostname}:8080"

var BuildVersion = "devmode"

func getBuildVersion() (string, error) {
	hash := sha256.New()

	err := filepath.Walk("./html", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() || info.Name() == ".version" {
			return nil
		}

		relativePath, err := filepath.Rel("./html", path)
		if err != nil {
			return err
		}

		hash.Write([]byte(relativePath))

		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		hash.Write(data)

		return nil
	})

	if err != nil {
		return "", err
	}

	return hex.EncodeToString(hash.Sum(nil))[:12], nil
}
