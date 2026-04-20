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
 * Cache-aside pattern uygular:
 * 1. Önce DB'ye bak — aynı lat+lon+radius daha önce sorgulandı mı?
 * 2. Varsa (cache HIT): DB'den döndür, Google API'ye gitme
 * 3. Yoksa (cache MISS): Google Places API'yi çağır, yanıtı DB'ye kaydet, döndür
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

    public String getNearbyPlaces(Double latitude, Double longitude, Integer radius) {

        // Adım 1: Cache kontrolü
        Optional<PlacesCache> cached = cacheRepository.findByLatitudeAndLongitudeAndRadius(
                latitude, longitude, radius);

        if (cached.isPresent()) {
            log.info("Cache HIT for lat={}, lon={}, radius={}", latitude, longitude, radius);
            return cached.get().getResponseJson();
        }

        // Adım 2: Cache MISS — Google Places API'ye istek at
        log.info("Cache MISS for lat={}, lon={}, radius={}", latitude, longitude, radius);

        // UriComponentsBuilder özel karakterleri otomatik encode eder
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("location", latitude + "," + longitude)
                .queryParam("radius", radius)
                .queryParam("key", apiKey)
                .toUriString();

        String response = restTemplate.getForObject(url, String.class);

        // Adım 3: Yanıtı DB'ye kaydet — bir sonraki aynı istek cache'den dönsün
        if (response != null) {
            cacheRepository.save(new PlacesCache(latitude, longitude, radius, response));
            log.info("Response cached for lat={}, lon={}, radius={}", latitude, longitude, radius);
        }

        return response;
    }
}
