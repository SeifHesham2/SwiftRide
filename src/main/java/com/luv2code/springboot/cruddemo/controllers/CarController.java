package com.luv2code.springboot.cruddemo.controllers;

import com.luv2code.springboot.cruddemo.dto.CarDTO;
import com.luv2code.springboot.cruddemo.entites.Car;
import com.luv2code.springboot.cruddemo.mapper.CarMapper;
import com.luv2code.springboot.cruddemo.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    @Autowired
    private CarService carService;


    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        List<CarDTO> carDTOs = carService.findAll()
                .stream()
                .map(CarMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(carDTOs);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getCarById(@PathVariable long id) {
            Car car = carService.findById(id);
            return ResponseEntity.ok(CarMapper.toDTO(car));

    }


    @PostMapping("/register")
    public ResponseEntity<?> registerCar(
            @RequestBody Car car,
            @RequestParam(required = false) Long driverId) {
            Car savedCar = carService.registerCar(car, driverId);
            return ResponseEntity.ok(CarMapper.toDTO(savedCar));

    }


    @PostMapping("/assign")
    public ResponseEntity<?> assignCarToDriver(
            @RequestParam long carId,
            @RequestParam long driverId) {
            Car updatedCar = carService.assignCarToDriver(carId, driverId);
            return ResponseEntity.ok(CarMapper.toDTO(updatedCar));

    }


    @GetMapping("/available")
    public ResponseEntity<List<CarDTO>> getAvailableCars() {
        List<CarDTO> availableCars = carService.findAvailableCars()
                .stream()
                .map(CarMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(availableCars);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable long id) {
            carService.deleteById(id);
            return ResponseEntity.ok("Car deleted successfully.");

    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<?> getCarsByDriverId(@PathVariable long driverId) {
        Car car = carService.findByDriverId(driverId);
        CarDTO carDTO = CarMapper.toDTO(car);
        return ResponseEntity.ok(carDTO);
    }
}
