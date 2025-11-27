package user

import (
	"context"
	"server/util"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5" //for generating authentication tokens
)

const (
	secretKey = "my_master_secret_only_best_wow_key" //Not secure, for demo purposes only!!
)

type service struct {
	Repository
	timeout time.Duration
}

func NewService(repository Repository) Service {
	return &service{
		repository,
		time.Duration(2) * time.Second,
	}
}

// registration
func (s *service) CreateUser(ctx context.Context, req *CreateUserReq) (*CreateUserRes, error) {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	// hash the password before storing
	hashedPassword, err := util.HashPassword(req.Password)

	if err != nil {
		return nil, err
	}

	user := &User{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: hashedPassword,
	}

	// call repository to save the user
	r, err := s.Repository.CreateUser(ctx, user)

	if err != nil {
		return nil, err
	}

	// prepare the response
	res := &CreateUserRes{
		ID:       strconv.Itoa(int(r.ID)),
		Username: r.Username,
		Email:    r.Email,
	}

	return res, nil
}

// defines the data structure for the JWT
type jwtCustomClaims struct {
	UserID   string `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// handles user authentication and token generation
func (s *service) Login(c context.Context, req *LoginUserReq) (*LoginUserRes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	u, err := s.Repository.GetUserByEmail(ctx, req.Email)
	if err != nil {
		return &LoginUserRes{}, err
	}

	err = util.CheckPasswordHash(req.Password, u.PasswordHash) // verify password to hash
	if err != nil {
		return &LoginUserRes{}, err
	}

	// create a new JWT token with custom claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwtCustomClaims{
		UserID:   strconv.Itoa(int(u.ID)),
		Username: u.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    strconv.Itoa(int(u.ID)),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // token valid for 24 hours
		},
	})

	sign_string, err := token.SignedString([]byte(secretKey)) // sign the token with the secret (demo) key!

	if err != nil {
		return &LoginUserRes{}, err
	}

	// return the generated access token and user details
	return &LoginUserRes{accessToken: sign_string, ID: strconv.Itoa(int(u.ID)), Username: u.Username}, nil
}
