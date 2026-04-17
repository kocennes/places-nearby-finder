# ---- Build aşaması ----
# Maven + Java 17 imajı ile projeyi derle
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Önce sadece pom.xml kopyala — bağımlılıkları cache'e al
# Kaynak kod değişse bile bağımlılıklar tekrar indirilmez
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Kaynak kodu kopyala ve JAR üret (testleri atla — CI'da ayrıca koşulur)
COPY src ./src
RUN mvn package -DskipTests -q

# ---- Runtime aşaması ----
# Sadece JRE yeterli, JDK'ya gerek yok → imaj boyutu küçülür
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Build aşamasından üretilen JAR'ı kopyala
COPY --from=build /app/target/*.jar app.jar

# Uygulama 8070 portunda ayağa kalkar
EXPOSE 8070

# Konteyner başladığında çalıştırılacak komut
ENTRYPOINT ["java", "-jar", "app.jar"]
