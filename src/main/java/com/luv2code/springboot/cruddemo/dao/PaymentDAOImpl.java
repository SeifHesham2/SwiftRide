package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Payment;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public class PaymentDAOImpl implements PaymentDAO{
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Payment save(Payment payment) {
        return entityManager.merge(payment);

    }

    @Override
    public Payment findById(long id) {
        return entityManager.find(Payment.class, id);
    }

    @Override
    public List<Payment> findAll() {
        return entityManager.createQuery("FROM Payment", Payment.class).getResultList();
    }

    @Override
    public void deleteById(long id) {
        Payment payment = findById(id);
        if (payment != null) {
            entityManager.remove(payment);
        }
    }
    @Override
    @Transactional
    public Payment findByTripId(Long tripId) {
        TypedQuery<Payment> query = entityManager.createQuery(
                "SELECT p FROM Payment p WHERE p.trip.id = :tripId", Payment.class
        );
        query.setParameter("tripId", tripId);
        return query.getResultStream().findFirst().orElse(null);
    }
}
