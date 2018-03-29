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
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	config.GetConfig()

	http.Handle("/", CheckLoggedIn(NoCache(http.FileServer(http.Dir("htdocs")))))
	http.Handle("/authorized/", Validate(NoCache(http.FileServer(http.Dir("htdocs")))))
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

var lastURL = ""

var epoch = time.Unix(0, 0).Format(time.RFC1123)

var noCacheHeaders = map[string]string{
	"Expires":         epoch,
	"Cache-Control":   "no-cache, private, max-age=0",
	"Pragma":          "no-cache",
	"X-Accel-Expires": "0",
}

var etagHeaders = []string{
	"ETag",
	"If-Modified-Since",
	"If-Match",
	"If-None-Match",
	"If-Range",
	"If-Unmodified-Since",
}

func NoCache(h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		// Delete any ETag headers that may have been set
		for _, v := range etagHeaders {
			if r.Header.Get(v) != "" {
				r.Header.Del(v)
			}
		}

		// Set our NoCache headers
		for k, v := range noCacheHeaders {
			w.Header().Set(k, v)
		}

		h.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
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
					log.Printf("user '%v' is already authorized! Redirecting to main page...", claims["name"])
					http.Redirect(w, r, "/authorized/main.html", http.StatusSeeOther)
				} else {
					next.ServeHTTP(w, r)
				}
			} else {
				next.ServeHTTP(w, r)
			}
		} else {
			next.ServeHTTP(w, r)
		}
	})
}

func Validate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, _ := r.Cookie("EndoToken")
		url := r.URL.Path

		if !strings.Contains(url, "authorized") {
			next.ServeHTTP(w, r)
		} else {
			if token == nil {
				lastURL = url
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

				if _, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
					if url == "/index.html" || url == "/" {
						http.Redirect(w, r, "/authorized/main.html", http.StatusAccepted)
					} else {
						next.ServeHTTP(w, r)
					}
				} else {
					log.Print(err)
					lastURL = url
					http.Redirect(w, r, "/index.html", http.StatusSeeOther)
				}
			}
		}
	})
}

func Login(w http.ResponseWriter, r *http.Request) {
	login := r.FormValue("login")
	pass := r.FormValue("password")

	if (login == "" && pass == "333") {
		log.Printf("authorization success")
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
			if lastURL == "" {
				w.Write([]byte("authorized/main.html"))
			} else {
				w.Write([]byte(lastURL))
				lastURL = ""
			}
		}
	} else {
		log.Printf("authorization failed")
		http.Redirect(w, r, "", http.StatusUnauthorized)
	}
}
