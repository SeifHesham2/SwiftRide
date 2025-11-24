package com.luv2code.springboot.cruddemo.exception;

public class InvalidEmailOrPasswordException extends  RuntimeException
{
    public InvalidEmailOrPasswordException() {
    }

    public InvalidEmailOrPasswordException(Throwable cause) {
        super(cause);
    }

    public InvalidEmailOrPasswordException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidEmailOrPasswordException(String message) {
        super(message);
    }
}
