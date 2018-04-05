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

type Manipulation struct {
	Id           int64
	Code         int
	ResearchCode int
	Text         string
	Status       int
	Operations   bool
	IsActive     bool
}

type Anestesia struct {
	Id           int64
	ResearchCode int
	Name         string
	IsActive     bool
}

type Affiliation struct {
	Id       int64
	Status   string
	IsActive bool
}

type Department struct {
	Id         int64
	Code       string
	Name       string
	OutPatient bool
	IsWorking  bool
}

type Diagnose struct {
	Id           int64
	ResearchCode int
	Name         string
	mkbCode      string
	mkbDiagnose  string
	IsActive     bool
}

type Doctor struct {
	Id            int64
	Name          string
	IsEndoscopist bool
	IsWorking     bool
}

type EntireDiagnose struct {
	Id           int64
	ResearchCode int
	Name         string
	DiagnoseCode int
	IsActive     bool
}

type Equipment struct {
	Id           int64
	ResearchCode int
	Name         string
	Code         int
	Inventory    string
	Serial       string
	IsActual     bool
	State        string
	Research     string
}

type Protocol struct {
	Id           int64
	ResearchCode int
	Description  string
	Name         string
	IsActive     bool
}

type ResearchPlace struct {
	Id              int64
	Name            string
	AmbulatoryLevel string
	IsActive        bool
}

func GetResearchList(w http.ResponseWriter, r *http.Request) {
	if ValidUser(r) {
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
	} else {
		http.Redirect(w, r, "index.html", http.StatusSeeOther)
	}
}

func LoadDataByResearch(w http.ResponseWriter, r *http.Request) {

}
