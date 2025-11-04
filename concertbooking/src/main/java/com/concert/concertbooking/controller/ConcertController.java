package com.concert.concertbooking.controller;

import com.concert.concertbooking.model.Concert;
import com.concert.concertbooking.repository.ConcertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/concerts")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend access
public class ConcertController {

    @Autowired
    private ConcertRepository concertRepository;

    // ✅ Get all concerts (used in MainPage.jsx)
    @GetMapping
    public List<Concert> getAllConcerts() {
        return concertRepository.findAll();
    }

    // ✅ Add a new concert (used in AdminDashboard)
    @PostMapping
    public Concert addConcert(@RequestBody Concert concert) {
        return concertRepository.save(concert);
    }

    // ✅ Get a specific concert by ID (used when booking)
    @GetMapping("/{id}")
    public Optional<Concert> getConcertById(@PathVariable Long id) {
        return concertRepository.findById(id);
    }

    // ✅ Update an existing concert
    @PutMapping("/{id}")
    public Concert updateConcert(@PathVariable Long id, @RequestBody Concert updatedConcert) {
        return concertRepository.findById(id)
                .map(concert -> {
                    concert.setTitle(updatedConcert.getTitle());
                    concert.setArtist(updatedConcert.getArtist());
                    concert.setGenre(updatedConcert.getGenre());
                    concert.setDate(updatedConcert.getDate());
                    concert.setLocation(updatedConcert.getLocation());
                    concert.setPrice(updatedConcert.getPrice());
                    concert.setImage(updatedConcert.getImage());
                    return concertRepository.save(concert);
                })
                .orElseGet(() -> {
                    updatedConcert.setId(id);
                    return concertRepository.save(updatedConcert);
                });
    }

    // ✅ Delete a concert by ID
    @DeleteMapping("/{id}")
    public void deleteConcert(@PathVariable Long id) {
        concertRepository.deleteById(id);
    }
}
