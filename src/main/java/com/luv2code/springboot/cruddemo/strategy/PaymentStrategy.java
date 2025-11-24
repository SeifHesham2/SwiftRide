package com.luv2code.springboot.cruddemo.strategy;

import com.luv2code.springboot.cruddemo.entites.Payment;
import com.luv2code.springboot.cruddemo.entites.Trip;

public interface PaymentStrategy {
    Payment pay(Trip trip);

}
