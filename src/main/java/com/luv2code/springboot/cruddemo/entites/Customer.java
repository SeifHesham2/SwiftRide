package com.luv2code.springboot.cruddemo.entites;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@AttributeOverride(name = "id", column = @Column(name = "customer_id"))

public class Customer extends UserBase {
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    public Customer(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Customer() {
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
