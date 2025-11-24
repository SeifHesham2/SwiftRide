package com.luv2code.springboot.cruddemo.exception;

public class CarNotFoundException extends  RuntimeException{
    public CarNotFoundException() {
    }

    public CarNotFoundException(Throwable cause) {
        super(cause);
    }

    public CarNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public CarNotFoundException(String message) {
        super(message);
    }
}
