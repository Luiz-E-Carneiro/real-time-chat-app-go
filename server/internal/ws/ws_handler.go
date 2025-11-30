package ws

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// reference to the central Hub
type Handler struct {
	hub *Hub 
}

// constructor for the WS Handler
func NewHandler(hub *Hub) *Handler {
	return &Handler{
		hub: hub,
	}
}

type CreateRoomReq struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// handles the HTTP request to create a new chat room
func (h *Handler) CreateRoom(c *gin.Context) {
	var req CreateRoomReq
	// bind incoming JSON to the request struct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// creates a new Room instance and stores it in the Hub's map
	h.hub.Rooms[req.ID] = &Room{
		ID:      req.ID,
		Name:    req.Name,
		Clients: make(map[string]*Client), // map for clients in this room!!
	}

	c.JSON(http.StatusOK, req)
}