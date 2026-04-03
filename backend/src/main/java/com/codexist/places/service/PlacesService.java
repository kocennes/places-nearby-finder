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

@Service
public class PlacesService {

    private static final Logger log = LoggerFactory.getLogger(PlacesService.class);

    private final RestTemplate restTemplate;
    private final PlacesCacheRepository cacheRepository;

    @Value("${google.places.api.key}")
    private String apiKey;

    @Value("${google.places.api.base-url}")
    private String baseUrl;

    public PlacesService(RestTemplate restTemplate, PlacesCacheRepository cacheRepository) {
        this.restTemplate = restTemplate;
        this.cacheRepository = cacheRepository;
    }

    public String getNearbyPlaces(Double latitude, Double longitude, Integer radius) {
        Optional<PlacesCache> cached = cacheRepository.findByLatitudeAndLongitudeAndRadius(
                latitude, longitude, radius);

        if (cached.isPresent()) {
            log.info("Cache HIT for lat={}, lon={}, radius={}", latitude, longitude, radius);
            return cached.get().getResponseJson();
        }

        log.info("Cache MISS — calling Google Places API for lat={}, lon={}, radius={}", latitude, longitude, radius);

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("location", latitude + "," + longitude)
                .queryParam("radius", radius)
                .queryParam("key", apiKey)
                .toUriString();

        String response = restTemplate.getForObject(url, String.class);

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
