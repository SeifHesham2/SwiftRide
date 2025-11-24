package com.luv2code.springboot.cruddemo.controllers;

import com.luv2code.springboot.cruddemo.dto.TripDTO;
import com.luv2code.springboot.cruddemo.entites.PaymentMethod;
import com.luv2code.springboot.cruddemo.entites.Trip;
import com.luv2code.springboot.cruddemo.mapper.CustomerMapper;
import com.luv2code.springboot.cruddemo.mapper.DriverMapper;
import com.luv2code.springboot.cruddemo.mapper.TripMapper;
import com.luv2code.springboot.cruddemo.service.TripService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Trip Controller - REST API endpoints for trip management
 * 
 * Handles all trip-related operations including:
 * - Booking new trips
 * - Driver accepting trips
 * - Starting and ending trips
 * - Cancelling trips (by customer or driver)
 * - Retrieving trip history and active trips
 * 
 * All endpoints return TripDTO objects to avoid exposing internal entity
 * structure
 * 
 * @author MiniUber Development Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/trips")
public class TripController {

    @Autowired
    private TripService tripService;

    /**
     * Book a new trip
     * 
     * Creates a new trip request with REQUESTED status. The trip will be available
     * for drivers to accept. Calculates fare and estimated time based on distance.
     * Also creates a payment record with the specified payment method.
     * 
     * @param customerId    ID of the customer booking the trip
     * @param tripRequest   Trip details (pickup location, destination, trip date)
     * @param paymentMethod Payment method (CASH, CREDIT_CARD, DEBIT_CARD, etc.)
     * @return ResponseEntity with TripDTO containing trip details and HTTP 200 OK
     * @throws CustomerNotFoundException            if customer ID is invalid
     * @throws InvalidTripDateException             if trip date is in the past
     * @throws PaymentMethodIsNotSupportedException if payment method is not
     *                                              supported
     */
    @PostMapping("/book")
    public ResponseEntity<?> bookTrip(@RequestParam Long customerId,
            @Valid @RequestBody Trip tripRequest,
            @RequestParam PaymentMethod paymentMethod) {
        Trip trip = tripService.bookTrip(tripRequest, customerId, paymentMethod);
        TripDTO tripDTO = TripMapper.tripDTO(trip);
        return ResponseEntity.ok(tripDTO);
    }

    /**
     * Driver accepts a trip
     * 
     * Assigns the driver to the trip and changes status from REQUESTED to ACCEPTED.
     * Validates that:
     * - Driver exists and is available
     * - Driver hasn't exceeded maximum trip limit (3 trips)
     * - Trip doesn't overlap with driver's other trips
     * - There's adequate gap between trips (30 minutes)
     * 
     * @param driverId ID of the driver accepting the trip
     * @param tripId   ID of the trip to accept
     * @return ResponseEntity with TripDTO and HTTP 200 OK
     * @throws DriverNotFoundException             if driver ID is invalid
     * @throws TripNotFoundException               if trip ID is invalid
     * @throws DriverNotAvailableException         if driver is not available
     * @throws DriverBookedMoreThan3TripsException if driver has 3 active trips
     * @throws OverlapsTripsException              if trip overlaps with existing
     *                                             trips
     * @throws GapBetweenTripsException            if insufficient gap between trips
     */
    @PostMapping("/accept/{tripId}")
    public ResponseEntity<?> acceptTrip(@RequestParam Long driverId, @PathVariable long tripId) {
        Trip trip = tripService.acceptTrip(driverId, tripId);
        TripDTO tripDTO = TripMapper.tripDTO(trip);
        return ResponseEntity.ok(tripDTO);
    }

    /**
     * Get all trips with REQUESTED status
     * 
     * Returns all trips that are waiting for a driver to accept them.
     * Useful for drivers to see available trips in their area.
     * 
     * @return ResponseEntity with list of TripDTOs and HTTP 200 OK
     */
    @GetMapping("/requested")
    public ResponseEntity<?> getRequestedTrips() {
        List<Trip> trips = tripService.findRequestedTrips();
        List<TripDTO> tripDTOs = trips.stream()
                .map(TripMapper::tripDTO)
                .toList();
        return ResponseEntity.ok(tripDTOs);
    }

    /**
     * Driver starts a trip
     * 
     * Changes trip status from ACCEPTED to IN_PROGRESS.
     * Validates that the driver is assigned to this trip and that
     * the trip start time is not before the scheduled time.
     * 
     * @param driverId ID of the driver starting the trip
     * @param tripId   ID of the trip to start
     * @return ResponseEntity with TripDTO and HTTP 200 OK
     * @throws DriverNotFoundException           if driver ID is invalid
     * @throws TripNotFoundException             if trip ID is invalid
     * @throws StartBeforeScheduledTimeException if starting before scheduled time
     */
    @PostMapping("/start/{tripId}")
    public ResponseEntity<?> driverStartTrip(@RequestParam Long driverId, @PathVariable long tripId) {
        Trip trip = tripService.driverStartTrip(driverId, tripId);
        TripDTO tripDTO = TripMapper.tripDTO(trip);
        return ResponseEntity.ok(tripDTO);
    }

