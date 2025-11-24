package com.luv2code.springboot.cruddemo.service;

import org.springframework.stereotype.Service;

@Service
public interface ForgetPasswordService {
    public  void forgotPassword(String email);
}
