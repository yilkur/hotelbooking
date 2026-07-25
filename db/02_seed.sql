TRUNCATE zimmer_buchung, buchung, zimmer, gast, kategorie, hotel
    RESTART IDENTITY CASCADE;

------------ HOTEL ----------
INSERT INTO hotel (name, ort)
VALUES ('Alpenblick', 'Interlaken'),
       ('Seehof', 'Luzern')
;

------------ KATEGORIE ----------
INSERT INTO kategorie (bezeichnung, preis_pro_nacht)
VALUES ('Einzelzimmer', 120.00),
       ('Doppelzimmer', 180.00),
       ('Suite', 250.00),
       ('Familienzimmer', 320.00)
;

------------ GAST ----------
INSERT INTO gast (nachname, vorname, email, telefon, geburtsdatum)
VALUES ('Meier', 'Anna', 'a.meier@mail.ch', '+41 79 123 45 67', '1990-05-14'),
       ('Keller', 'Beat', 'b.keller@mail.ch', '+41 78 222 33 44', '1985-11-02'),
       ('Studer', 'Claudia', 'c.studer@mail.ch', NULL, '1998-03-21'),
       ('Rossi', 'Marco', 'm.rossi@mail.ch', '+41 76 555 66 77', '1979-07-30'),
       ('Baumann', 'Nina', 'n.baumann@mail.ch', '+41 79 888 99 00', '2005-01-10')
;

------------ ZIMMER ----------
INSERT INTO zimmer (hotel_id, kategorie_id, zimmer_nr)
VALUES (1, 2, '101'),
       (1, 2, '102'),
       (1, 3, '201'),
       (1, 4, '305'),
       (2, 1, '101'),
       (2, 1, '012'),
       (2, 2, '210')
;

------------ BUCHUNG ----------
INSERT INTO buchung (gast_id, anreisedatum, abreisedatum, status)
VALUES (1, '2026-09-10', '2026-09-13', 'bestätigt'),
       (1, '2026-11-05', '2026-11-07', 'bestätigt'),
       (2, '2026-09-20', '2026-09-22', 'abgeschlossen'),
       (3, '2026-10-01', '2026-10-04', 'storniert'),
       (4, '2026-12-20', '2026-12-27', 'bestätigt'),
       (5, '2026-09-11', '2026-09-12', 'bestätigt')
;

------------ ZIMMER_BUCHUNG ----------
INSERT INTO zimmer_buchung (zimmer_id, buchung_id, preis_pro_nacht)
VALUES (1, 1, 180.00),
       (3, 1, 250.00),
       (2, 2, 180.00),
       (6, 3, 110.00),
       (7, 4, 180.00),
       (4, 5, 300.00),
       (5, 6, 120.00)
;
