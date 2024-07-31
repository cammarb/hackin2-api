# Check if OpenSSL is installed
if (Test-Path (Get-Command openssl -ErrorAction SilentlyContinue)) {
    Write-Host "Error: OpenSSL not found. Please install it first."
    exit 1
}

# Generate private key
openssl genpkey -algorithm RSA -out private_key.pem

# Extract public key from private key
openssl rsa -pubout -in private_key.pem -out public_key.pem

Write-Host "Private and public keys generated successfully:"
Get-ChildItem private_key.pem, public_key.pem | Format-Table
