package db

import (
	"database/sql"
	"config"
	"log"
)

func checkConErr(err error) {
	if err != nil {
		log.Printf("Ошибка при работе с БД -->%v\n", err)
		panic("Ошибка при подключении к БД")
	}
}

func checkErr(err error) {
	if err != nil {
		log.Printf("Ошибка при работе с БД -->%v\n", err)
		panic("Ошибка при запросе к БД")
	}
}

func GetResearchList() *sql.Rows{

	db, err := sql.Open("sqlite3", config.Config["DB_CONNECT_STRING"])
	checkConErr(err)

	rows, err := db.Query("SELECT id, research_code, name FROM research WHERE is_active = 1")
	
	return rows
}
