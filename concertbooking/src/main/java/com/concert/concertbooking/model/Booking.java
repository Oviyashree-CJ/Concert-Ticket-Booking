package com.concert.concertbooking.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String concertTitle; // ✅ new field
    private String tickets;      // ✅ new field (comma-separated seats)
    private double totalPrice;
    private String userEmail;
    private String status;

    @ManyToOne
    @JoinColumn(name = "concert_id")
    private Concert concert;

    @Transient
    private List<String> seats; // for internal logic (not stored in DB)

    @Column(name = "payment_id")
    private String paymentId;

    // ✅ Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getConcertTitle() {
        return concertTitle;
    }
    public void setConcertTitle(String concertTitle) {
        this.concertTitle = concertTitle;
    }

    public String getTickets() {
        return tickets;
    }
    public void setTickets(String tickets) {
        this.tickets = tickets;
    }

    public double getTotalPrice() {
        return totalPrice;
    }
    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getUserEmail() {
        return userEmail;
    }
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public Concert getConcert() {
        return concert;
    }
    public void setConcert(Concert concert) {
        this.concert = concert;
    }

    public List<String> getSeats() {
        return seats;
    }
    public void setSeats(List<String> seats) {
        this.seats = seats;
    }

    public String getPaymentId() {
        return paymentId;
    }
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
}
