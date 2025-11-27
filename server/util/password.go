package util

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

// generates the bcrypt hash for a plaintext password
func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("Failed to hash: %w", err)
	}

	return string(hashedPassword), nil
}

// compares a plaintext password against its hash
// returns nil if the password matches, or an error otherwise
func CheckPasswordHash(password string, hash string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}