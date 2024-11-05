package main

import "github.com/wailsapp/wails/v2/pkg/runtime"

func setupListeners(app *App) {
	runtime.EventsOn(app.ctx, "create_task", func(data ...interface{}) {
		createTask(app, data[0].(string))
	})
	runtime.EventsOn(app.ctx, "update_task_status", func(data ...interface{}) {
		updateTaskStatus(app, data[0].(map[string]interface{}))
	})
}
