package ch.teko.backend.zimmer;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "zimmer")
public class Zimmer {
    @Id
    private Long zimmerId;
    private Long hotelId;
    private Long kategorieId;
    private String zimmerNr;

    public Long getHotelId() {
        return hotelId;
    }

    public Long getZimmerId() {
        return zimmerId;
    }

    public Long getKategorieId() {
        return kategorieId;
    }

    public String getZimmerNr() {
        return zimmerNr;
    }

    public void setZimmerId(Long zimmerId) {
        this.zimmerId = zimmerId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public void setKategorieId(Long kategorieId) {
        this.kategorieId = kategorieId;
    }

    public void setZimmerNr(String zimmerNr) {
        this.zimmerNr = zimmerNr;
    }
}
