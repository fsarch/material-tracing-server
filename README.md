# material-tracing-server

`material-tracing-server` ist ein NestJS-basierter Service zur Material- und Teileverfolgung mit TypeORM, Authentifizierung und Swagger-Dokumentation.

Diese README fokussiert sich auf die **Verwendung**, also auf Start, Deployment und vor allem die **Konfiguration** des Services.

## Schnellstart

- API-Dokumentation: `/docs`
- Standard-Port lokal: `3000`
- Standard-Port im Container: `8080`
- Konfiguration: per `config.yaml` oder `CONFIG_FILE_PATH`
- Migrationen: werden beim Start automatisch ausgeführt

## Docker-Image verwenden

Das Image wird laut `.github/workflows/image.yml` nach Docker Hub veröffentlicht als:

- `fsarch/material-tracing-server:latest`

Der Workflow baut das Image für:

- `linux/amd64`
- `linux/arm64`

### Image herunterladen

```bash
docker pull fsarch/material-tracing-server:latest
```

### Container mit Konfigurationsdatei starten

Die Anwendung erwartet standardmäßig eine Datei `config.yaml` im aktuellen Arbeitsverzeichnis des Prozesses. Im Container ist das Arbeitsverzeichnis `/usr/src/app`.

Wenn deine Konfiguration lokal als `./config.yaml` vorliegt, kannst du den Service so starten:

```bash
docker run --rm \
  -p 8080:8080 \
  -v "$(pwd)/config.yaml:/usr/src/app/config.yaml:ro" \
  fsarch/material-tracing-server:latest
```

### Container mit abweichendem Konfigurationspfad starten

Wenn du stattdessen z. B. ein ganzes Verzeichnis mounten willst, kannst du den Pfad per Umgebungsvariable setzen:

```bash
docker run --rm \
  -p 8080:8080 \
  -e CONFIG_FILE_PATH=/usr/src/app/config/config.yml \
  -v "$(pwd)/config:/usr/src/app/config:ro" \
  fsarch/material-tracing-server:latest
```

Danach ist Swagger typischerweise unter folgender URL erreichbar:

- `http://localhost:8080/docs`

## Lokal mit Node.js starten

### Voraussetzungen

- Node.js `>= 18.19.0`
- npm
- Eine erreichbare Datenbank, falls `postgres` oder `cockroachdb` verwendet wird

### Installation

```bash
npm ci
```

### Beispielkonfiguration bereitstellen

Im Repository liegt eine Beispielkonfiguration unter `config/config.yml`.

Da der Service standardmäßig `config.yaml` im Projekt-Root lädt, gibt es zwei gängige Wege:

#### Variante A: Datei in den erwarteten Standardnamen kopieren

```bash
cp config/config.yml config.yaml
```

#### Variante B: Pfad explizit setzen

```bash
CONFIG_FILE_PATH=config/config.yml npm run start:dev
```

### Starten

Für lokale Entwicklung:

```bash
npm run start:dev
```

Für einen normalen Start ohne Watch-Modus:

```bash
npm run start
```

Für ein Produktions-Build lokal:

```bash
npm run build
npm run start:prod
```

## Konfiguration

### Wie die Konfiguration geladen wird

- Standarddatei: `config.yaml`
- Alternativer Pfad: über `CONFIG_FILE_PATH`
- Format: YAML

Die Datei wird beim Start geladen. Ein minimales Beispiel könnte so aussehen:

```yaml
database:
  type: postgres
  host: db-01
  port: 5432
  username: app
  password: change-me
  database: material_tracing
  ssl:
    rejectUnauthorized: false

auth:
  type: oidc
  discovery_url: https://example.com/.well-known/openid-configuration

uac:
  type: static
  users:
    - user_id: "abcdef"
      permissions:
        - manage_claims
```

> Hinweis: Im Repository ist bereits `config/config.yml` als Beispiel vorhanden. Für lokale Tests kannst du diese Datei an deine Umgebung anpassen.

