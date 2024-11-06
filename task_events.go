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
	TotalTasks   int
}

type TaskItem struct {
	ID           int
	Name         string
	Content      string
	Status       int
	CreatedAt    time.Time
	UpdatedAt    time.Time
	CreatedAtStr string
	UpdatedAtStr string
	TotalTasks   int
}

func (a *App) GetTasks(status int) []Task {
	rows, err := a.db.Query(`SELECT T.id, T.name, T.status, T.created_at AS created_at, T.updated_at,
						(SELECT COUNT(*) FROM task_item AS TI WHERE T.id = TI.task_id) AS total_tasks
						FROM task AS T
						WHERE status = ?`, status)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var task Task

		if err := rows.Scan(&task.ID, &task.Name, &task.Content, &task.Status, &task.CreatedAt, &task.UpdatedAt, &task.TotalTasks); err != nil {
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

func (a *App) getTaskItems(id string) []TaskItem {
	return nil
}

func createTask(app *App, name string) {
	if name != "" {
		stmt, err := app.db.Prepare("INSERT INTO task (name) VALUES (?)")
		if err != nil {
			runtime.LogError(app.ctx, "Error creating task -> "+err.Error())
			return
		}

		_, err = stmt.Exec(name)
		if err != nil {
			runtime.LogError(app.ctx, "Error updating task -> "+err.Error())
			return
		}

	}
	runtime.EventsEmit(app.ctx, "reload_tasks")
}

func updateTaskStatus(app *App, task map[string]interface{}) {

	taskID := task["id"].(string)
	newStatus := task["status"].(float64)

	stmt, err := app.db.Prepare("UPDATE task SET status = ? WHERE id = ?")
	if err != nil {
		runtime.LogError(app.ctx, "Error updating task -> "+err.Error())
		return
	}

	_, err = stmt.Exec(newStatus, taskID)
	if err != nil {
		runtime.LogError(app.ctx, "Error updating task -> "+err.Error())
		return
	}

	runtime.EventsEmit(app.ctx, "reload_tasks")
}
