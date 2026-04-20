package com.codexist.places.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

/**
 * Veritabanındaki "places_cache" tablosunu temsil eden JPA entity sınıfı.
 *
 * Her kayıt bir Google Places API sorgusuna karşılık gelir.
 * Aynı lat+lon+radius kombinasyonu tekrar istendiğinde Google'a gidilmez,
 * bu tablodan döndürülür.
 */
@Entity
@Table(name = "places_cache")
public class PlacesCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Arama merkezinin enlemi — cache key'in bir parçası
    @Column(nullable = false)
    private Double latitude;

    // Arama merkezinin boylamı — cache key'in bir parçası
    @Column(nullable = false)
    private Double longitude;

    // Arama yarıçapı (metre) — latitude+longitude+radius üçlüsü unique bir sorguyu tanımlar
    @Column(nullable = false)
    private Integer radius;

    // Google Places API'den gelen ham JSON yanıtı.
    // TEXT tipi kullandık çünkü VARCHAR(255) uzun JSON string'leri için yetersiz kalır.
    @Column(nullable = false, columnDefinition = "TEXT")
    private String responseJson;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // JPA için parametresiz constructor zorunlu
    public PlacesCache() {
    }

    public PlacesCache(Double latitude, Double longitude, Integer radius, String responseJson) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.radius = radius;
        this.responseJson = responseJson;
    }

    /**
     * JPA entity ilk kez kaydedilmeden önce otomatik çalışır.
     * createdAt alanını elle set etmeye gerek kalmaz, her zaman doğru anı yazar.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public Integer getRadius() { return radius; }
    public String getResponseJson() { return responseJson; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
