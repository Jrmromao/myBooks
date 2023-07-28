

FROM openjdk:17-oracle

WORKDIR /app
COPY build/libs/*.jar /app/test_project.jar

EXPOSE 8080

# Set the command to run your Spring application when the container starts
CMD ["java", "-jar", "/app/test_project.jar"]

