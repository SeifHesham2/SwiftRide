package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Payment;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentDAO {

    Payment save(Payment payment);

    Payment findById(long id);

    List<Payment> findAll();

    void deleteById(long id);

    public Payment findByTripId(Long tripId);
}
