package main

import "github.com/wailsapp/wails/v2/pkg/runtime"

func setupListeners(app *App) {
	runtime.EventsOn(app.ctx, "create_task", func(data ...interface{}) {
		createTask(app, data[0].(string))
	})
	runtime.EventsOn(app.ctx, "update_task_status", func(data ...interface{}) {
		updateTaskStatus(app, data[0].(map[string]interface{}))
	})
	runtime.EventsOn(app.ctx, "delete_task", func(data ...interface{}) {
		deleteTask(app, data[0].(string))
	})
	runtime.EventsOn(app.ctx, "create_task_item", func(data ...interface{}) {
		createTaskItem(app, data[0].(map[string]interface{}))
	})
	runtime.EventsOn(app.ctx, "update_task_item", func(data ...interface{}) {
		updateTaskItemStatus(app, data[0].(map[string]interface{}))
	})
	runtime.EventsOn(app.ctx, "update_task_item_active", func(data ...interface{}) {
		updateTaskItemActive(app, data[0].(map[string]interface{}))
	})
}
