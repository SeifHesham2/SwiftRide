package com.luv2code.springboot.cruddemo.exception;

public class DriverBookedMoreThan3TripsException extends RuntimeException
{
    public DriverBookedMoreThan3TripsException() {
    }

    public DriverBookedMoreThan3TripsException(Throwable cause) {
        super(cause);
    }

    public DriverBookedMoreThan3TripsException(String message) {
        super(message);
    }

    public DriverBookedMoreThan3TripsException(String message, Throwable cause) {
        super(message, cause);
    }
}
