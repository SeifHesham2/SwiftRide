package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Car;
import java.util.List;

public interface CarDAO {

    List<Car> findAll();

    Car findById(long id);

    Car save(Car car);

    void deleteById(long id);

    List<Car> findAvailableCars();

    Car findByDriverId(long driverId);
}
