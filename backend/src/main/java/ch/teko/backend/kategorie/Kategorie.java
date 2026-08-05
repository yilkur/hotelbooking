package ch.teko.backend.kategorie;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;

@Table(name = "kategorie")
public class Kategorie {
    @Id
    private Long kategorieId;
    private String bezeichnung;
    private BigDecimal preisProNacht;

    public Long getKategorieId() {
        return kategorieId;
    }

    public String getBezeichnung() {
        return bezeichnung;
    }

    public BigDecimal getPreisProNacht() {
        return preisProNacht;
    }

    public void setKategorieId(Long kategorieId) {
        this.kategorieId = kategorieId;
    }

    public void setBezeichnung(String bezeichnung) {
        this.bezeichnung = bezeichnung;
    }

    public void setPreisProNacht(BigDecimal preisProNacht) {
        this.preisProNacht = preisProNacht;
    }
}
