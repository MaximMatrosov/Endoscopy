package main

import (
	"net/http"
	"config"
	"log"
	"net"
	"github.com/dgrijalva/jwt-go"
	"time"
	"fmt"
	"strings"
)

func main() {
	config.GetConfig()

	http.Handle("/", CheckLoggedIn(http.FileServer(http.Dir("htdocs"))))
	http.Handle("/authorized/", Validate(http.FileServer(http.Dir("htdocs"))))
	http.HandleFunc("/login", Login)

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

func CheckLoggedIn(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			token, _ := r.Cookie("EndoToken")
			if token != nil {
				tokenString := token.Value
				token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
					// Don't forget to validate the alg is what you expect:
					if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
						return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
					}

					return []byte("endoscopy"), nil
				})

				if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
					log.Printf("user authorized", claims["name"])
					http.Redirect(w, r, "/authorized/main.html", http.StatusSeeOther)
				} else {
					next.ServeHTTP(w,r)
				}
			} else {
				next.ServeHTTP(w,r)
			}
		} else {
			next.ServeHTTP(w,r)
		}

	})
}

func Validate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, _ := r.Cookie("EndoToken")

		if !strings.Contains(r.URL.Path, "authorized") {
			next.ServeHTTP(w, r)
		} else {
			if token == nil {
				http.Redirect(w, r, "/index.html", http.StatusSeeOther)
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
					if r.URL.Path == "/index.html" || r.URL.Path == "/" {
						http.Redirect(w, r, "/authorized/main.html", http.StatusAccepted)
					} else {
						next.ServeHTTP(w, r)
					}
				} else {
					log.Print(err)
					http.Redirect(w, r, "/index.html", http.StatusSeeOther)
				}
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
			http.Redirect(w, r, "/authorized/main.html", http.StatusAccepted)
		}

	} else {
		http.Redirect(w, r, "", http.StatusUnauthorized)
	}
}
