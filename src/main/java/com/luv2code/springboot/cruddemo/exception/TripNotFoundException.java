package com.luv2code.springboot.cruddemo.exception;

public class TripNotFoundException extends  RuntimeException{
    public TripNotFoundException() {
    }

    public TripNotFoundException(Throwable cause) {
        super(cause);
    }

    public TripNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public TripNotFoundException(String message) {
        super(message);
    }
}
