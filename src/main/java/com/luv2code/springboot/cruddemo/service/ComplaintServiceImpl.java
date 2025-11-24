package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.dao.ComplaintDAO;
import com.luv2code.springboot.cruddemo.entites.Complaint;
import com.luv2code.springboot.cruddemo.entites.ComplaintStatus;
import com.luv2code.springboot.cruddemo.entites.Customer;
import com.luv2code.springboot.cruddemo.entites.Trip;
import com.luv2code.springboot.cruddemo.exception.ComplaintNotFoundException;
import com.luv2code.springboot.cruddemo.exception.CustomerNotFoundException;
import com.luv2code.springboot.cruddemo.exception.TripNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ComplaintServiceImpl implements ComplaintService{
    private  final ComplaintDAO complaintDAO;
    private  final  CustomerService customerService;
    private final  TripService tripService;

    public ComplaintServiceImpl(ComplaintDAO complaintDAO, CustomerService customerService, @Lazy TripService tripService) {
        this.complaintDAO = complaintDAO;
        this.customerService = customerService;
        this.tripService = tripService;
    }

    @Transactional
    @Override
    public List<Complaint> findAll() {
        return complaintDAO.findAll();
    }


    @Transactional
    @Override
    public Complaint addComplaint(long customerId, long tripId, Complaint complaint) {
        Customer customer = customerService.findById(customerId);
        if(customer==null) throw new CustomerNotFoundException("customer is not found");
        Trip trip = tripService.findById(tripId);
        if(trip==null) throw  new TripNotFoundException("trip is not found");
        complaint.setTrip(trip);
        complaint.setCustomer(customer);
        complaint.setStatus(ComplaintStatus.NEW);
        return complaintDAO.save(complaint);
    }

    @Override
    public List<Complaint> findByStatus(ComplaintStatus complaintStatus) {
        return complaintDAO.findByStatus(complaintStatus);
    }
    @Transactional
    @Override
    public Complaint openComplaint(long complaintId) {
    Complaint complaint = complaintDAO.findById(complaintId);
    if(complaint==null) throw new ComplaintNotFoundException("complaint is not found");
    complaint.setStatus(ComplaintStatus.OPENED);
    return complaint;
    }
   @Transactional
   @Override
    public Complaint closeComplaint(long complaintId) {
       Complaint complaint = complaintDAO.findById(complaintId);
       if(complaint==null) throw new ComplaintNotFoundException("complaint is not found");
       complaint.setStatus(ComplaintStatus.CLOSED);
       return complaint;
    }

}
