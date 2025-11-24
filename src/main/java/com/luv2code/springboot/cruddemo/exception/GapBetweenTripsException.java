package com.luv2code.springboot.cruddemo.exception;

public class GapBetweenTripsException extends RuntimeException{
    public GapBetweenTripsException() {
    }

    public GapBetweenTripsException(Throwable cause) {
        super(cause);
    }

    public GapBetweenTripsException(String message) {
        super(message);
    }

    public GapBetweenTripsException(String message, Throwable cause) {
        super(message, cause);
    }
}
