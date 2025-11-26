package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.entites.Customer;
import com.luv2code.springboot.cruddemo.entites.Driver;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DriverService {
    public Driver findFirstAvailableDriver();

    public Driver save(Driver driver);

    public Driver update(Driver driver);

    public Driver partialUpdate(Driver driver, long id);

    public Driver findById(long id);

    public Driver login(String email, String password);

    public boolean checkPassword(String enteredPassword, String emailPassword);

    public List<Driver> findDriversWithoutCar();

    public Driver rateTheDriver(long driverId, int rating, long tripId);

    public Driver uploadPhoto(long driverId, String imageUrl);
}
