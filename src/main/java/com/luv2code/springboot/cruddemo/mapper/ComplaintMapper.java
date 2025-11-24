package com.luv2code.springboot.cruddemo.mapper;

import com.luv2code.springboot.cruddemo.dao.ComplaintDAO;
import com.luv2code.springboot.cruddemo.dto.ComplaintDTO;
import com.luv2code.springboot.cruddemo.dto.CustomerDTO;
import com.luv2code.springboot.cruddemo.entites.Complaint;
import com.luv2code.springboot.cruddemo.entites.Customer;

public class ComplaintMapper {
    public static ComplaintDTO toDTO(Complaint complaint) {
        ComplaintDTO dto = new ComplaintDTO();
        dto.setId(complaint.getId());
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setStatus(complaint.getStatus());
        dto.setMessage(complaint.getMessage());

        if (complaint.getTrip() != null) {
            dto.setTrip(TripMapper.tripDTO(complaint.getTrip()));
        } else {
            dto.setTrip(null);
        }

        if (complaint.getCustomer() != null) {
            dto.setCustomer(CustomerMapper.toDTO(complaint.getCustomer()));
        } else {
            dto.setCustomer(null);
        }

        return dto;
    }
}