package com.codexist.places.service;

import com.codexist.places.model.PlacesCache;
import com.codexist.places.repository.PlacesCacheRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;

/**
 * Yakın yer arama iş mantığının bulunduğu servis katmanı.
 *
 * İki sorumluluğu var:
 * 1. Cache kontrolü: aynı istek daha önce yapıldıysa DB'den döner, Google API'ye gitmez
 * 2. Google Places API entegrasyonu: cache'de yoksa API'yi çağırır ve sonucu kaydeder
 *
 * Bu pattern "cache-aside" (lazy loading) olarak bilinir:
 * veri ihtiyaç duyulduğunda cache'e yüklenir, önceden değil.
 */
@Service
public class PlacesService {

    private static final Logger log = LoggerFactory.getLogger(PlacesService.class);

    private final RestTemplate restTemplate;
    private final PlacesCacheRepository cacheRepository;

    // API key ve base URL application.properties'den okunur, environment variable ile ezilir
    @Value("${google.places.api.key}")
    private String apiKey;

    @Value("${google.places.api.base-url}")
    private String baseUrl;

    public PlacesService(RestTemplate restTemplate, PlacesCacheRepository cacheRepository) {
        this.restTemplate = restTemplate;
        this.cacheRepository = cacheRepository;
    }

    /**
     * Verilen koordinat ve yarıçap için yakındaki yerleri getirir.
     *
     * Akış:
     *   1. DB'de aynı lat+lon+radius kombinasyonu var mı kontrol et
     *   2. Varsa (cache HIT): kayıtlı JSON'ı döndür
     *   3. Yoksa (cache MISS): Google Places API'yi çağır, yanıtı DB'ye kaydet, döndür
     *
     * @return Google Places API'nin ham JSON yanıtı, hata durumunda null
     */
    public String getNearbyPlaces(Double latitude, Double longitude, Integer radius) {

        // Adım 1: Cache kontrolü
        Optional<PlacesCache> cached = cacheRepository.findByLatitudeAndLongitudeAndRadius(
                latitude, longitude, radius);

        if (cached.isPresent()) {
            // Cache HIT — Google API'ye gitmeden kayıtlı yanıtı dön
            log.info("Cache HIT for lat={}, lon={}, radius={}", latitude, longitude, radius);
            return cached.get().getResponseJson();
        }

        // Adım 2: Cache MISS — Google Places API'ye istek at
        log.info("Cache MISS — calling Google Places API for lat={}, lon={}, radius={}", latitude, longitude, radius);

        // URL'yi güvenli şekilde oluştur (UriComponentsBuilder özel karakterleri otomatik encode eder)
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("location", latitude + "," + longitude)
                .queryParam("radius", radius)
                .queryParam("key", apiKey)
                .toUriString();

        String response = restTemplate.getForObject(url, String.class);

        // Adım 3: Yanıtı DB'ye kaydet ki bir sonraki aynı istek cache'den dönsün
        if (response != null) {
            PlacesCache entry = PlacesCache.builder()
                    .latitude(latitude)
                    .longitude(longitude)
                    .radius(radius)
                    .responseJson(response)
                    .build();
            cacheRepository.save(entry);
            log.info("Response cached for lat={}, lon={}, radius={}", latitude, longitude, radius);
        }

        return response;
    }
}
