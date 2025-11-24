package com.luv2code.springboot.cruddemo.exception;

public class DriverIsAlreadyRated extends  RuntimeException{
    public DriverIsAlreadyRated() {
    }

    public DriverIsAlreadyRated(Throwable cause) {
        super(cause);
    }

    public DriverIsAlreadyRated(String message) {
        super(message);
    }

    public DriverIsAlreadyRated(String message, Throwable cause) {
        super(message, cause);
    }
}
