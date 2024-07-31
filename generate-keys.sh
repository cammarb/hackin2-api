#!/bin/bash

# Check if OpenSSL is installed
if ! command -v openssl &> /dev/null; then
    echo "Error: OpenSSL not found. Please install it first."
    exit 1
fi

# Generate private key
openssl genpkey -algorithm RSA -out private_key.pem

# Extract public key from private key
openssl rsa -pubout -in private_key.pem -out public_key.pem

echo "Private and public keys generated successfully:"
ls -l private_key.pem public_key.pem
