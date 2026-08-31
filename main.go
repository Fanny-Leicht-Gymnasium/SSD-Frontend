package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)
const htmlRoot = "./html"

func main() {
	fs := http.FileServer(http.Dir(htmlRoot))

	http.HandleFunc("/__cache-manifest", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var files []string

		err := filepath.Walk(htmlRoot, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			if info.IsDir() {
				return nil
			}

			relativePath, err := filepath.Rel(htmlRoot, path)
			if err != nil {
				return err
			}

			// Convert Windows paths to URL paths.
			urlPath := "/" + filepath.ToSlash(relativePath)

			files = append(files, urlPath)

			return nil
		})

		if err != nil {
			http.Error(w, "Failed to build cache manifest", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(files)
	})
	
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		// -----------------------------
		// Dev mode: create missing icon files
		// -----------------------------
		if devMode && strings.HasPrefix(path, "/assets/icons/") {
			fullPath := "./html" + path

			if _, err := os.Stat(fullPath); os.IsNotExist(err) {
				f, err := os.OpenFile(
					"missing-icons.txt",
					os.O_APPEND|os.O_CREATE|os.O_WRONLY,
					0644,
				)

				if err == nil {
					defer f.Close()
					f.WriteString(path + "\n")
				}
			}
		}
		// -----------------------------
		// CSS fallback for custom elements
		// -----------------------------
		if strings.HasPrefix(path, "/assets/css/customElement/") && strings.HasSuffix(path, ".css") {
			fullPath := "./html" + path

			f, err := os.Open(fullPath)
			if err != nil {
				// File does not exist -> return empty CSS
				w.Header().Set("Content-Type", "text/css")
				w.WriteHeader(http.StatusOK)
				w.Write([]byte("/* empty stylesheet fallback */"))
				return
			}

			defer f.Close()
			http.ServeContent(w, r, path, time.Time{}, f)
			return
		}

		if strings.HasSuffix(path, "/manifest.webmanifest") {
			w.Header().Set("Content-Type", "application/manifest+json")
			http.ServeFile(w, r, "./html/manifest.webmanifest")
			return
		}

		// default file server
		fs.ServeHTTP(w, r)
	})

	port := ":8081"
	log.Println("Server running on http://localhost" + port)

	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatal(err)
	}
}
