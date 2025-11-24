package com.luv2code.springboot.cruddemo.exception;

public class OverlapsTripsException extends  RuntimeException{
    public OverlapsTripsException() {
    }

    public OverlapsTripsException(Throwable cause) {
        super(cause);
    }

    public OverlapsTripsException(String message) {
        super(message);
    }

    public OverlapsTripsException(String message, Throwable cause) {
        super(message, cause);
    }
}
