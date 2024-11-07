package main

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

func getDbPath() (string, error) {
	index, err := os.UserHomeDir()
	if err != nil {
		return "", err

	}

	hiddenFolder := filepath.Join(index, ".elfinkr")
	err = os.MkdirAll(hiddenFolder, os.ModePerm)
	if err != nil {
		return "", err
	}

	dbPath := filepath.Join(hiddenFolder, "elfinkr.db")
	return dbPath, nil
}

func OpenDB() (*sql.DB, error) {

	dbPath, err := getDbPath()

	if err != nil {
		return nil, err
	}

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY, name VARCHAR(100), status SMALLINT DEFAULT 1, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
	if err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to create SQLite table: %v", err)
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS task_item (id INTEGER PRIMARY KEY, name VARCHAR(100), content TEXT DEFAULT '', status SMALLINT DEFAULT 1, task_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE)")
	if err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to create task_item table: %v", err)
	}

	return db, nil
}
