package router

import (
	"github.com/gin-gonic/gin"
	"server/internal/user"
)

// global Gin router instance
var r *gin.Engine

func InitRouter(userHandler *user.Handler){
	r = gin.Default()

	r.POST("/users", userHandler.CreateUser)
	r.POST("/users/login", userHandler.Login)
	r.GET("/users/logout", userHandler.Logout)
}

// run the server
func Start(addr string) error {
	return r.Run(addr)
}