    /**
     * Driver ends a trip
     * 
     * Changes trip status from IN_PROGRESS to COMPLETED.
     * Updates driver's availability and decrements their current booked trips
     * count.
     * Payment status is updated to COMPLETED.
     * 
     * @param driverId ID of the driver ending the trip
     * @param tripId   ID of the trip to end
     * @return ResponseEntity with TripDTO and HTTP 200 OK
     * @throws DriverNotFoundException if driver ID is invalid
     * @throws TripNotFoundException   if trip ID is invalid
     */
    @PostMapping("/end/{tripId}")
    public ResponseEntity<?> driverEndTrip(@RequestParam Long driverId, @PathVariable long tripId) {
        Trip trip = tripService.driverEndTrip(driverId, tripId);
        TripDTO tripDTO = TripMapper.tripDTO(trip);
        return ResponseEntity.ok(tripDTO);
    }

    /**
     * Customer cancels a trip
     * 
     * Changes trip status to CANCELLED_BY_CUSTOMER.
     * Frees up the driver's slot if a driver was assigned.
     * Payment status is updated to CANCELLED.
     * 
     * @param customerId ID of the customer cancelling the trip
     * @param tripId     ID of the trip to cancel
     * @return ResponseEntity with TripDTO and HTTP 200 OK
     * @throws CustomerNotFoundException if customer ID is invalid
     * @throws TripNotFoundException     if trip ID is invalid
     */
    @PostMapping("/cancel/customer/{tripId}")
    public ResponseEntity<?> canceledByCustomer(@RequestParam Long customerId, @PathVariable long tripId) {
        Trip trip = tripService.canceledByCustomer(customerId, tripId);
        TripDTO tripDTO = TripMapper.tripDTO(trip);
        return ResponseEntity.ok(tripDTO);
    }

    /**
     * Driver cancels a trip
     * 
     * Changes trip status to CANCELLED_BY_DRIVER.
     * Frees up the driver's slot and makes the trip available for other drivers.
     * Payment status is updated to CANCELLED.
     * 
     * @param driverId ID of the driver cancelling the trip
     * @param tripId   ID of the trip to cancel
     * @return ResponseEntity with TripDTO and HTTP 200 OK
     * @throws DriverNotFoundException if driver ID is invalid
     * @throws TripNotFoundException   if trip ID is invalid
     */
    @PostMapping("/cancel/driver/{tripId}")
    public ResponseEntity<?> canceledByDriver(@RequestParam Long driverId, @PathVariable long tripId) {
        Trip trip = tripService.canceledByDriver(driverId, tripId);
        TripDTO tripDTO = TripMapper.tripDTO(trip);
        return ResponseEntity.ok(tripDTO);
    }

    /**
     * Get all trips for a specific customer
     * 
     * Returns all trips (past and present) for the given customer.
     * Includes trips in all statuses: REQUESTED, ACCEPTED, IN_PROGRESS,
     * COMPLETED, CANCELLED_BY_CUSTOMER, CANCELLED_BY_DRIVER.
     * 
     * @param customerId ID of the customer
     * @return ResponseEntity with list of TripDTOs and HTTP 200 OK
     * @throws CustomerNotFoundException if customer ID is invalid
     */
    @GetMapping("/customer/trips/{customerId}")
    public ResponseEntity<?> getCustomerTrips(@PathVariable long customerId) {
        List<Trip> trips = tripService.getCustomerTrips(customerId);
        List<TripDTO> tripDTOs = trips.stream()
                .map(TripMapper::tripDTO)
                .toList();
        return ResponseEntity.ok(tripDTOs);
    }

    /**
     * Get active trips for a specific driver
     * 
     * Returns all trips that are currently active for the driver.
     * Includes trips with status: ACCEPTED or IN_PROGRESS.
     * Does not include completed or cancelled trips.
     * 
     * @param driverId ID of the driver
     * @return ResponseEntity with list of TripDTOs and HTTP 200 OK
     * @throws DriverNotFoundException if driver ID is invalid
     */
    @GetMapping("/driver/trips/active/{driverId}")
    public ResponseEntity<?> getDriverActiveTrips(@PathVariable long driverId) {
        List<Trip> trips = tripService.getDriverActiveTrips(driverId);
        List<TripDTO> tripDTOs = trips.stream()
                .map(TripMapper::tripDTO)
                .toList();
        return ResponseEntity.ok(tripDTOs);
    }

    /**
     * Get previous/completed trips for a customer
     * 
     * Returns all trips that have been completed for the given customer.
     * Only includes trips with COMPLETED status.
     * Useful for trip history and generating receipts.
     * 
     * @param customerId ID of the customer
     * @return ResponseEntity with list of TripDTOs and HTTP 200 OK
     * @throws CustomerNotFoundException if customer ID is invalid
     */
    @GetMapping("/customer/previous-trips")
    public ResponseEntity<?> getCustomerPreviousTrips(@RequestParam long customerId) {
        List<Trip> trips = tripService.getCustomerPreviousTrips(customerId);
        List<TripDTO> tripDTOs = trips.stream()
                .map(TripMapper::tripDTO)
                .toList();
        return ResponseEntity.ok(tripDTOs);
    }

}
