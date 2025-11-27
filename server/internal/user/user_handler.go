package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service
}

func NewHandler (s Service) *Handler {
	return &Handler{
		Service: s,
	}
}

func (h *Handler) CreateUser(ctx *gin.Context) {
	var u CreateUserReq
	if err := ctx.ShouldBindJSON(&u); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	res, err := h.Service.CreateUser(ctx.Request.Context(), &u)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, res)
}
