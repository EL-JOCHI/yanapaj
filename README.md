# 🗂️ Yanapaj - Your Go-To Task Management Solution
Yanapaj is a task management application built with Spring Boot, 
designed to help users efficiently organize and manage their tasks.

## 💻 Quick Start
### 🚀 Running with Docker Compose
This section guides you through running the Yanapaj application using Docker Compose.

### 🔐 Setting up the JWT Secret Key

Before starting the application, you need to generate a secure secret key for JWT authentication. This key is used to sign and verify JSON Web Tokens, ensuring secure communication between the frontend and backend services.

1. **Navigate to the `yanapaj-service` directory:**

   ```bash
   cd yanapaj-service
   ```

2. **Generate and set the JWT secret key:**

   ```bash
   chmod +x generate_jwt_secret.sh
   ./generate_jwt_secret.sh
   ```

   This script does the following:
    - Generates a strong, URL-safe JWT secret key using `openssl`.
    - Updates the `jwt.secret` property in the `src/main/resources/application.properties` file with the generated key.

### 🐳 Starting the Application

1. **Start the Application:**
   ```bash
   docker-compose up -d
   ```
   This command will:
    - Build the images for [yanapaj-service](yanapaj-service) and [yanapaj-ui](yanapaj-ui) if they don't exist.
    - Start all three containers (`yanapaj-mongodb`, `yanapaj-service`, and `yanapaj-ui`) in the correct order.
    - Run the containers in detached mode (`-d`), so they run in the background.

2. **Access the Application:**
    - Once the containers are up and running, you can access the Yanapaj application in your web browser at:
      http://localhost:3000

3. **Stop the Application:**
   ```bash
   docker-compose down
   ```
   This will stop and remove the containers.

#### 🤖 Rebuild Images (If Needed)
If you make changes to the source code, you'll need to rebuild the images:
```bash
docker-compose up -d --build
```

### 🎉 Accessing Yanapaj 🎉

Once you've successfully started the application with Docker Compose, you can access it in two ways:

1. **✨ Yanapaj Web UI:** Open your web browser and go to:
   [http://localhost:3000](http://localhost:3000)

2. **📖 Yanapaj API Documentation (Swagger UI):**  Explore the API documentation and interact with your backend endpoints here:
   [http://localhost:8080/v1/yanapaj/swagger-ui.html](http://localhost:8080/v1/yanapaj/swagger-ui.html)
## ⚙ Develop

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### 💡Pre-requisites

- **Docker**: Docker simplifies running the application and its dependencies.
- **Java 21**.
- **Node 20**.


### 🍃 `yanapej-service`

#### Configurations
- `jwt.secret`: To set this value, you need to generate a stronger, cryptographically secure secret key that is at least 256 bits long.
  Here's how to generate a secure secret key:
  
  - Using openssl (Recommended):
    `openssl rand -base64 32  # Generates a 256-bit (32 bytes) key`
    This will output a random string of characters. Copy this string.


#### Run the Application:
- Run:
  ```bash
  ./gradlew bootRun
  ```
- This will start your Spring Boot application.
- The MongoDB container, defined in the [compose.yaml](yanapaj-service/compose.yaml) file, will be started automatically before your application.

### ✨ `yanapej-ui`

1. **Navigate to the UI Directory:**
   ```bash
   cd yanapaj-ui
   ```

2. **Start the Development Server:**
   ```bash
   npm start
   ```
   You can access the UI at `http://localhost:3000`.

## 📄 License
This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for more information.