package com.codexist.places.repository;

import com.codexist.places.model.PlacesCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * PlacesCache entity'si için veritabanı erişim katmanı.
 *
 * JpaRepository<PlacesCache, Long> extend etmek şu metodları bedavaya getirir:
 *   save()       → kayıt ekle veya güncelle
 *   findById()   → ID ile getir
 *   findAll()    → hepsini getir
 *   delete()     → sil
 *   count()      → toplam kayıt sayısı
 *   ... ve daha fazlası
 *
 * Bu interface için ayrıca bir impl sınıfı yazmaya gerek yoktur.
 * Spring Data JPA çalışma zamanında otomatik olarak implementasyonu üretir.
 */
@Repository
public interface PlacesCacheRepository extends JpaRepository<PlacesCache, Long> {

    /**
     * Verilen enlem, boylam ve yarıçap kombinasyonuna sahip cache kaydını arar.
     *
     * Spring Data JPA, metod adını okuyarak otomatik şu SQL'i üretir:
     *   SELECT * FROM places_cache
     *   WHERE latitude = ? AND longitude = ? AND radius = ?
     *
     * Optional dönüş tipi:
     *   - Kayıt bulunursa → Optional.of(placesCache)
     *   - Bulunamazsa    → Optional.empty()
     * Bu sayede null kontrolü yerine daha güvenli isPresent() / get() kullanılır.
     *
     * @param latitude  Aranacak enlem değeri
     * @param longitude Aranacak boylam değeri
     * @param radius    Aranacak yarıçap değeri
     * @return Eşleşen cache kaydı varsa Optional içinde, yoksa boş Optional
     */
    Optional<PlacesCache> findByLatitudeAndLongitudeAndRadius(
            Double latitude, Double longitude, Integer radius);
}
