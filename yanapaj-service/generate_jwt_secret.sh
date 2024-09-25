#!/bin/bash

# Generate a strong, URL-safe JWT secret key
JWT_SECRET=$(openssl rand -base64 32)

# Update the application.properties file with the generated secret
sed -i '' "s|jwt.secret=.*|jwt.secret=$JWT_SECRET|" src/main/resources/application.properties

echo "✅ JWT Secret updated in application.properties"