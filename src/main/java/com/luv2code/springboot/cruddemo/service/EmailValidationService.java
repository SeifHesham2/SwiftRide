package com.luv2code.springboot.cruddemo.service;

import org.springframework.stereotype.Service;

@Service
public interface EmailValidationService {
    public boolean customerToken(String email, String firstName);
    public String customerEmailValidation(String token);
}
