package main

import "github.com/wailsapp/wails/v2/pkg/runtime"

func setupListeners(app *App) {
	runtime.EventsOn(app.ctx, "create_task", func(data ...interface{}) {
		createTask(app, data[0].(string))
	})
}
