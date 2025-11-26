package com.luv2code.springboot.cruddemo.decorator;

public class ChildSeatTripDecorator implements TripDecorator {

    private TripDecorator decoratedTrip;

    public ChildSeatTripDecorator(TripDecorator decoratedTrip) {
        this.decoratedTrip = decoratedTrip;
    }

    @Override
    public double getFare() {
        return decoratedTrip.getFare() + 15;
    }

    @Override
    public com.luv2code.springboot.cruddemo.entites.Trip getTrip() {
        return decoratedTrip.getTrip();
    }

}
