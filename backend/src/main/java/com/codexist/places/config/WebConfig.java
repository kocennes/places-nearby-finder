package com.codexist.places.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Uygulama genelindeki web katmanı yapılandırması.
 *
 * İki temel görevi var:
 * 1. RestTemplate bean'ini tanımlar — Google Places API'ye HTTP isteği atmak için kullanılır
 * 2. CORS politikasını ayarlar — React frontend'in farklı port'tan (3000) backend'e (8070) istek atabilmesi için gerekli
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS_ALLOWED_ORIGIN env variable set edilmişse onu kullan (production),
    // edilmemişse localhost:3000'e izin ver (development)
    @Value("${CORS_ALLOWED_ORIGIN:http://localhost:3000}")
    private String corsAllowedOrigin;

    /**
     * Spring'in dependency injection container'ına RestTemplate örneği ekler.
     * PlacesService bu bean'i constructor injection ile alır ve dış API çağrılarında kullanır.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * /api/** altındaki tüm endpoint'ler için CORS başlıklarını ayarlar.
     * Tarayıcı, farklı origin'den gelen istekleri bu izin olmadan engeller.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns(corsAllowedOrigin)
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("*");
    }
}
