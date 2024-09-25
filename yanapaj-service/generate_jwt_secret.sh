#!/bin/bash

# Generate a strong, URL-safe JWT secret key
JWT_SECRET=$(openssl rand -base64 32)

# Update the application.properties file with the generated secret
sed -i '' "s|jwt.secret=.*|jwt.secret=$JWT_SECRET|" src/main/resources/application.properties
echo "✅  JWT Secret updated in src/main/resources/application.properties"

# Update the application-test.properties file with the generated secret
sed -i '' "s|jwt.secret=.*|jwt.secret=$JWT_SECRET|" src/test/resources/application-test.properties
echo "🧪 JWT Secret updated in src/test/resources/application-test.properties"