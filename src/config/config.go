package config

import (
	"os"
	"encoding/json"
	"log"
)

var Config = map[string]string{}

func GetConfig() {
	file, _ := os.Open("htdocs/appconfig/config.json")
	decoder := json.NewDecoder(file)
	err := decoder.Decode(&Config)
	if err != nil {
		log.Println("error:", err)
	}
}
