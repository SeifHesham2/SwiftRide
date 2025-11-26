package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.dao.CarDAO;
import com.luv2code.springboot.cruddemo.entites.Car;
import com.luv2code.springboot.cruddemo.entites.Driver;
import com.luv2code.springboot.cruddemo.exception.CarHasDriverException;
import com.luv2code.springboot.cruddemo.exception.CarLicensePlateExistsException;
import com.luv2code.springboot.cruddemo.exception.CarNotFoundException;
import com.luv2code.springboot.cruddemo.exception.DriverHasCarException;
import com.luv2code.springboot.cruddemo.exception.DriverNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CarServiceImpl implements CarService {

    @Autowired
    private CarDAO carDAO;

    @Autowired
    private DriverService driverService;

    @Override
    public List<Car> findAll() {
        return carDAO.findAll();
    }

    @Override
    public Car findById(long id) {
        Car car = carDAO.findById(id);
        if (car == null) {
            throw new CarNotFoundException("❌ Car not found with id: " + id);
        }
        return car;
    }

    @Override
    public Car registerCar(Car car, Long driverId) {
        // Check if license plate already exists
        Car existingCar = carDAO.findByLicensePlate(car.getLicensePlate());
        if (existingCar != null) {
            throw new CarLicensePlateExistsException(
                    "🚗 A car with license plate '" + car.getLicensePlate()
                            + "' is already registered in the system. Please use a different license plate.");
        }

        if (driverId != null) {
            Driver driver = driverService.findById(driverId);
            if (driver == null) {
                throw new DriverNotFoundException("❌ Driver not found with id: " + driverId);
            }

            Car driverCar = carDAO.findByDriverId(driverId);
            if (driverCar != null) {
                throw new DriverHasCarException("❌ Driver already has a car assigned");
            }

            car.setDriver(driver);
        }
        return carDAO.save(car);
    }

    @Override
    public Car assignCarToDriver(long carId, long driverId) {
        Car car = findById(carId);
        Driver driver = driverService.findById(driverId);

        if (car.getDriver() != null) {
            throw new CarHasDriverException("❌ This car is already assigned to a driver");
        }

        Car driverCar = carDAO.findByDriverId(driverId);
        if (driverCar != null) {
            throw new DriverHasCarException("❌ Driver already has a car assigned");
        }
        car.setDriver(driver);
        return carDAO.save(car);
    }

    @Override
    public void deleteById(long id) {
        Car car = findById(id);
        carDAO.deleteById(car.getId());
    }

    @Override
    public List<Car> findAvailableCars() {
        return carDAO.findAvailableCars();
    }

    @Override
    public Car findByDriverId(long driverId) {
        return carDAO.findByDriverId(driverId);
    }
}
