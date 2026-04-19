package com.codexist.places.controller;

import com.codexist.places.service.PlacesService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PlacesController {

    private final PlacesService placesService;

    public PlacesController(PlacesService placesService) {
        this.placesService = placesService;
    }

    @GetMapping(value = "/nearby", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getNearbyPlaces(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam Integer radius) {

        String result = placesService.getNearbyPlaces(latitude, longitude, radius);
        if (result == null) {
            return ResponseEntity.internalServerError()
                    .body("{\"error\":\"Failed to fetch places from Google API\"}");
        }

        return ResponseEntity.ok(result);
    }
}
