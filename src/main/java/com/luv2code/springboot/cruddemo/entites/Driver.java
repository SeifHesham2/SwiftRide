package com.luv2code.springboot.cruddemo.entites;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "drivers")
@AttributeOverride(name = "id", column = @Column(name = "driver_id"))
public class Driver extends UserBase {

    @Min(value = 0, message = "Rating cannot be less than 0")
    @Max(value = 5, message = "Rating cannot be more than 5")
    @Column(name = "rating")
    int rating;

    @NotBlank(message = "License number is required")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "License number must contain only uppercase letters, numbers, or dashes")
    @Column(name = "license_number", unique = true)
    String licenseNumber;

    @Column(name = "available")
    private boolean available = true;
    @Max(value = 3, message = "Driver cant book more than 3 trips")
    @Column(name = "current_booked_trips")
    int currentBookedTrips;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    // Getter for imageUrl
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getCurrentBookedTrips() {
        return currentBookedTrips;
    }

    public void setCurrentBookedTrips(int currentBookedTrips) {
        this.currentBookedTrips = currentBookedTrips;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
