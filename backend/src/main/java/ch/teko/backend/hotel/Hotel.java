package ch.teko.backend.hotel;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "hotel")
public class Hotel {
    @Id
    private Long hotelId;
    private String name;
    private String ort;

    public Long getHotelId() {
        return hotelId;
    }

    public String getName() {
        return name;
    }

    public String getOrt() {
        return ort;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setOrt(String ort) {
        this.ort = ort;
    }
}
