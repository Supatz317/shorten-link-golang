package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"github.com/PuerkitoBio/goquery"
)

func GetOriginalLink(c *gin.Context) {
	shortURL := c.Param("shortURL")
	if shortURL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "shortURL is required"})
		return
	}
	var link ShortlyLink

	result := db.Where("short_url = ?", shortURL).First(&link)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}
	//redirect to the original URL
	c.JSON(http.StatusOK, gin.H{"original_url": link.OriginalURL})
}

func ShortenLink(c *gin.Context) {

	var data struct {
		URL string `json:"url" binding:"required"`
	}

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return 
	}

	var link ShortlyLink
	// Check if the URL already exists in the database
	err := db.Where("original_url = ?", data.URL).First(&link).Error
	// If the URL already exists, return the existing short URL
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			shortURL := generateShortURL(data.URL)

			// create object 
			link = ShortlyLink{
				OriginalURL: data.URL, 
				ShortURL: shortURL,
			}

			// Create the new link in the database
			err = db.Create(&link).Error
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
				return
			}
		}
	}

	quickshare_msg, err := getTitleURL(data.URL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"result": err, "original_url": link.OriginalURL, "short_url": link.ShortURL, "quickshare": quickshare_msg})

	
}

func getTitleURL(url string) (string, error) {
	res, err := http.Get(url)

    if err != nil {
		return "", err
    }
    defer res.Body.Close()

    if res.StatusCode != 200 {
		return "", fmt.Errorf("Error: status code %d", res.StatusCode)
    }

    // Load the HTML document
    doc, err := goquery.NewDocumentFromReader(res.Body)
    if err != nil {
		return "", err
    }

    title := doc.Find("title").Text()
	return title, nil
}