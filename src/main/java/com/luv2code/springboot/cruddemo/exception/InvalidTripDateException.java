package com.luv2code.springboot.cruddemo.exception;

public class InvalidTripDateException extends  RuntimeException {
    public InvalidTripDateException() {
    }

    public InvalidTripDateException(Throwable cause) {
        super(cause);
    }

    public InvalidTripDateException(String message) {
        super(message);
    }

    public InvalidTripDateException(String message, Throwable cause) {
        super(message, cause);
    }
}
