//go:build !devmode

package main

const devMode = false

var ApiEndpoint string = "${window.location.protocol}//api.${window.location.hostname}"
