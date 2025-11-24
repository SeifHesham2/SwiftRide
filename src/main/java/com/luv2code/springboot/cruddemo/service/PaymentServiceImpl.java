package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.dao.PaymentDAO;
import com.luv2code.springboot.cruddemo.entites.Payment;
import com.luv2code.springboot.cruddemo.entites.PaymentMethod;
import com.luv2code.springboot.cruddemo.entites.PaymentStatus;
import com.luv2code.springboot.cruddemo.entites.Trip;
import com.luv2code.springboot.cruddemo.exception.PaymentMethodIsNotSupportedException;
import com.luv2code.springboot.cruddemo.exception.PaymentNotFoundException;
import com.luv2code.springboot.cruddemo.factories.PaymentFactory;
import com.luv2code.springboot.cruddemo.strategy.PaymentStrategy;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService{

    private final PaymentDAO paymentDAO;
   private  final  PaymentFactory paymentFactory;

    public PaymentServiceImpl(PaymentDAO paymentDAO, PaymentFactory paymentFactory) {
        this.paymentDAO = paymentDAO;
        this.paymentFactory = paymentFactory;
    }

    @Transactional
   @Override
    public Payment choosePayment(Trip trip, PaymentMethod method) {
        PaymentStrategy strategy = paymentFactory.choosePayment(method.name());
        Payment payment = strategy.pay(trip);
        payment.setStatus(PaymentStatus.PENDING);
        return paymentDAO.save(payment);
    }
    @Transactional
    @Override
    public Payment donePayment(long tripID) {
        Payment payment = paymentDAO.findByTripId(tripID);
        if(payment == null) throw new PaymentNotFoundException("Payment not found for trip " + tripID);
        payment.setStatus(PaymentStatus.PAID);
        return paymentDAO.save(payment);
    }
}
