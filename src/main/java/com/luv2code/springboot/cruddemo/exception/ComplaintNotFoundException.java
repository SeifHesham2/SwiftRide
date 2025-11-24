package com.luv2code.springboot.cruddemo.exception;

public class ComplaintNotFoundException extends RuntimeException{
    public ComplaintNotFoundException() {
    }

    public ComplaintNotFoundException(Throwable cause) {
        super(cause);
    }

    public ComplaintNotFoundException(String message) {
        super(message);
    }

    public ComplaintNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
