package com.luv2code.springboot.cruddemo.mapper;

import com.luv2code.springboot.cruddemo.dto.CustomerDTO;
import com.luv2code.springboot.cruddemo.entites.Customer;

public class CustomerMapper {
    public static CustomerDTO toDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setImageUrl(customer.getImageUrl());
        return dto;
    }
}
