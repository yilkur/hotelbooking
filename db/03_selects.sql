-- Abfrage 1: Alle Zimmer eines Hotel samt Kategorie
SELECT z.zimmer_nr, k.bezeichnung
FROM zimmer z
         JOIN kategorie k ON k.kategorie_id = z.kategorie_id
WHERE z.hotel_id = 1;

-- Abfrage 2: Alle bestätigten Buchungen mit Gast
SELECT g.nachname, g.vorname, b.anreisedatum, b.abreisedatum
FROM buchung b
         JOIN gast g ON g.gast_id = b.gast_id
WHERE b.status = 'bestätigt';

-- Abfrage 3: Anzahl Zimmer pro Hotel
SELECT h.name AS hotel, COUNT(*) AS anzahl_zimmer
FROM hotel h
         JOIN zimmer z ON z.hotel_id = h.hotel_id
GROUP BY h.name;

-- Abfrage 4: Anzahl Buchungen pro Gast
SELECT g.nachname, COUNT(b.buchung_id) AS anzahl_buchungen
FROM gast g
         JOIN buchung b ON b.gast_id = g.gast_id
GROUP BY g.gast_id, g.nachname;

-- Abfrage 5: Welche Zimmer gehören zu einer Buchung
SELECT z.zimmer_nr, k.bezeichnung
FROM zimmer_buchung zb
         JOIN zimmer z ON z.zimmer_id = zb.zimmer_id
         JOIN kategorie k ON k.kategorie_id = z.kategorie_id
WHERE zb.buchung_id = 1;
