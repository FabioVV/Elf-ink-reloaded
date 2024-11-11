package main

import (
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Task struct {
	ID        int
	Name      string
	Status    int
	CreatedAt time.Time
	UpdatedAt time.Time

	CreatedAtStr string
	UpdatedAtStr string
	TotalTasks   int

	TotalCompletedTasks   int
	TotalUncompletedTasks int
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
	TaskID       int
}

func (a *App) GetTasks(status int) []Task {
	rows, err := a.db.Query(`SELECT T.id, T.name, T.status, T.created_at AS created_at, T.updated_at,
						(SELECT COUNT(*) FROM task_item AS TI WHERE T.id = TI.task_id) AS total_tasks,
						(SELECT COUNT(*) FROM task_item AS TI WHERE T.id = TI.task_id AND TI.status = 2) AS total_completed,
						(SELECT COUNT(*) FROM task_item AS TI WHERE T.id = TI.task_id AND TI.status = 1) AS total_uncompleted
						FROM task AS T
						WHERE status = ?`, status)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var task Task

		if err := rows.Scan(&task.ID, &task.Name, &task.Status, &task.CreatedAt, &task.UpdatedAt, &task.TotalTasks, &task.TotalCompletedTasks, &task.TotalUncompletedTasks); err != nil {
			runtime.LogError(a.ctx, err.Error())
			return nil
		}

		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}

	for i, task := range tasks {
		tasks[i].CreatedAtStr = task.CreatedAt.Format("02/01/2006 15:04")
		tasks[i].UpdatedAtStr = task.UpdatedAt.Format("02/01/2006 15:04")
	}

	return tasks
}

func (a *App) GetTaskItems(id string) []TaskItem {
	rows, err := a.db.Query(`SELECT TI.id, TI.name, TI.content, TI.status, TI.created_at, TI.updated_at, TI.task_id
	FROM task_item AS TI
	WHERE TI.task_id = ?`, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	defer rows.Close()

	var TaskItems []TaskItem
	for rows.Next() {
		var taskItem TaskItem

		if err := rows.Scan(&taskItem.ID, &taskItem.Name, &taskItem.Content, &taskItem.Status, &taskItem.CreatedAt, &taskItem.UpdatedAt, &taskItem.TaskID); err != nil {
			runtime.LogError(a.ctx, err.Error())
			return nil
		}

		TaskItems = append(TaskItems, taskItem)
	}

	if err = rows.Err(); err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}

	for i, taskItem := range TaskItems {
		TaskItems[i].CreatedAtStr = taskItem.CreatedAt.Format("02/01/2006 15:04")
		TaskItems[i].UpdatedAtStr = taskItem.UpdatedAt.Format("02/01/2006 15:04")
	}

	return TaskItems
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

func createTaskItem(app *App, taskItem map[string]interface{}) {

	taskID := taskItem["task_id"].(string)
	name := taskItem["name"].(string)

	stmt, err := app.db.Prepare("INSERT INTO task_item (task_id, name) VALUES (?, ?)")
	if err != nil {
		runtime.LogError(app.ctx, "Error creating task item -> "+err.Error())
		return
	}

	_, err = stmt.Exec(taskID, name)
	if err != nil {
		runtime.LogError(app.ctx, "Error creating task item -> "+err.Error())
		return
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

func updateTaskItemStatus(app *App, task map[string]interface{}) {

	taskItemID := task["taskItemId"].(float64)
	taskID := task["taskId"].(string)
	newStatus := task["status"].(string)

	stmt, err := app.db.Prepare("UPDATE task_item SET status = ? WHERE id = ?")
	if err != nil {
		runtime.LogError(app.ctx, "Error updating task item -> "+err.Error())
		return
	}

	_, err = stmt.Exec(newStatus, taskItemID)
	if err != nil {
		runtime.LogError(app.ctx, "Error updating task item -> "+err.Error())
		return
	}

	stmt, _ = app.db.Prepare("UPDATE task SET updated_at = CURRENT_TIMESTAMP WHERE id = ?")
	stmt.Exec(taskID)

	runtime.EventsEmit(app.ctx, "reload_tasks")
}

func deleteTask(app *App, taskID string) {

	stmt, err := app.db.Prepare("DELETE FROM task WHERE id = ?")
	if err != nil {
		runtime.LogError(app.ctx, "Error updating task -> "+err.Error())
		return
	}

	_, err = stmt.Exec(taskID)
	if err != nil {
		runtime.LogError(app.ctx, "Error deleting task -> "+err.Error())
		return
	}

	runtime.EventsEmit(app.ctx, "reload_tasks")
}
