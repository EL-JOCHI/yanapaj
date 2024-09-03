# 🗂️ Yanapaj - Your Go-To Task Management Solution
Yanapaj is a task management application built with Spring Boot, 
designed to help users efficiently organize and manage their tasks.

## 💻 Quick Start
### 🚀 Running with Docker Compose

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

## ⚙ Develop

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### 💡Pre-requisites

- **Docker**: Docker simplifies running the application and its dependencies.
- **Java 21**.
- **Node 20**.


### 🍃 `yanapej-service`

**Run the Application:**
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