package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.entites.Car;
import java.util.List;

public interface CarService {


    List<Car> findAll();


    Car findById(long id);


    Car registerCar(Car car, Long driverId);


    Car assignCarToDriver(long carId, long driverId);


    void deleteById(long id);


    List<Car> findAvailableCars();


    Car findByDriverId(long driverId);
}
