package com.luv2code.springboot.cruddemo.exception;

public class CustomerOrDriverNotAssigned extends  RuntimeException {
    public CustomerOrDriverNotAssigned() {
    }

    public CustomerOrDriverNotAssigned(Throwable cause) {
        super(cause);
    }

    public CustomerOrDriverNotAssigned(String message) {
        super(message);
    }

    public CustomerOrDriverNotAssigned(String message, Throwable cause) {
        super(message, cause);
    }
}
