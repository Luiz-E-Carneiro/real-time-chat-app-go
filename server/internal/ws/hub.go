package ws

type Room struct {
	ID      string             `json:"id"`
	Name    string             `json:"name"`
	Clients map[string]*Client `json:"clients"` // map clients in this room
}

type Hub struct {
	Rooms map[string]*Room
}

// constructor for the Hub
func NewHub() *Hub {
	return &Hub{
		Rooms: make(map[string]*Room),
	}
}
