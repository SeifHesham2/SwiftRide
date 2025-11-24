package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Complaint;
import com.luv2code.springboot.cruddemo.entites.ComplaintStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public class ComplaintDAOImpl implements ComplaintDAO{
private final EntityManager entityManager;

    public ComplaintDAOImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<Complaint> findAll() {
        TypedQuery<Complaint> typedQuery = entityManager.createQuery("SELECT c FROM Complaint c", Complaint.class);

        return typedQuery.getResultList();
    }
@Transactional
    @Override
    public Complaint save(Complaint complaint) {
        return entityManager.merge(complaint);
    }

    @Override
    public List<Complaint> findByStatus(ComplaintStatus complaintStatus) {
        TypedQuery<Complaint> typedQuery = entityManager.createQuery("SELECT c FROM Complaint c WHERE c.status = :status", Complaint.class);
        typedQuery.setParameter("status",complaintStatus);
        return typedQuery.getResultList();
    }

    @Override
    public Complaint findById(long complaintId) {
        return  entityManager.find(Complaint.class,complaintId);
    }
}
