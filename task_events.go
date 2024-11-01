package main

import (
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Task struct {
	ID           int
	Name         string
	Content      string
	Status       int
	CreatedAt    time.Time
	UpdatedAt    time.Time
	CreatedAtStr string
	UpdatedAtStr string
}

func (a *App) GetTasks(status int) []Task {
	rows, err := a.db.Query("SELECT id, name, content, status, created_at AS created_at, updated_at FROM task WHERE status = ?", status)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var task Task

		if err := rows.Scan(&task.ID, &task.Name, &task.Content, &task.Status, &task.CreatedAt, &task.UpdatedAt); err != nil {
			runtime.LogError(a.ctx, err.Error())
			return nil
		}

		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		return nil
	}

	for i, task := range tasks {
		tasks[i].CreatedAtStr = task.CreatedAt.Format("02/01/2006 15:04")
		tasks[i].UpdatedAtStr = task.UpdatedAt.Format("02/01/2006 15:04")
	}

	return tasks
}

func createTask(app *App, name string) {
	if name != "" {
		app.db.Exec("INSERT INTO task (name) VALUES (?)", name)
	}
	runtime.EventsEmit(app.ctx, "reload_tasks")
}

func updateTask(app *App) {

}
