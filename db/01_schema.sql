CREATE TABLE hotel
(
    hotel_id SERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    ort      VARCHAR(100) NOT NULL
);

CREATE TABLE kategorie
(
    kategorie_id    SERIAL PRIMARY KEY,
    bezeichnung     VARCHAR(50)   NOT NULL UNIQUE,
    preis_pro_nacht NUMERIC(6, 2) NOT NULL CHECK (preis_pro_nacht > 0)
);

CREATE TABLE gast
(
    gast_id      SERIAL PRIMARY KEY,
    nachname     VARCHAR(50)  NOT NULL,
    vorname      VARCHAR(50)  NOT NULL,
    email        VARCHAR(100) NOT NULL UNIQUE,
    telefon      VARCHAR(20),
    geburtsdatum DATE         NOT NULL CHECK (geburtsdatum <= CURRENT_DATE - INTERVAL '18 years')
    );

CREATE TABLE zimmer
(
    zimmer_id    SERIAL PRIMARY KEY,
    hotel_id     INT         NOT NULL REFERENCES hotel (hotel_id),
    kategorie_id INT         NOT NULL REFERENCES kategorie (kategorie_id),
    zimmer_nr    VARCHAR(10) NOT NULL,
    UNIQUE (hotel_id, zimmer_nr)
);

CREATE TABLE buchung
(
    buchung_id   SERIAL PRIMARY KEY,
    gast_id      INT         NOT NULL REFERENCES gast (gast_id),
    anreisedatum DATE        NOT NULL,
    abreisedatum DATE        NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'bestätigt' CHECK (status IN ('bestätigt', 'storniert', 'abgeschlossen')),
    CHECK (abreisedatum > anreisedatum)
);

CREATE TABLE zimmer_buchung
(
    zimmer_id       INT           NOT NULL REFERENCES zimmer (zimmer_id),
    buchung_id      INT           NOT NULL REFERENCES buchung (buchung_id),
    preis_pro_nacht NUMERIC(6, 2) NOT NULL CHECK (preis_pro_nacht > 0),
    PRIMARY KEY (zimmer_id, buchung_id)
);
