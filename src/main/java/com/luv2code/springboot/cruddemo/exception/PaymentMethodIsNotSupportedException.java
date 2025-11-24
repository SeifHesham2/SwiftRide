package com.luv2code.springboot.cruddemo.exception;

public class PaymentMethodIsNotSupportedException extends IllegalArgumentException
{
    public PaymentMethodIsNotSupportedException() {
    }

    public PaymentMethodIsNotSupportedException(Throwable cause) {
        super(cause);
    }

    public PaymentMethodIsNotSupportedException(String message, Throwable cause) {
        super(message, cause);
    }

    public PaymentMethodIsNotSupportedException(String message) {
        super(message);
    }
}
