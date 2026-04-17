package com.codexist.places.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Veritabanındaki "places_cache" tablosunu temsil eden JPA entity sınıfı.
 *
 * Her kayıt bir Google Places API sorgusuna karşılık gelir.
 * Aynı lat+lon+radius kombinasyonu tekrar istendiğinde Google'a gidilmez,
 * bu tablodan döndürülür.
 *
 * Lombok anotasyonları derleme sırasında kod üretir:
 * @Data             → tüm alanlar için getter/setter + equals/hashCode/toString
 * @Builder          → PlacesCache.builder()...build() şeklinde nesne oluşturmayı sağlar
 * @NoArgsConstructor → JPA'nın entity'yi yüklemesi için parametresiz constructor gerekir
 * @AllArgsConstructor → @Builder ile birlikte çalışması için tüm alanlı constructor üretir
 */
@Entity
@Table(name = "places_cache")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacesCache {

    // Otomatik artan birincil anahtar, her kayıt için benzersiz ID üretir
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Arama merkezinin enlemi — cache key'in bir parçası
    @Column(nullable = false)
    private Double latitude;

    // Arama merkezinin boylamı — cache key'in bir parçası
    @Column(nullable = false)
    private Double longitude;

    // Arama yarıçapı (metre) — cache key'in bir parçası
    // latitude + longitude + radius üçlüsü birlikte unique bir sorguyu tanımlar
    @Column(nullable = false)
    private Integer radius;

    /*
     * Google Places API'den gelen ham JSON yanıtı.
     * columnDefinition = "TEXT" → uzun JSON string'leri için VARCHAR(255) yeterli olmaz,
     * TEXT tipi sınırsız uzunlukta veri saklar.
     * Parse etmeden ham halde sakladık çünkü frontend zaten JSON bekliyor.
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String responseJson;

    // Kaydın ne zaman oluşturulduğunu tutar
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /**
     * JPA entity ilk kez kaydedilmeden (@PrePersist) önce otomatik çalışır.
     * createdAt alanını elle set etmeye gerek kalmaz, her zaman doğru anı yazar.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
