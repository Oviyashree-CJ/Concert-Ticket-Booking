package com.concert.concertbooking.repository;

import com.concert.concertbooking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // ✅ For Admin Dashboard — get total revenue from all bookings
    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b")
    Double sumTotalRevenue();

    // ✅ Get all bookings for a specific concert
    List<Booking> findByConcertId(Long concertId);

    // ✅ Get all seat IDs (flattened) for one concert — used to disable already-booked seats
    // We now use the 'tickets' column since 'seats' is not persisted in the DB
    @Query("SELECT b.tickets FROM Booking b WHERE b.concert.id = :concertId")
    List<String> findAllSeatIdsByConcert(@Param("concertId") Long concertId);
}

