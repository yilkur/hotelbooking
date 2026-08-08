package ch.teko.backend.buchung;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class BuchungController {
    private final BuchungRepository buchungRepository;

    BuchungController(BuchungRepository buchungRepository) {
        this.buchungRepository = buchungRepository;
    }

    @GetMapping("/bookings")
    public Iterable<Buchung> getAllBuchung() {
        return buchungRepository.findAll();
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<Buchung> getBuchungById(@PathVariable Long id) {
        return buchungRepository.findById(id)
                .map(buchung -> ResponseEntity.ok(buchung))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/bookings")
    public ResponseEntity<Buchung> createBuchung(@RequestBody Buchung buchung) {
        Buchung saved = buchungRepository.save(buchung);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> deleteBuchungById(@PathVariable Long id) {
        buchungRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/bookings/{id}")
    public ResponseEntity<Buchung> updateBuchung(@PathVariable Long id, @RequestBody Buchung buchung) {
        return buchungRepository.findById(id)
                .map(existing -> {
                    existing.setGastId(buchung.getGastId());
                    existing.setAnreisedatum(buchung.getAnreisedatum());
                    existing.setAbreisedatum(buchung.getAbreisedatum());
                    existing.setStatus(buchung.getStatus());
                    existing.setZimmer(buchung.getZimmer());
                    Buchung saved = buchungRepository.save(existing);

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
