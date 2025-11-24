package com.luv2code.springboot.cruddemo.exception;

public class StartBeforeScheduledTimeException extends  RuntimeException{
    public StartBeforeScheduledTimeException() {
    }

    public StartBeforeScheduledTimeException(String message) {
        super(message);
    }

    public StartBeforeScheduledTimeException(Throwable cause) {
        super(cause);
    }

    public StartBeforeScheduledTimeException(String message, Throwable cause) {
        super(message, cause);
    }
}
