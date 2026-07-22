# Hotelbuchungssystem

DBB-Projektarbeit – Prototyp eines Hotelbuchungssystems mit relationaler Datenbank
und CRUD-Oberfläche.

**Modul:** Datenbanken, Big Data, Data Cubes (DBB) · TEKO – Höhere Fachschule
**Autor:** Yilmaz Kurnazcan · **Dozent:** Milad Fakiry

## Technologie

- **Datenbank:** PostgreSQL
- **Backend:** Java / Spring Boot (REST, JDBC)
- **Frontend:** React (Vite) mit Material UI

## Projektstruktur

```
hotelbuchung/
├── backend/    Spring-Boot-Anwendung (Port 8080)
├── frontend/   React + Vite + MUI (Port 5173)
└── db/         SQL-Skripte (Schema + Testdaten)
```

## Setup

**1. Datenbank**

Datenbank `hotelbooking` in PostgreSQL anlegen und die Skripte aus `db/` ausführen:

```bash
psql -d hotelbooking -f db/01_schema.sql
psql -d hotelbooking -f db/02_seed.sql
```

**2. Backend**

Zugangsdaten in `backend/src/main/resources/application.properties` setzen
(`spring.datasource.url/username/password`), dann:

```bash
cd backend
./mvnw spring-boot:run
```

**3. Frontend**

```bash
cd frontend
npm install
npm run dev
```

Anwendung läuft anschliessend auf http://localhost:5173.
