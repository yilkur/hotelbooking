package ch.teko.backend.buchung;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Table(name = "buchung")
public class Buchung {
    @Id
    private Long buchungId;
    private Long gastId;
    private LocalDate anreisedatum;
    private LocalDate abreisedatum;
    private String status;
    @MappedCollection(idColumn = "buchung_id")
    private Set<ZimmerBuchung> zimmer = new HashSet<>();

    public Long getBuchungId() {
        return buchungId;
    }

    public Long getGastId() {
        return gastId;
    }

    public LocalDate getAnreisedatum() {
        return anreisedatum;
    }

    public LocalDate getAbreisedatum() {
        return abreisedatum;
    }

    public String getStatus() {
        return status;
    }

    public Set<ZimmerBuchung> getZimmer() {
        return zimmer;
    }

    public void setBuchungId(Long buchungId) {
        this.buchungId = buchungId;
    }

    public void setGastId(Long gastId) {
        this.gastId = gastId;
    }

    public void setAnreisedatum(LocalDate anreisedatum) {
        this.anreisedatum = anreisedatum;
    }

    public void setAbreisedatum(LocalDate abreisedatum) {
        this.abreisedatum = abreisedatum;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setZimmer(Set<ZimmerBuchung> zimmer) {
        this.zimmer = zimmer;
    }
}
