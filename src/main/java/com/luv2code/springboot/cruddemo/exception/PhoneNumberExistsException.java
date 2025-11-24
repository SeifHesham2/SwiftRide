package com.luv2code.springboot.cruddemo.exception;

public class PhoneNumberExistsException extends RuntimeException{
    public PhoneNumberExistsException() {
    }

    public PhoneNumberExistsException(Throwable cause) {
        super(cause);
    }

    public PhoneNumberExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    public PhoneNumberExistsException(String message) {
        super(message);
    }
}
