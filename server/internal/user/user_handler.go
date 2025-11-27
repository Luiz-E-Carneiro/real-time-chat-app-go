package user

import (
	"net/http"

	"github.com/gin-gonic/gin" // web routing and HTTP context
)

type Handler struct {
	Service
}

// constructor for the Handler 
func NewHandler(s Service) *Handler {
	return &Handler{
		Service: s, // provides access to service methods!
	}
}

// post /users route for registration
func (h *Handler) CreateUser(ctx *gin.Context) {
	var u CreateUserReq
	// bind incoming JSON request body to the struct
	if err := ctx.ShouldBindJSON(&u); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // if JSON is wrong
	}

	// call the service layer to create the user
	res, err := h.Service.CreateUser(ctx.Request.Context(), &u)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, res)
}

// handles the POST /users/login route for user authentication
func (h *Handler) Login(c *gin.Context) {
	var user LoginUserReq

	// bind the incoming JSON to the struct
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// service layer to auth and get token/user info
	u, err := h.Service.Login(c.Request.Context(), &user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// set the JWT token
	c.SetCookie("jwt", u.accessToken, 3600, "/", "localhost", false, true)

	res := &LoginUserRes{
		Username: u.Username,
		ID:       u.ID,
	}

	c.JSON(http.StatusOK, res)
}

// handles the GET /users/logout route
func (h *Handler) Logout(c *gin.Context) {
	c.SetCookie("jwt", "", -1, "", "", false, true) // clears the JWT cookie
	c.JSON(http.StatusOK, gin.H{"massage": "logout successful"})
}