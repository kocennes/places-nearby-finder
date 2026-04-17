package com.codexist.places;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Uygulamanın başlangıç noktası.
 *
 * @SpringBootApplication anotasyonu üç şeyi bir arada yapar:
 * - @Configuration: bu sınıf Spring bean tanımlarına kaynak olabilir
 * - @EnableAutoConfiguration: Spring Boot'un classpath'e göre otomatik yapılandırma yapmasını sağlar
 * - @ComponentScan: bu paketin altındaki tüm @Component, @Service, @Repository vs. sınıfları tarar
 */
@SpringBootApplication
public class PlacesApiApplication {

    public static void main(String[] args) {
        // Spring context'i ayağa kaldırır, gömülü Tomcat'i başlatır (port: 8070)
        SpringApplication.run(PlacesApiApplication.class, args);
    }
}
