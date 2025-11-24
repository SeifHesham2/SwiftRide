package com.luv2code.springboot.cruddemo.exception;

public class DriverHasCarException extends RuntimeException{
    public DriverHasCarException() {
    }

    public DriverHasCarException(Throwable cause) {
        super(cause);
    }

    public DriverHasCarException(String message) {
        super(message);
    }

    public DriverHasCarException(String message, Throwable cause) {
        super(message, cause);
    }
}
