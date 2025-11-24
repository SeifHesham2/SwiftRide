package com.luv2code.springboot.cruddemo.exception;

public class DriverNotFoundException extends  RuntimeException{
    public DriverNotFoundException() {
    }

    public DriverNotFoundException(Throwable cause) {
        super(cause);
    }

    public DriverNotFoundException(String message) {
        super(message);
    }

    public DriverNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
