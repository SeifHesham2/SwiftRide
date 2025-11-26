package com.luv2code.springboot.cruddemo.controllers;

import com.luv2code.springboot.cruddemo.dto.DriverDTO;
import com.luv2code.springboot.cruddemo.entites.Driver;
import com.luv2code.springboot.cruddemo.mapper.DriverMapper;
import com.luv2code.springboot.cruddemo.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.luv2code.springboot.cruddemo.service.ImageService;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {
    private final DriverService driverService;
    private final ImageService imageService;

    public DriverController(DriverService driverService, ImageService imageService) {
        this.driverService = driverService;
        this.imageService = imageService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Driver driver) {
        Driver newDriver = driverService.save(driver);
        DriverDTO dto = DriverMapper.toDTO(newDriver);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<?> update(@RequestBody Driver driver, @PathVariable long id) {
        Driver updated = driverService.partialUpdate(driver, id);
        DriverDTO dto = DriverMapper.toDTO(updated);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Driver loginDriver) {
        Driver driver = driverService.login(loginDriver.getEmail(), loginDriver.getPassword());
        DriverDTO dto = DriverMapper.toDTO(driver);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping("/without-car")
    public ResponseEntity<List<Driver>> getDriversWithoutCar() {
        List<Driver> drivers = driverService.findDriversWithoutCar();
        return ResponseEntity.ok(drivers);
    }

    @PostMapping("/rate/{driverId}")
    public ResponseEntity<?> rateDriver(@RequestParam int rating, @RequestParam long tripId,
            @PathVariable long driverId) {
        Driver driver = driverService.rateTheDriver(driverId, rating, tripId);
        DriverDTO dto = DriverMapper.toDTO(driver);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PostMapping("/upload-photo/{id}")
    public ResponseEntity<?> uploadPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = imageService.uploadImage(file);
            Driver updated = driverService.uploadPhoto(id, imageUrl);
            DriverDTO dto = DriverMapper.toDTO(updated);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to upload image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
