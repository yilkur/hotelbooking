package ch.teko.backend.kategorie;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class KategorieController {
    private final KategorieRepository kategorieRepository;

    KategorieController(KategorieRepository kategorieRepository) {
        this.kategorieRepository = kategorieRepository;
    }

    @GetMapping("/categories")
    public Iterable<Kategorie> getAllKategorien() {
        return kategorieRepository.findAll();
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Kategorie> getKategorieById(@PathVariable Long id) {
        return kategorieRepository.findById(id)
                .map(kategorie -> ResponseEntity.ok(kategorie))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/categories")
    public ResponseEntity<Kategorie> createKategorie(@RequestBody Kategorie kategorie) {
        Kategorie saved = kategorieRepository.save(kategorie);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteKategorieById(@PathVariable Long id) {
        kategorieRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Kategorie> updateKategorie(@PathVariable Long id, @RequestBody Kategorie kategorie) {
        return kategorieRepository.findById(id)
                .map(existing -> {
                    existing.setBezeichnung(kategorie.getBezeichnung());
                    existing.setPreisProNacht(kategorie.getPreisProNacht());
                    Kategorie saved = kategorieRepository.save(existing);

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
