package com.concert.concertbooking.controller;

import com.concert.concertbooking.model.Booking;
import com.concert.concertbooking.model.Concert;
import com.concert.concertbooking.repository.BookingRepository;
import com.concert.concertbooking.repository.ConcertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ConcertRepository concertRepository;

    // ✅ Create a new booking
    @PostMapping
    public Booking createBooking(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("📦 Payload received: " + payload);

            Object concertIdObj = payload.get("concertId");
            if (concertIdObj == null) throw new RuntimeException("concertId is missing!");
            Long concertId = Long.parseLong(concertIdObj.toString());

            Object emailObj = payload.get("userEmail");
            String email = (emailObj != null && !"undefined".equalsIgnoreCase(emailObj.toString()))
                    ? emailObj.toString()
                    : "guest@example.com";


            List<String> seats = (List<String>) payload.get("seats");
            if (seats == null || seats.isEmpty()) throw new RuntimeException("Seats missing!");

            Optional<Concert> concertOpt = concertRepository.findById(concertId);
            if (concertOpt.isEmpty()) throw new RuntimeException("Concert not found!");
            Concert concert = concertOpt.get();

            double totalPrice = 0.0;
            for (String seatId : seats) {
                if (seatId.startsWith("Platinum")) totalPrice += 2500;
                else if (seatId.startsWith("Gold")) totalPrice += 1500;
                else if (seatId.startsWith("Silver")) totalPrice += 800;
            }

            Booking booking = new Booking();
            booking.setConcert(concert);
            booking.setConcertTitle(concert.getTitle());
            booking.setSeats(seats);
            booking.setTickets(String.join(",", seats));
            booking.setUserEmail(email);
            booking.setTotalPrice(totalPrice);
            booking.setStatus("Pending");

            Booking savedBooking = bookingRepository.save(booking);
            System.out.println("✅ Booking saved successfully: " + savedBooking.getId());
            return savedBooking;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Booking failed: " + e.getMessage());
        }
    }

    // ✅ Update booking after payment success
    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @RequestBody Booking updatedBooking) {
        return bookingRepository.findById(id)
                .map(existingBooking -> {
                    existingBooking.setStatus(updatedBooking.getStatus());
                    existingBooking.setPaymentId(updatedBooking.getPaymentId());
                    existingBooking.setTotalPrice(updatedBooking.getTotalPrice());
                    existingBooking.setTickets(updatedBooking.getTickets());
                    existingBooking.setConcertTitle(updatedBooking.getConcertTitle());
                    existingBooking.setUserEmail(updatedBooking.getUserEmail());
                    return bookingRepository.save(existingBooking);
                })
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));
    }

    // ✅ Get bookings for a concert
    @GetMapping("/{concertId}")
    public List<Booking> getBookingsByConcertId(@PathVariable Long concertId) {
        return bookingRepository.findByConcertId(concertId);
    }

    // ✅ Get all booked seat IDs for a concert
    @GetMapping("/{concertId}/seats")
    public List<String> getBookedSeats(@PathVariable Long concertId) {
        return bookingRepository.findAllSeatIdsByConcert(concertId);
    }

    // ✅ Admin — Get all bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
