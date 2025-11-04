package com.concert.concertbooking.controller;

import com.concert.concertbooking.model.Concert;
import com.concert.concertbooking.model.Booking;
import com.concert.concertbooking.model.User;
import com.concert.concertbooking.repository.ConcertRepository;
import com.concert.concertbooking.repository.BookingRepository;
import com.concert.concertbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConcertRepository concertRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // ✅ DASHBOARD STATS — used by AdminDashboard.jsx
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalConcerts = concertRepository.count();
        long totalBookings = bookingRepository.count();

        // Calculate total revenue from all bookings
        double totalRevenue = bookingRepository.findAll()
                .stream()
                .mapToDouble(Booking::getTotalPrice)
                .sum();

        stats.put("totalUsers", totalUsers);
        stats.put("totalConcerts", totalConcerts);
        stats.put("totalBookings", totalBookings);
        stats.put("totalRevenue", totalRevenue);

        return stats;
    }

    // ✅ GET ALL CONCERTS (for Manage Events)
    @GetMapping("/concerts")
    public List<Concert> getAllConcerts() {
        return concertRepository.findAll();
    }

    // ✅ ADD NEW CONCERT
    @PostMapping("/concerts")
    public Concert addConcert(@RequestBody Concert concert) {
        return concertRepository.save(concert);
    }

    // ✅ UPDATE CONCERT DETAILS
    @PutMapping("/concerts/{id}")
    public Concert updateConcert(@PathVariable Long id, @RequestBody Concert updatedConcert) {
        return concertRepository.findById(id)
                .map(concert -> {
                    concert.setTitle(updatedConcert.getTitle());
                    concert.setArtist(updatedConcert.getArtist());
                    concert.setDate(updatedConcert.getDate());
                    concert.setLocation(updatedConcert.getLocation());
                    concert.setPrice(updatedConcert.getPrice());
                    concert.setImage(updatedConcert.getImage());
                    return concertRepository.save(concert);
                })
                .orElseThrow(() -> new RuntimeException("Concert not found"));
    }

    // ✅ DELETE CONCERT
    @DeleteMapping("/concerts/{id}")
    public Map<String, String> deleteConcert(@PathVariable Long id) {
        concertRepository.deleteById(id);
        return Map.of("message", "Concert deleted successfully");
    }

    // ✅ GET ALL BOOKINGS
    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ✅ ADD NEW BOOKING (Fix)
    @PostMapping("/bookings")
    public Booking addBooking(@RequestBody Booking booking) {
        return bookingRepository.save(booking);
    }

    // ✅ DELETE BOOKING
    @DeleteMapping("/bookings/{id}")
    public Map<String, String> deleteBooking(@PathVariable Long id) {
        bookingRepository.deleteById(id);
        return Map.of("message", "Booking deleted successfully");
    }

    // ✅ GET ALL USERS
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ DELETE USER
    @DeleteMapping("/users/{id}")
    public Map<String, String> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return Map.of("message", "User deleted successfully");
    }
}
