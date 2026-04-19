package com.codexist.places.repository;

import com.codexist.places.model.PlacesCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlacesCacheRepository extends JpaRepository<PlacesCache, Long> {

    Optional<PlacesCache> findByLatitudeAndLongitudeAndRadius(
            Double latitude, Double longitude, Integer radius);
}
