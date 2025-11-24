package com.luv2code.springboot.cruddemo.exception;

public class EmailAlreadyExistsException extends RuntimeException{
    public EmailAlreadyExistsException() {
    }

    public EmailAlreadyExistsException(Throwable cause) {
        super(cause);
    }

    public EmailAlreadyExistsException(String message) {
        super(message);
    }

    public EmailAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
