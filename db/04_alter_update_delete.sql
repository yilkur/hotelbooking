-- 1. Sternebewertung für Hotels hinzufügen
ALTER TABLE hotel
    ADD COLUMN sterne INT CHECK (sterne BETWEEN 1 AND 5);

-- 2. Newsletter Opt-in für Gäste hinzufügen
ALTER TABLE gast
    ADD COLUMN newsletter BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. Spaltenlänge für Hotelnamen erhöhen (100 -> 150 Zeichen)
ALTER TABLE hotel
    ALTER COLUMN name TYPE VARCHAR(150);

-- 4. Preise pro Nacht um 5% erhöhen
UPDATE kategorie
SET preis_pro_nacht = ROUND(preis_pro_nacht * 1.05, 2);

-- 5. Vergangene bestätigte Buchungen automatisch als abgeschlossen markieren
UPDATE buchung
SET status = 'abgeschlossen'
WHERE status = 'bestätigt'
  AND abreisedatum < CURRENT_DATE;

-- 6. Telefonnummer eines Gasts anhand der Email aktualisieren
UPDATE gast
SET telefon = '+41 79 000 11 22'
WHERE email = 'c.studer@mail.ch';

-- 7. Stornierte Buchungen inkl. zugehöriger Zimmerzuordnungen entfernen
-- (zimmer_buchung zuerst, da FK auf buchung_id)
DELETE FROM zimmer_buchung
WHERE buchung_id IN (SELECT buchung_id FROM buchung WHERE status = 'storniert');

DELETE FROM buchung
WHERE status = 'storniert';

-- 8. Abgeschlossene Buchungen löschen (10 Jahre Frist)
-- (zimmer_buchung zuerst, da FK auf buchung_id)
DELETE FROM zimmer_buchung
WHERE buchung_id IN (
    SELECT buchung_id FROM buchung
    WHERE status = 'abgeschlossen' AND abreisedatum < CURRENT_DATE - INTERVAL '10 years'
    );

DELETE FROM buchung
WHERE status = 'abgeschlossen' AND abreisedatum < CURRENT_DATE - INTERVAL '10 years';
