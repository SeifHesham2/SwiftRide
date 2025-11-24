package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Complaint;
import com.luv2code.springboot.cruddemo.entites.ComplaintStatus;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintDAO {
public List<Complaint> findAll();
public Complaint save(Complaint complaint);
public  List<Complaint> findByStatus(ComplaintStatus complaintStatus);
public  Complaint findById(long complaintId);

}
