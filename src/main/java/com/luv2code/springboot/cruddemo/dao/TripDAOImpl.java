package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Trip;
import com.luv2code.springboot.cruddemo.entites.TripStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class TripDAOImpl implements TripDAO{
    private  final EntityManager entityManager;
     @Autowired
    public TripDAOImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Trip save(Trip newTrip) {
        return entityManager.merge(newTrip);
    }

    @Override
    public List<Trip> findByStatus(TripStatus tripStatus) {
        TypedQuery<Trip> typedQuery = entityManager.createQuery(
                "SELECT t FROM Trip t WHERE t.status = :status", Trip.class
        );
        typedQuery.setParameter("status", tripStatus);
        return typedQuery.getResultList();}

    @Override
    public Trip findById(long id) {
        return  entityManager.find(Trip.class,id);
    }

    @Override
    public List<Trip> getCustomerTrips(long customerId) {
        TypedQuery<Trip> typedQuery = entityManager.createQuery(
                "SELECT t FROM Trip t WHERE t.customer.id = :customerId",Trip.class
        );
        typedQuery.setParameter("customerId",customerId);
        return typedQuery.getResultList();
    }
    public List<Trip> findByDriverIdAndStatusIn(Long driverId, List<TripStatus> statuses) {
        TypedQuery<Trip> query = entityManager.createQuery(
                "SELECT t FROM Trip t WHERE t.driver.id = :driverId AND t.status IN :statuses",
                Trip.class
        );
        query.setParameter("driverId", driverId);
        query.setParameter("statuses", statuses);
        return query.getResultList();
    }
            @Override
            @Transactional
    public int markExpiredTrips() {
        return entityManager.createQuery(
                        "UPDATE Trip t " +
                                "SET t.status = :expiredStatus " +
                                "WHERE t.tripDate < :now " +
                                "AND t.status <> :completedStatus " +
                                "AND t.status <> :expiredStatus"
                )
                .setParameter("expiredStatus", TripStatus.EXPIRED)
                .setParameter("completedStatus", TripStatus.COMPLETED)
                .setParameter("now", LocalDateTime.now())
                .executeUpdate();
    }

    @Override
    public List<Trip> customerPreviousTrips(long customerId) {
        TypedQuery<Trip> typedQuery = entityManager.createQuery(
                "SELECT t FROM Trip t WHERE t.customer.id = :customerId AND t.status IN (:statuses)",
                Trip.class
        );
        typedQuery.setParameter("customerId", customerId);
        typedQuery.setParameter("statuses", List.of(TripStatus.EXPIRED, TripStatus.COMPLETED , TripStatus.CANCELLED_BY_CUSTOMER));
        return typedQuery.getResultList();
    }

}
