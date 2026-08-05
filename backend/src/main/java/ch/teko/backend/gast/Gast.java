package ch.teko.backend.gast;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Table(name = "gast")
public class Gast {
    @Id
    private Long gastId;
    private String nachname;
    private String vorname;
    private String email;
    private String telefon;
    private LocalDate geburtsdatum;

    public Long getGastId() {
        return gastId;
    }

    public String getNachname() {
        return nachname;
    }

    public String getVorname() {
        return vorname;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefon() {
        return telefon;
    }

    public LocalDate getGeburtsdatum() {
        return geburtsdatum;
    }

    public void setGastId(Long gastId) {
        this.gastId = gastId;
    }

    public void setNachname(String nachname) {
        this.nachname = nachname;
    }

    public void setVorname(String vorname) {
        this.vorname = vorname;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public void setGeburtsdatum(LocalDate geburtsdatum) {
        this.geburtsdatum = geburtsdatum;
    }
}
