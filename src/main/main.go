package main

import (
	"net/http"
	"config"
	"log"
	"net"
)

func main(){
	config.GetConfig()

	http.Handle("/", http.FileServer(http.Dir("htdocs")))

	address := config.Config["WEBSERVER_START_ON_ADDRESS"]
	log.Printf("server starting on address " + address + "...")
	ln, err := net.Listen("tcp", address)
	if err != nil {
		log.Printf("address is not available\n", err)
	} else {
		ln.Close()
		log.Printf("server started!\n")
		http.ListenAndServe(address, nil)
	}

	log.Printf("server stopped!\n")
}


