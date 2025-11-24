package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Trip;
import com.luv2code.springboot.cruddemo.entites.TripStatus;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripDAO {
    public Trip save(Trip trip);
    List<Trip> findByStatus(TripStatus status);
    public Trip findById(long id);
    public List<Trip> getCustomerTrips(long customerId);
    public List<Trip> findByDriverIdAndStatusIn(Long driverId, List<TripStatus> statuses);
    public int markExpiredTrips();
    public List<Trip> customerPreviousTrips(long customerId);
}
