package com.codexist.places.controller;

import com.codexist.places.service.PlacesService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Yakın yer arama işlemleri için REST API controller'ı.
 *
 * Tek endpoint sunar: GET /api/nearby
 * İş mantığını kendisi içermez, doğrudan PlacesService'e delege eder.
 * Bu sayede controller sadece HTTP katmanından sorumlu olur (parametre alma, response dönme).
 */
@RestController
@RequestMapping("/api")
public class PlacesController {

    private final PlacesService placesService;

    // Constructor injection — field injection yerine tercih edilir, test yazımını kolaylaştırır
    public PlacesController(PlacesService placesService) {
        this.placesService = placesService;
    }

    /**
     * Verilen koordinat ve yarıçap için yakındaki yerleri döner.
     * Örnek: GET /api/nearby?latitude=41.0082&longitude=28.9784&radius=1000
     *
     * @param latitude  Merkez noktanın enlemi (-90 ile 90 arası)
     * @param longitude Merkez noktanın boylamı (-180 ile 180 arası)
     * @param radius    Arama yarıçapı metre cinsinden (max 50000)
     */
    @GetMapping(value = "/nearby", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getNearbyPlaces(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam Integer radius) {

        String result = placesService.getNearbyPlaces(latitude, longitude, radius);

        // Service null dönerse Google API'ye ulaşılamadı demektir
        if (result == null) {
            return ResponseEntity.internalServerError()
                    .body("{\"error\":\"Failed to fetch places from Google API\"}");
        }

        return ResponseEntity.ok(result);
    }
}
