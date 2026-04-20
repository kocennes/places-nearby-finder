package com.codexist.places.model;

import jakarta.persistence.*;
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

    // Arama yarıçapı (metre) — cache key'in bir parçası
    @Column(nullable = false)
    private Integer radius;

    // Google Places API'den gelen ham JSON yanıtı
    @Column(nullable = false, columnDefinition = "TEXT")
    private String responseJson;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // JPA için parametresiz constructor zorunlu
    public PlacesCache() {}

    private PlacesCache(Builder builder) {
        this.latitude = builder.latitude;
        this.longitude = builder.longitude;
        this.radius = builder.radius;
        this.responseJson = builder.responseJson;
    }

    /**
     * JPA entity ilk kez kaydedilmeden önce otomatik çalışır.
     * createdAt alanını elle set etmeye gerek kalmaz.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // --- Getters ---

    public Long getId() { return id; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public Integer getRadius() { return radius; }
    public String getResponseJson() { return responseJson; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // --- Setters ---

    public void setId(Long id) { this.id = id; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public void setRadius(Integer radius) { this.radius = radius; }
    public void setResponseJson(String responseJson) { this.responseJson = responseJson; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // --- Builder pattern ---

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Double latitude;
        private Double longitude;
        private Integer radius;
        private String responseJson;

        public Builder latitude(Double latitude) { this.latitude = latitude; return this; }
        public Builder longitude(Double longitude) { this.longitude = longitude; return this; }
        public Builder radius(Integer radius) { this.radius = radius; return this; }
        public Builder responseJson(String responseJson) { this.responseJson = responseJson; return this; }

        public PlacesCache build() {
            return new PlacesCache(this);
        }
    }
}
