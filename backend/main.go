package main

import (
	// "fmt"
	"log"
	"math/rand"
	"time"
	
	"os"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/gin-contrib/cors"
)

type ShortlyLink struct {
	gorm.Model // ID is the primary key
	OriginalURL string `gorm:"unique"`
	ShortURL string `gorm:"unique"`
}

var db *gorm.DB

func main() {
	err := godotenv.Load(".env")	
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbUsername := os.Getenv("DB_USERNAME")
	dbpassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")


	dsn := dbUsername+":"+dbpassword+"@tcp("+dbHost+":"+dbPort+")/"+dbName+"?parseTime=True"
	
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("database : ", err)
	}

	// Migrate the schema
	db.AutoMigrate(&ShortlyLink{})


	router := gin.Default()
	router.Use(cors.Default())

	router.GET("/:shortURL", GetOriginalLink)
	router.POST("/shorten", ShortenLink)

	router.Run(":8000")

}


func generateShortURL(originalURL string) string {
	// Generate a random 6-character string
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	// random
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	var shortURL string
	for i := 0; i < 6; i++ {
		shortURL += string(chars[r.Intn(len(chars))])
	}

	return shortURL
}




