package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.entites.PaymentMethod;
import com.luv2code.springboot.cruddemo.entites.Trip;
import com.luv2code.springboot.cruddemo.entites.TripStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TripService {
    public Trip save(Trip trip);

    public List<Trip> findByStatus(TripStatus tripStatus);

    public Trip bookTrip(Trip trip, Long customerId , PaymentMethod paymentMethod);

    public Trip findById(long id);

    public Trip acceptTrip(long driverId , long tripId );

    public List<Trip> findRequestedTrips();

    public Trip driverStartTrip(long driverId , long tripId );

    public Trip driverEndTrip(long driverId , long tripId );

    public Trip canceledByCustomer(long customerId , long tripId );

    public Trip canceledByDriver(long driverId , long tripId );

    public List<Trip> getCustomerTrips(long customerId);

    public int calculateEstimatedMinutes(String pickup, String destination);

    public List<Trip> getDriverActiveTrips(long driverId);

    public void checkExpiredTrips();

    public List<Trip> getCustomerPreviousTrips(long customerId);


}
