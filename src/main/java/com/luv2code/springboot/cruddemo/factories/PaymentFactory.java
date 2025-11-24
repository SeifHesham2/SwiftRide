package com.luv2code.springboot.cruddemo.factories;

import com.luv2code.springboot.cruddemo.dao.PaymentDAO;
import com.luv2code.springboot.cruddemo.entites.Payment;
import com.luv2code.springboot.cruddemo.entites.PaymentMethod;
import com.luv2code.springboot.cruddemo.entites.Trip;
import com.luv2code.springboot.cruddemo.exception.PaymentMethodIsNotSupportedException;
import com.luv2code.springboot.cruddemo.strategy.PaymentStrategy;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
@Component
public class PaymentFactory {
    private final Map<String, PaymentStrategy> strategies;

 @Autowired
    public PaymentFactory(Map<String, PaymentStrategy> strategies) {
        this.strategies = strategies;
    }

    @Transactional
    public PaymentStrategy choosePayment(String type) {
        PaymentStrategy strategy = strategies.get(type);
        if (strategy == null) {
            throw new PaymentMethodIsNotSupportedException("❌ Unsupported payment method: " + type);
        }
        return strategy;

    }
}
