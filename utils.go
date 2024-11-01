package main

import (
	"os/user"
	"runtime"
)

func (a *App) GetPC() interface{} {
	user, err := user.Current()
	username := user.Username
	platform := runtime.GOOS

	if err != nil {
		username = "Anonymous user"
	}

	return map[string]string{
		"user":   username,
		"system": platform,
	}
}
