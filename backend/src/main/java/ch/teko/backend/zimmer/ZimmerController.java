package ch.teko.backend.zimmer;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ZimmerController {
    private final ZimmerRepository zimmerRepository;

    ZimmerController(ZimmerRepository zimmerRepository) {
        this.zimmerRepository = zimmerRepository;
    }

    @GetMapping("/rooms")
    public Iterable<Zimmer> getAllZimmer() {
        return zimmerRepository.findAll();
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<Zimmer> getZimmerById(@PathVariable Long id) {
        return zimmerRepository.findById(id)
                .map(zimmer -> ResponseEntity.ok(zimmer))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/rooms")
    public ResponseEntity<Zimmer> createZimmer(@RequestBody Zimmer zimmer) {
        Zimmer saved = zimmerRepository.save(zimmer);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Void> deleteZimmerById(@PathVariable Long id) {
        zimmerRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<Zimmer> updateZimmer(@PathVariable Long id, @RequestBody Zimmer zimmer) {
        return zimmerRepository.findById(id)
                .map(existing -> {
                    existing.setHotelId(zimmer.getHotelId());
                    existing.setKategorieId(zimmer.getKategorieId());
                    existing.setZimmerNr(zimmer.getZimmerNr());
                    Zimmer saved = zimmerRepository.save(existing);

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
