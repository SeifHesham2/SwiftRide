package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.entites.Complaint;
import com.luv2code.springboot.cruddemo.entites.ComplaintStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ComplaintService {
    public List<Complaint> findAll();
    public Complaint addComplaint(long customerId , long tripId , Complaint complaint);
    public List<Complaint> findByStatus(ComplaintStatus complaintStatus);
    public Complaint openComplaint (long complaintId);
    public Complaint closeComplaint (long complaintId);

}
