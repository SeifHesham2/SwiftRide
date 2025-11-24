package com.luv2code.springboot.cruddemo.exception;

public class TokenIsExpiredOrWrongException extends RuntimeException{
    public TokenIsExpiredOrWrongException(Throwable cause) {
        super(cause);
    }

    public TokenIsExpiredOrWrongException() {
    }

    public TokenIsExpiredOrWrongException(String message, Throwable cause) {
        super(message, cause);
    }

    public TokenIsExpiredOrWrongException(String message) {
        super(message);
    }
}
