package ch.teko.backend.hotel;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class HotelController {
    private final HotelRepository hotelRepository;

    HotelController(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @GetMapping("/hotels")
    public Iterable<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    @GetMapping("/hotels/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return hotelRepository.findById(id)
                .map(hotel -> ResponseEntity.ok(hotel))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/hotels")
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        Hotel saved = hotelRepository.save(hotel);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/hotels/{id}")
    public ResponseEntity<Void> deleteHotelById(@PathVariable Long id) {
        hotelRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/hotels/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel) {
        return hotelRepository.findById(id)
                .map(existing -> {
                    existing.setName(hotel.getName());
                    existing.setOrt(hotel.getOrt());
                    Hotel saved = hotelRepository.save(existing);

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
