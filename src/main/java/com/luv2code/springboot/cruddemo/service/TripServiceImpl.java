package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.dao.TripDAO;
import com.luv2code.springboot.cruddemo.decorator.BaseTripDecorator;
import com.luv2code.springboot.cruddemo.decorator.ChildSeatTripDecorator;
import com.luv2code.springboot.cruddemo.decorator.PremiumTripDecorator;
import com.luv2code.springboot.cruddemo.decorator.TripDecorator;
import com.luv2code.springboot.cruddemo.entites.*;
import com.luv2code.springboot.cruddemo.exception.*;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TripServiceImpl implements TripService {

    private final TripDAO tripDAO;

    @Autowired
    @Lazy
    private DriverService driverService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private LocationService locationService;
    @Autowired
    private DistanceCalculatorService distanceService;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    @Lazy
    private CarService carService;

    @Autowired
    public TripServiceImpl(TripDAO tripDAO) {
        this.tripDAO = tripDAO;
    }

    @Transactional
    public double calculateFare(String pickup, String destination, Trip trip) {
        double[] pickupCoords = locationService.getCoordinates(pickup);
        double[] destCoords = locationService.getCoordinates(destination);

        double distance = distanceService.calculateDistance(
                pickupCoords[0], pickupCoords[1],
                destCoords[0], destCoords[1]);

        double baseFare = 11.80;
        double ratePerKm = 4.30;
        trip.setFare(baseFare + (distance * ratePerKm));

        // Decorator pattern
        TripDecorator tripDecorator = new BaseTripDecorator(trip);

        if (trip.isPremium()) {
            tripDecorator = new PremiumTripDecorator(tripDecorator);
            trip.setPremium(true);
        }
        if (trip.isHasChildSeat()) {
            tripDecorator = new ChildSeatTripDecorator(tripDecorator);
            trip.setHasChildSeat(true);
        }

        double finalFare = tripDecorator.getFare();
        trip.setFare(finalFare); // مهم: تعديل الـ fare هنا
        return finalFare;
    }

    public int calculateEstimatedMinutes(String pickup, String destination) {
        double[] pickupCoords = locationService.getCoordinates(pickup);
        double[] destCoords = locationService.getCoordinates(destination);

        double distance = distanceService.calculateDistance(
                pickupCoords[0], pickupCoords[1],
                destCoords[0], destCoords[1]);

        int averageSpeedKmPerHour = 40;

        return (int) ((distance / averageSpeedKmPerHour) * 60) + 10;
    }

    @Transactional
    @Override
    public Trip save(Trip trip) {
        return tripDAO.save(trip);
    }

    @Override
    public List<Trip> findByStatus(TripStatus status) {
        return tripDAO.findByStatus(status);
    }

    @Transactional
    @Override
    public Trip bookTrip(Trip newTrip, Long customerId, PaymentMethod paymentMethod) {
        Customer customer = customerService.findById(customerId);
        if (customer == null)
            throw new CustomerNotFoundException("This Customer not found");

        newTrip.setCustomer(customer);

        // حساب الـ fare باستخدام decorators
        calculateFare(newTrip.getPickupLocation(), newTrip.getDestination(), newTrip);

        newTrip.setEstimatedMinutes(
                calculateEstimatedMinutes(newTrip.getPickupLocation(), newTrip.getDestination()));
        newTrip.setStatus(TripStatus.REQUESTED);

        LocalDateTime currentDate = LocalDateTime.now();
        if (newTrip.getTripDate().equals(currentDate) || newTrip.getTripDate().isBefore(currentDate)) {
            throw new InvalidTripDateException("The date you entered is not valid");
        }

        // Save النهائي بعد تعديل fare
        Trip trip = tripDAO.save(newTrip);

        // بعد كده التعامل مع الدفع
        paymentService.choosePayment(trip, paymentMethod);

        return trip;
    }

    @Override
    public Trip findById(long id) {
        return tripDAO.findById(id);
    }

    @Transactional
    @Override
    public Trip acceptTrip(long driverId, long tripId) {
        Driver driver = driverService.findById(driverId);
        Car car = carService.findByDriverId(driverId);
        if (car == null)
            throw new CarNotFoundException("You cannot accept this trip — a car has not been assigned to you yet.");
        if (driver == null)
            throw new DriverNotFoundException("Driver not found");
        if (!driver.isAvailable())
            throw new DriverBookedMoreThan3TripsException("The driver cant book more than 3 trips");
        Trip trip = tripDAO.findById(tripId);
        if (trip == null)
            throw new TripNotFoundException("Trip not found");
        if (trip.getStatus() != TripStatus.REQUESTED) {
            throw new RuntimeException("This trip is not available for acceptance.");
        }
        List<Trip> driverTrips = tripDAO.findByDriverIdAndStatusIn(
                driverId, List.of(TripStatus.ACCEPTED, TripStatus.ONGOING));
        LocalDateTime newStart = trip.getTripDate();
        LocalDateTime newEnd = newStart.plusMinutes(trip.getEstimatedMinutes());
        long MIN_GAP_MINUTES = 30;
        for (Trip existingTrip : driverTrips) {
            LocalDateTime existingStart = existingTrip.getTripDate();
            LocalDateTime existingEnd = existingStart.plusMinutes(existingTrip.getEstimatedMinutes());
            boolean overlap = !(newEnd.isBefore(existingStart) || newStart.isAfter(existingEnd));
            long gapBefore = Duration.between(existingEnd, newStart).toMinutes();
            long gapAfter = Duration.between(newEnd, existingStart).toMinutes();
            if (overlap) {
                throw new OverlapsTripsException(
                        "⚠️ You cannot accept this trip because it overlaps with another trip.");
            }
            if ((gapBefore < MIN_GAP_MINUTES && gapBefore >= 0) ||
                    (gapAfter < MIN_GAP_MINUTES && gapAfter >= 0)) {
                throw new GapBetweenTripsException(
                        "⚠️ There must be at least a " + MIN_GAP_MINUTES + " minute gap between trips.");
            }
        }

        driver.setCurrentBookedTrips(driver.getCurrentBookedTrips() + 1);
        if (driver.getCurrentBookedTrips() == 3)
            driver.setAvailable(false);

        trip.setDriver(driver);
        trip.setStatus(TripStatus.ACCEPTED);
        tripDAO.save(trip);

        return trip;
    }

    @Override
    public List<Trip> getDriverActiveTrips(long driverId) {
        checkExpiredTrips();
        return tripDAO.findByDriverIdAndStatusIn(driverId, List.of(TripStatus.ACCEPTED, TripStatus.ONGOING));
    }

    @Override
    public List<Trip> findRequestedTrips() {
        checkExpiredTrips();
        List<Trip> trips = tripDAO.findByStatus(TripStatus.REQUESTED);
        if (trips == null || trips.isEmpty()) {
            throw new TripNotFoundException("No requested trips found");
        }
        return trips;
    }

    @Transactional
    @Override
    public void checkExpiredTrips() {
        int updated = tripDAO.markExpiredTrips();
        System.out.println("✅ " + updated + " trips marked as EXPIRED.");
    }

    @Override
    public List<Trip> getCustomerPreviousTrips(long customerId) {
        List<Trip> trips = tripDAO.customerPreviousTrips(customerId);
        if (trips.isEmpty()) {
            throw new TripNotFoundException("No previous trips found for customer with ID: " + customerId);
        }
        return trips;
    }

    @Transactional
    @Override
    public Trip driverStartTrip(long driverId, long tripId) {
        checkExpiredTrips();
        Trip trip = tripDAO.findById(tripId);
        if (trip == null)
            throw new TripNotFoundException("The trip id not found " + tripId);

        Driver driver = driverService.findById(driverId);
        if (driver == null)
            throw new DriverNotFoundException("The driver not found");

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tripTime = trip.getTripDate();
        if (now.isBefore(tripTime.minusMinutes(10)) || now.isAfter(tripTime.plusMinutes(10))) {
            throw new StartBeforeScheduledTimeException(
                    "You can only start the trip within 10 minutes before or after the scheduled time");
        }

        trip.setStatus(TripStatus.ONGOING);
        return trip;
    }

    @Transactional
    @Override
    public Trip driverEndTrip(long driverId, long tripId) {
        Trip trip = tripDAO.findById(tripId);
        if (trip == null)
            throw new TripNotFoundException("The trip id not found " + tripId);

        Driver driver = driverService.findById(driverId);
        if (driver == null)
            throw new DriverNotFoundException("The driver not found");

        trip.setStatus(TripStatus.COMPLETED);
        driver.setAvailable(true);
        driver.setCurrentBookedTrips(driver.getCurrentBookedTrips() - 1);
        paymentService.donePayment(tripId);

        return trip;
    }

    @Transactional
    @Override
    public Trip canceledByCustomer(long customerId, long tripId) {
        Trip trip = tripDAO.findById(tripId);
        if (trip == null)
            throw new TripNotFoundException("The trip id not found " + tripId);

        Customer customer = customerService.findById(customerId);
        if (customer == null)
            throw new CustomerNotFoundException("The Customer not found");

        trip.setStatus(TripStatus.CANCELLED_BY_CUSTOMER);

        if (trip.getDriver() != null) {
            Driver driver = driverService.findById(trip.getDriver().getId());
            trip.getDriver().setAvailable(true);
            driver.setCurrentBookedTrips(driver.getCurrentBookedTrips() - 1);
        }

        return trip;
    }

    @Transactional
    @Override
    public Trip canceledByDriver(long driverId, long tripId) {
        Trip trip = tripDAO.findById(tripId);
        if (trip == null)
            throw new TripNotFoundException("The trip id not found " + tripId);

        Driver driver = driverService.findById(driverId);
        if (driver == null)
            throw new CustomerNotFoundException("The Customer not found");

        trip.setStatus(TripStatus.REQUESTED);
        driver.setCurrentBookedTrips(driver.getCurrentBookedTrips() - 1);
        driver.setAvailable(true);
        trip.setDriver(null);

        tripDAO.save(trip);
        return trip;
    }

    @Override
    @Transactional
    public List<Trip> getCustomerTrips(long customerId) {
        return tripDAO.getCustomerTrips(customerId);
    }
}
