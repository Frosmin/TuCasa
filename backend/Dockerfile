
FROM eclipse-temurin:17-jdk-jammy AS build

WORKDIR /app


COPY .mvn/ .mvn
COPY src/ src
COPY mvnw .
COPY mvnw.cmd .
COPY pom.xml .

RUN chmod +x ./mvnw


RUN ./mvnw clean install -DskipTests


FROM eclipse-temurin:17-jre-jammy

WORKDIR /app


COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar


CMD ["java", "-jar", "app.jar"]