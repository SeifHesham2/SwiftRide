package com.luv2code.springboot.cruddemo.mapper;

import com.luv2code.springboot.cruddemo.dto.DriverDTO;
import com.luv2code.springboot.cruddemo.entites.Driver;

public class DriverMapper {

    public static DriverDTO toDTO(Driver driver) {
        DriverDTO dto = new DriverDTO();
        dto.setId(driver.getId());
        dto.setCurrentBookedTrips(dto.getCurrentBookedTrips());
        dto.setFirstName(driver.getFirstName());
        dto.setLastName(driver.getLastName());
        dto.setEmail(driver.getEmail());
        dto.setPhone(driver.getPhone());
        dto.setRating(driver.getRating());
        dto.setLicenseNumber(driver.getLicenseNumber());
        dto.setAvailable(driver.isAvailable());
        return dto;
    }
}