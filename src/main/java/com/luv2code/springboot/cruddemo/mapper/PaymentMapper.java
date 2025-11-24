package com.luv2code.springboot.cruddemo.mapper;

import com.luv2code.springboot.cruddemo.dto.PaymentDTO;
import com.luv2code.springboot.cruddemo.entites.Payment;

public class PaymentMapper {
    public static PaymentDTO toDTO(Payment payment){
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(payment.getAmount());
        paymentDTO.setId(payment.getId());
        paymentDTO.setCreatedAt(payment.getCreatedAt());
        paymentDTO.setStatus(payment.getStatus());
        paymentDTO.setMethod(payment.getMethod());
        if (payment.getTrip() != null) {
            paymentDTO.setTripDTO(TripMapper.tripDTO(payment.getTrip()));
        } else {
            paymentDTO.setTripDTO(null);
        }
    return  paymentDTO;}
}
