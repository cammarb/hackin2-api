#!/bin/bash

# Check if OpenSSL is installed
if ! command -v openssl &> /dev/null; then
    echo "Error: OpenSSL not found. Please install it first."
    exit 1
fi

# Generate private key and save it in a variable
PRIVATE_KEY=$(openssl genpkey -algorithm RSA -outform PEM)

# Extract public key from private key and save it in a variable
PUBLIC_KEY=$(echo "$PRIVATE_KEY" | openssl rsa -pubout -outform PEM 2>/dev/null)

# Check if the keys were generated successfully
if [[ -z "$PRIVATE_KEY" || -z "$PUBLIC_KEY" ]]; then
    echo "Error: Key generation failed."
    exit 1
fi

# Write the keys to the .env file
echo "PRIVATE_KEY=\"$(echo "$PRIVATE_KEY")\"" >> .env
echo "PUBLIC_KEY=\"$(echo "$PUBLIC_KEY")\"" >> .env

echo "Private and public keys generated and saved to .env successfully."
