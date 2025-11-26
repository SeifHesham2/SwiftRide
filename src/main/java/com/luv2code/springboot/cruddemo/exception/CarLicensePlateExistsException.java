package com.luv2code.springboot.cruddemo.exception;

public class CarLicensePlateExistsException extends RuntimeException {
    public CarLicensePlateExistsException() {
    }

    public CarLicensePlateExistsException(Throwable cause) {
        super(cause);
    }

    public CarLicensePlateExistsException(String message) {
        super(message);
    }

    public CarLicensePlateExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
