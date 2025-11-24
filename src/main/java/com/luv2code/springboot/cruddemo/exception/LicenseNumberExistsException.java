package com.luv2code.springboot.cruddemo.exception;

public class LicenseNumberExistsException extends  RuntimeException{
    public LicenseNumberExistsException() {
    }

    public LicenseNumberExistsException(Throwable cause) {
        super(cause);
    }

    public LicenseNumberExistsException(String message) {
        super(message);
    }

    public LicenseNumberExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
