package com.codexist.places.repository;

import com.codexist.places.model.PlacesCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * PlacesCache entity'si için veritabanı erişim katmanı.
 *
 * JpaRepository extend etmek save(), findById(), findAll(), delete() gibi
 * metodları bedavaya getirir. Bu interface için ayrıca bir impl sınıfı
 * yazmaya gerek yoktur — Spring Data JPA çalışma zamanında otomatik üretir.
 */
@Repository
public interface PlacesCacheRepository extends JpaRepository<PlacesCache, Long> {

    /**
     * Metod adından Spring otomatik SQL üretir:
     * SELECT * FROM places_cache WHERE latitude=? AND longitude=? AND radius=?
     *
     * Optional dönüş tipi: kayıt yoksa boş Optional, varsa içinde PlacesCache döner.
     */
    Optional<PlacesCache> findByLatitudeAndLongitudeAndRadius(
            Double latitude, Double longitude, Integer radius);
}
