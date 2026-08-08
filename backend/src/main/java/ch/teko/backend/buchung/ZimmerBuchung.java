package ch.teko.backend.buchung;

import java.math.BigDecimal;

public class ZimmerBuchung {
    private Long zimmerId;
    private BigDecimal preisProNacht;

    public Long getZimmerId() {
        return zimmerId;
    }

    public BigDecimal getPreisProNacht() {
        return preisProNacht;
    }

    public void setZimmerId(Long zimmerId) {
        this.zimmerId = zimmerId;
    }

    public void setPreisProNacht(BigDecimal preisProNacht) {
        this.preisProNacht = preisProNacht;
    }
}
