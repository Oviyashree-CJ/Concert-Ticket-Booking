package com.concert.concertbooking.repository;

import com.concert.concertbooking.model.Concert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConcertRepository extends JpaRepository<Concert, Long> {
}
