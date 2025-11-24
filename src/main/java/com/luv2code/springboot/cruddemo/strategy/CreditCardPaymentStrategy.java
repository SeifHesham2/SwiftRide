package com.luv2code.springboot.cruddemo.strategy;

import com.luv2code.springboot.cruddemo.entites.Payment;
import com.luv2code.springboot.cruddemo.entites.PaymentMethod;
import com.luv2code.springboot.cruddemo.entites.PaymentStatus;
import com.luv2code.springboot.cruddemo.entites.Trip;
import org.springframework.stereotype.Component;

@Component("CREDIT_CARD")
public class CreditCardPaymentStrategy implements PaymentStrategy {

    @Override
    public Payment pay(Trip trip) {
        Payment payment = new Payment();
        payment.setTrip(trip);
        payment.setAmount((trip.getFare()));
        payment.setMethod(PaymentMethod.CREDIT_CARD);

        return payment;
    }
}