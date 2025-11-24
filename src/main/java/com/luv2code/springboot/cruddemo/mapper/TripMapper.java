package com.luv2code.springboot.cruddemo.mapper;

import com.luv2code.springboot.cruddemo.dto.TripDTO;
import com.luv2code.springboot.cruddemo.entites.Trip;

public class TripMapper {
    public static TripDTO tripDTO(Trip trip) {
        TripDTO dto = new TripDTO();
        dto.setId(trip.getId());
        dto.setPickupLocation(trip.getPickupLocation());
        dto.setDestination(trip.getDestination());
        dto.setFare(trip.getFare());
        dto.setStatus(trip.getStatus().name());
        dto.setCreatedAt(trip.getCreatedAt());
        dto.setTripDate(trip.getTripDate());
        dto.setEstimatedMinutes(trip.getEstimatedMinutes());
        dto.setRated(trip.isRated());
        if (trip.getDriver() != null) {
            dto.setDriver(DriverMapper.toDTO(trip.getDriver())); // لو عندك mapper للـ driver
        } else {
            dto.setDriver(null);
        }
        if (trip.getCustomer() != null) {
            dto.setCustomer(CustomerMapper.toDTO(trip.getCustomer()));
        } else {
            dto.setCustomer(null);
        }
        return dto;
    }
}
