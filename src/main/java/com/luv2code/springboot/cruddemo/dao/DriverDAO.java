package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Driver;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverDAO {
    public Driver findFirstAvailableDriver();
    public  Driver save(Driver driver);
    public  Driver findByEmail(String email);
    public  Driver findByPhoneNumber(String phone);
    public  Driver update(Driver driver);
    public  Driver findById(long id);
    public Driver findByLicenseNumber(String licenseNumber );
    public List<Driver> findDriversWithoutCar();
}
