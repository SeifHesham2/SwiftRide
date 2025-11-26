package com.luv2code.springboot.cruddemo.decorator;

import com.luv2code.springboot.cruddemo.entites.Trip;

public interface TripDecorator {

    double getFare();
    Trip getTrip();
}
