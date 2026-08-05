package ch.teko.backend.gast;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class GastController {
    private final GastRepository gastRepository;

    GastController(GastRepository gastRepository) {
        this.gastRepository = gastRepository;
    }

    @GetMapping("/guests")
    public Iterable<Gast> getAllGaeste() {
        return gastRepository.findAll();
    }

    @GetMapping("/guests/{id}")
    public ResponseEntity<Gast> getGastById(@PathVariable Long id) {
        return gastRepository.findById(id)
                .map(gast -> ResponseEntity.ok(gast))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/guests")
    public ResponseEntity<Gast> createGast(@RequestBody Gast gast) {
        Gast saved = gastRepository.save(gast);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/guests/{id}")
    public ResponseEntity<Void> deleteGastById(@PathVariable Long id) {
        gastRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/guests/{id}")
    public ResponseEntity<Gast> updateGast(@PathVariable Long id, @RequestBody Gast gast) {
        return gastRepository.findById(id)
                .map(existing -> {
                    existing.setNachname(gast.getNachname());
                    existing.setVorname(gast.getVorname());
                    existing.setEmail(gast.getEmail());
                    existing.setTelefon(gast.getTelefon());
                    existing.setGeburtsdatum(gast.getGeburtsdatum());

                    Gast saved = gastRepository.save(existing);

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
