package main

import (
	"net/http"
	"db"
	"encoding/json"
)

type Research struct {
	Id           int64
	Code         int
	Name         string
	DurationCure int
	DurationDiag int
	KidsCure     string
	KidsDiag     string
	IsActive     bool
}

func GetResearchList(w http.ResponseWriter, r *http.Request) {

	var ResearchList []Research
	rows := db.GetResearchList()
	for rows.Next() {
		var research Research
		rows.Scan(&research.Id,
			&research.Code,
			&research.Name)
		ResearchList = append(ResearchList, research)
	}
	data, _ := json.Marshal(ResearchList)
	w.Write(data)
}
