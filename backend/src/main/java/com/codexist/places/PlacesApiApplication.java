package com.codexist.places;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Uygulamanın başlangıç noktası.
 *
 * @SpringBootApplication üç anotasyonu bir arada sağlar:
 * - @Configuration: Spring bean tanımlarına kaynak olabilir
 * - @EnableAutoConfiguration: classpath'e göre otomatik yapılandırma yapar
 * - @ComponentScan: bu paketin altındaki tüm @Component, @Service, @Repository sınıfları tarar
 */
@SpringBootApplication
public class PlacesApiApplication {

    public static void main(String[] args) {
        // Spring context'i ayağa kaldırır, gömülü Tomcat'i başlatır (port: 8070)
        SpringApplication.run(PlacesApiApplication.class, args);
    }
}
