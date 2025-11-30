package ws

import "golang.org/x/net/websocket"


type Client struct {
	Conn    *websocket.Conn
	Message chan *Message
	ID      string `json:"id"`
	roomID  string `json:"roomID"`
	username string `json:"username"`
}

type Message struct {
	Content  string `json:"content"`
	RoomID   string `json:"roomID"`
	Username string `json:"username"`
}
