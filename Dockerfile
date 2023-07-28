FROM openjdk:20-oracle

WORKDIR /app
COPY build/libs/*.jar /app/myBooks.jar

EXPOSE 8081

# Set the command to run your Spring application when the container starts
CMD ["java", "-jar", "/app/myBooks.jar"]
