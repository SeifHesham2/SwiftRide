package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.entites.Payment;
import com.luv2code.springboot.cruddemo.entites.PaymentMethod;
import com.luv2code.springboot.cruddemo.entites.PaymentStatus;
import com.luv2code.springboot.cruddemo.entites.Trip;
import org.springframework.stereotype.Service;

@Service
public interface PaymentService {
    public Payment choosePayment(Trip trip, PaymentMethod method);
    public Payment donePayment(long tripId);

}
