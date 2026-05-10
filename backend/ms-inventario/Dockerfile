FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
# Copiamos todo el directorio backend
COPY . .
# Compilamos solo el modulo específico y sus dependencias (parent pom)
RUN mvn clean package -pl ms-inventario -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/ms-inventario/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
