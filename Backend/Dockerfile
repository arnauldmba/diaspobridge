# -------- BUILD STAGE --------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Dépendances d'abord (cache)
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Code ensuite
COPY src ./src
RUN mvn -q -DskipTests package

# -------- RUN STAGE --------
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
