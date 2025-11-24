package com.luv2code.springboot.cruddemo.dto;

import com.luv2code.springboot.cruddemo.entites.PaymentMethod;
import com.luv2code.springboot.cruddemo.entites.PaymentStatus;

import java.time.LocalDateTime;

public class PaymentDTO {
    private long id;
    private PaymentMethod method;
    private PaymentStatus status;
    private Double amount;
    private  LocalDateTime createdAt;
    private TripDTO tripDTO;

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public TripDTO getTripDTO() {
        return tripDTO;
    }

    public void setTripDTO(TripDTO tripDTO) {
        this.tripDTO = tripDTO;
    }
}
