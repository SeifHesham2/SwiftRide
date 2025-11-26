package com.luv2code.springboot.cruddemo.decorator;

import com.luv2code.springboot.cruddemo.entites.Trip;

public class BaseTripDecorator implements TripDecorator {
    protected Trip trip;

    public BaseTripDecorator(Trip trip) {
        this.trip = trip;
    }

    @Override
    public double getFare() {
        return trip.getFare();
    }

    @Override
    public Trip getTrip() {
        return trip;
    }

}
