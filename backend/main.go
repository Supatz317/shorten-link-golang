package main

import (
	// "fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

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
	
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// Migrate the schema
	db.AutoMigrate(&ShortlyLink{})


	router := gin.Default()
	router.Use(cors.Default())
	router.POST("/shorten", func(c *gin.Context) {

		var data struct {
			URL string `json:"url" binding:"required"`
		}

		if err := c.ShouldBindJSON(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return 
		}

		var link ShortlyLink
		// Check if the URL already exists in the database
		result := db.Where("orginal_url = ?", data.URL).First(&link)
		// If the URL already exists, return the existing short URL
		if result.Error == nil {
			if result.Error == gorm.ErrRecordNotFound {
				shortURL := generateShortURL(data.URL)
				link = ShortlyLink{OriginalURL: data.URL, ShortURL: shortURL}
				result = db.Create(&link)
				if result.Error != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error" : result.Error.Error()})
					return
				}
			}
		}

		c.JSON(http.StatusOK, gin.H{"short_url": link.ShortURL})
	})

	router.GET("/:shortURL", func(c *gin.Context) {
		shortURL := c.Param("shortURL")
		var link ShortlyLink

		result := db.Where("short_url = ?", shortURL).Find(&link)

		if result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			}
			return
		}
		//redirect to the original URL
		c.Redirect(http.StatusMovedPermanently, link.OriginalURL)
	})
		
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




