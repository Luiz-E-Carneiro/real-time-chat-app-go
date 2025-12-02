package router

import (
	"server/internal/user"
	"server/internal/ws"

	"github.com/gin-gonic/gin"
)

// global Gin router instance
var r *gin.Engine

// initialize the router with handlers
func InitRouter(userHandler *user.Handler, wsHandler *ws.Handler) {
	r = gin.Default()

	r.POST("/users", userHandler.CreateUser)
	r.POST("/users/login", userHandler.Login)
	r.GET("/users/logout", userHandler.Logout)

	r.POST("/ws/createRoom", wsHandler.CreateRoom)
	r.GET("/ws/joinRoom/:roomId", wsHandler.JoinRoom)
}

// run the server
func Start(addr string) error {
	return r.Run(addr)
}