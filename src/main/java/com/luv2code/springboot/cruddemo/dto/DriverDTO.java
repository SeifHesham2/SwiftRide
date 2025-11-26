package com.luv2code.springboot.cruddemo.dto;

public class DriverDTO extends UserBaseDTO {
    private int rating;
    private String licenseNumber;
    private boolean available;
    private int currentBookedTrips;
    private String imageUrl;

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

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
