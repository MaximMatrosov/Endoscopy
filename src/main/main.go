package main

import (
	"net/http"
	"config"
	"log"
	"net"
	"github.com/dgrijalva/jwt-go"
	"time"
	"fmt"
)

func main() {
	config.GetConfig()

	http.Handle("/", Validate(http.FileServer(http.Dir("htdocs"))))
	http.HandleFunc("/login", Login)
	//http.Handle("/authorized/", Validate(http.FileServer(http.Dir("htdocs"))))

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

func Validate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, _ := r.Cookie("EndoToken")
		if token == nil {
			http.Redirect(w, r, "index.html", http.StatusMovedPermanently)
		} else {
			tokenString := token.Value
			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				// Don't forget to validate the alg is what you expect:
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
				}

				return []byte("endoscopy"), nil
			})

			if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
				log.Printf("user authorized", claims["name"])
				next.ServeHTTP(w, r)
			} else {
				log.Print(err)
				http.Redirect(w, r, "index.html", http.StatusMovedPermanently)
			}
		}
	})
}

func Login(w http.ResponseWriter, r *http.Request) {
	login := r.FormValue("login")
	pass := r.FormValue("pass")

	if (login == "" && pass == "333") {
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"admin": true,
			"name":  "doctor",
			"exp":   time.Now().Add(time.Hour * 24).Unix(),
		})
		tokenString, err := token.SignedString([]byte("endoscopy"))
		if err != nil {
			log.Printf("couldn't create token")
		} else {
			http.SetCookie(w, &http.Cookie{Name: "EndoToken", Value: tokenString})
			http.Redirect(w, r, "authorized/main.html", http.StatusAccepted)
		}

	} else {
		http.Redirect(w, r, "", http.StatusUnauthorized)
	}
}
