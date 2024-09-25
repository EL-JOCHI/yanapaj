FROM alpine/java:21-jdk

WORKDIR /app
COPY . .

RUN ./gradlew clean build

COPY build/libs/*.jar app.jar

# Expose the port your Spring Boot app listens on
EXPOSE 8080
# Command to run your Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]