### Abschnitt `database`

Der Service unterstützt laut Code aktuell folgende Datenbanktypen:

- `postgres`
- `cockroachdb`
- `sqlite`

#### PostgreSQL / CockroachDB

Beispiel:

```yaml
database:
  type: postgres
  host: db-01
  port: 5432
  username: app
  password: change-me
  database: material_tracing
  ssl:
    rejectUnauthorized: false
```

Unterstützte Felder:

- `type`
- `host`
- `port`
- `username`
- `password`
- `database`
- `ssl.rejectUnauthorized`
- `ssl.ca`
- `ssl.cert`
- `ssl.key`

Für `ssl.ca`, `ssl.cert` und `ssl.key` sind laut Konfiguration sowohl direkte String-Werte als auch Dateipfade möglich.

Beispiel mit Zertifikatspfaden:

```yaml
database:
  type: postgres
  host: db-01
  port: 5432
  username: app
  password: change-me
  database: material_tracing
  ssl:
    rejectUnauthorized: true
    ca:
      path: /certs/ca.crt
    cert:
      path: /certs/client.crt
    key:
      path: /certs/client.key
```

#### SQLite

Für lokale oder einfache Setups ist auch SQLite vorgesehen:

```yaml
database:
  type: sqlite
  database: ./example-data/database.sqlite3
```

### Abschnitt `auth`

Der Service aktiviert Authentifizierung im Bootstrap und unterstützt laut Konfiguration mehrere Modi.

#### OIDC

```yaml
auth:
  type: oidc
  discovery_url: https://example.com/.well-known/openid-configuration
```

#### Static Auth

```yaml
auth:
  type: static
  secret: very-secret-key
  users:
    - id: "1"
      username: admin
      password: admin
```

#### JWT über JWK

```yaml
auth:
  type: jwt-jwk
  jwkUrl: https://example.com/jwks.json
```

### Abschnitt `uac`

Für Berechtigungen ist im Code ein statischer UAC-Modus vorgesehen:

```yaml
uac:
  type: static
  users:
    - user_id: "abcdef"
      permissions:
        - manage_claims
```

Welche konkreten Berechtigungswerte in einer Instanz erlaubt sind, hängt von den im Service registrierten Rollen bzw. Permissions ab.

## Laufzeitverhalten

### Port

- Lokal lauscht der Service standardmäßig auf `3000`
- Im Dockerfile ist `PORT=8080` gesetzt
- Der Port kann über die Umgebungsvariable `PORT` überschrieben werden

Beispiel:

```bash
PORT=4000 CONFIG_FILE_PATH=config/config.yml npm run start
```

### Swagger

Nach dem Start wird die Swagger-Oberfläche unter `/docs` bereitgestellt.

Beispiele:

- lokal: `http://localhost:3000/docs`
- im Container: `http://localhost:8080/docs`

### Datenbankmigrationen

Die Datenbankmigrationen sind aktiviert und werden beim Start automatisch ausgeführt.

Wichtig für den Betrieb:

- Die konfigurierte Datenbank muss beim Start erreichbar sein
- Der verwendete Datenbanknutzer muss ausreichende Rechte für Migrationen besitzen

## Nützliche Befehle

```bash
npm run build
npm run start
npm run start:dev
npm run start:prod
npm run lint
npm test
npm run test:cov
```

TypeORM-Skripte:

```bash
npm run migration:run
npm run migration:generate -- -n <name>
npm run migration:create --name=<name>
npm run migration:revert
```

## Hinweise für Betrieb und Anpassung

- Entities und Migrationen sind in `src/database/index.ts` registriert.
- Controller liegen in `src/controllers`.
- Datenzugriff läuft über Services in `src/repositories`.
- Datenbankmodelle werden nicht direkt an Clients zurückgegeben, sondern über DTOs in `src/models` abgebildet.

