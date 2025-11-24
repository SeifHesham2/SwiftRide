package com.luv2code.springboot.cruddemo.exception;

public class DriverNotAvailableException extends  RuntimeException{
    public DriverNotAvailableException() {
    }

    public DriverNotAvailableException(Throwable cause) {
        super(cause);
    }

    public DriverNotAvailableException(String message, Throwable cause) {
        super(message, cause);
    }

    public DriverNotAvailableException(String message) {
        super(message);
    }
}
