# Stage 1: build the frontend
FROM node:22 AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: build the backend
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend/banking-api/pom.xml .
RUN mvn -q dependency:go-offline
COPY backend/banking-api/src ./src
COPY --from=frontend /frontend/dist ./src/main/resources/static
RUN mvn -q clean package -DskipTests

# Stage 3: run
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
