package com.luv2code.springboot.cruddemo.exception;

public class PaymentNotFoundException extends  RuntimeException {

    public PaymentNotFoundException() {
    }

    public PaymentNotFoundException(Throwable cause) {
        super(cause);
    }

    public PaymentNotFoundException(String message) {
        super(message);
    }
}
