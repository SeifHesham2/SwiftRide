package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.dao.DriverDAO;
import com.luv2code.springboot.cruddemo.entites.Driver;
import com.luv2code.springboot.cruddemo.entites.Trip;
import com.luv2code.springboot.cruddemo.exception.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverServiceImpl implements DriverService {
    private final BCryptPasswordEncoder passwordEncoder;
    private final DriverDAO driverDAO;
    private final TripService tripService;

    @Autowired
    public DriverServiceImpl(BCryptPasswordEncoder passwordEncoder, DriverDAO driverDAO,
            @Lazy TripService tripService) {
        this.passwordEncoder = passwordEncoder;
        this.driverDAO = driverDAO;
        this.tripService = tripService;
    }

    @Transactional
    @Override
    public Driver findFirstAvailableDriver() {
        return driverDAO.findFirstAvailableDriver();
    }

    @Transactional
    @Override
    public Driver save(Driver driver) {
        Driver newDriverEmail = driverDAO.findByEmail(driver.getEmail());
        if (newDriverEmail != null)
            throw new EmailAlreadyExistsException("The Driver Email is already Exists");
        Driver newDriverPhone = driverDAO.findByPhoneNumber(driver.getPhone());
        if (newDriverPhone != null)
            throw new PhoneNumberExistsException("The Driver Phone Number is already Exists");
        Driver newDriverLicenseNumber = driverDAO.findByLicenseNumber(driver.getLicenseNumber());
        if (newDriverLicenseNumber != null)
            throw new LicenseNumberExistsException("the LicenseNumber is already Exists");
        String encodedPassword = passwordEncoder.encode(driver.getPassword());
        driver.setPassword(encodedPassword);
        return driverDAO.save(driver);
    }

    @Override
    public Driver update(Driver driver) {
        return driverDAO.update(driver);
    }

    @Transactional
    @Override
    public Driver partialUpdate(Driver driver, long id) {
        Driver existing = driverDAO.findById(id);
        if (existing == null)
            throw new DriverNotFoundException("The Driver with this id not found");

        if (driver.getFirstName() != null) {
            existing.setFirstName(driver.getFirstName());
        }
        if (driver.getLastName() != null) {
            existing.setLastName(driver.getLastName());
        }
        if (driver.getPhone() != null) {
            Driver foundByPhone = driverDAO.findByPhoneNumber(driver.getPhone());

            if (foundByPhone != null && foundByPhone.getPhone() != existing.getPhone()) {
                throw new PhoneNumberExistsException("Phone number already registered: " + driver.getPhone());
            }
            existing.setPhone(driver.getPhone());
        }

        if (driver.getPassword() != null)
            existing.setPassword(passwordEncoder.encode(driver.getPassword()));

        return driverDAO.update(existing);

    }

    @Override
    public Driver findById(long id) {
        Driver driver = driverDAO.findById(id);
        if (driver == null)
            throw new DriverNotFoundException("driver not found " + id);
        return driver;
    }

    @Override
    public Driver login(String email, String password) {
        Driver driver = driverDAO.findByEmail(email);
        if (driver == null)
            throw new InvalidEmailOrPasswordException("the email or password you entered is not correct");
        boolean passwordMatches = checkPassword(password, driver.getPassword());
        if (!passwordMatches)
            throw new InvalidEmailOrPasswordException("the email or password you entered is not correct");
        return driver;
    }

    @Override
    public boolean checkPassword(String enteredPassword, String emailPassword) {
        boolean matches = false;
        matches = passwordEncoder.matches(enteredPassword, emailPassword);
        return matches;
    }

    @Transactional
    @Override
    public List<Driver> findDriversWithoutCar() {
        return driverDAO.findDriversWithoutCar();
    }

    @Transactional
    @Override
    public Driver rateTheDriver(long driverId, int rating, long tripId) {
        Driver driver = driverDAO.findById(driverId);
        Trip trip = tripService.findById(tripId);
        if (trip.isRated())
            throw new DriverIsAlreadyRated("can not rate driver twice for this trip");
        trip.setRated(true);
        tripService.save(trip);
        int prevRating = driver.getRating();
        int newRating = rating + prevRating / 2;
        if (newRating > 5)
            newRating = 5;
        driver.setRating(newRating);
        return driverDAO.save(driver);

    }

    @Transactional
    @Override
    public Driver uploadPhoto(long driverId, String imageUrl) {
        Driver driver = findById(driverId);
        driver.setImageUrl(imageUrl);
        return driverDAO.save(driver);
    }
}
