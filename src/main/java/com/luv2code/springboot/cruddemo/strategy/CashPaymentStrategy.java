package com.luv2code.springboot.cruddemo.strategy;


import com.luv2code.springboot.cruddemo.entites.Payment;
import com.luv2code.springboot.cruddemo.entites.PaymentMethod;
import com.luv2code.springboot.cruddemo.entites.PaymentStatus;
import com.luv2code.springboot.cruddemo.entites.Trip;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component("CASH")
public class CashPaymentStrategy implements PaymentStrategy {
    @Override
    public Payment pay(Trip trip) {
        Payment payment = new Payment();
        payment.setTrip(trip);
        payment.setAmount((trip.getFare()));
        payment.setMethod(PaymentMethod.CASH);
        return payment;
    }
}