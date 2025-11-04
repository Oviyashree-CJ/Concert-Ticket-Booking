package com.concert.concertbooking.controller;

import com.concert.concertbooking.model.Booking;
import com.concert.concertbooking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment") // ✅ FIXED: singular, matches your frontend
@CrossOrigin(origins = "http://localhost:3000") // ✅ allow frontend access
public class PaymentController {

    @Autowired
    private BookingRepository bookingRepository;

    // ✅ Handle payment and update booking
    @PostMapping
    public Map<String, String> processPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            if (paymentData == null || !paymentData.containsKey("bookingId")) {
                throw new IllegalArgumentException("Missing bookingId in payment data.");
            }

            // Extract data safely
            Long bookingId = ((Number) paymentData.get("bookingId")).longValue();
            double amount = paymentData.containsKey("amount")
                    ? ((Number) paymentData.get("amount")).doubleValue()
                    : 0.0;
            String method = paymentData.containsKey("method")
                    ? paymentData.get("method").toString()
                    : "Unknown";

            // Find the booking in DB
            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
            if (bookingOpt.isEmpty()) {
                throw new RuntimeException("Booking not found with ID: " + bookingId);
            }

            Booking booking = bookingOpt.get();

            // ✅ Simulate payment success
            String generatedPaymentId = UUID.randomUUID().toString();
            booking.setPaymentId(generatedPaymentId);
            booking.setStatus("PAID");

            // Save updated booking
            bookingRepository.save(booking);

            // ✅ Return success response
            return Map.of(
                    "message", "Payment successful",
                    "bookingId", String.valueOf(bookingId),
                    "paymentId", generatedPaymentId,
                    "method", method,
                    "amount", String.valueOf(amount),
                    "status", booking.getStatus()
            );

        } catch (Exception e) {
            System.err.println("❌ Payment failed: " + e.getMessage());
            e.printStackTrace();

            return Map.of(
                    "error", "Payment failed: " + e.getMessage()
            );
        }
    }

    // ✅ Optional: Fetch all bookings with payment info (for admin/debugging)
    @GetMapping("/all")
    public Iterable<Booking> getAllBookingsWithPayments() {
        return bookingRepository.findAll();
    }
}
