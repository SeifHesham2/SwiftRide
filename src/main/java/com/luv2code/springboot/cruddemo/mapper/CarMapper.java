package com.luv2code.springboot.cruddemo.mapper;

import com.luv2code.springboot.cruddemo.dto.CarDTO;
import com.luv2code.springboot.cruddemo.entites.Car;

public class CarMapper {
    public static CarDTO toDTO(Car car){
        CarDTO carDTO = new CarDTO();
        carDTO.setColor(car.getColor());
        carDTO.setId(car.getId());
        carDTO.setModel(car.getModel());
        carDTO.setLicensePlate(car.getLicensePlate());
        carDTO.setCreatedAt(car.getCreatedAt());
        if (car.getDriver() != null) {
            carDTO.setDriver(DriverMapper.toDTO(car.getDriver()));
        } else {
            carDTO.setDriver(null);
        }
        return  carDTO;
    }
}
