package com.luv2code.springboot.cruddemo.exception;

public class CarHasDriverException extends RuntimeException{
    public CarHasDriverException() {
    }

    public CarHasDriverException(Throwable cause) {
        super(cause);
    }

    public CarHasDriverException(String message) {
        super(message);
    }

    public CarHasDriverException(String message, Throwable cause) {
        super(message, cause);
    }
}
