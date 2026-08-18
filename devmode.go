//go:build devmode

package main

const devMode = true

var ApiEndpoint string = "${window.location.protocol}//${window.location.hostname}:8080"
