Kurz: Ich analysiere das Projekt und dokumentiere Anforderungen, Architektur, Setup- und Migrationsregeln sowie offene Fragen.

High-Level-Plan
- Bestandsaufnahme: package.json, Dockerfile, TypeScript/Build-Konfiguration
- Architektur: Module, Fsarch-Integration, DB-Module
- Persistenz: Entities, Migrations, Registrierung (DATABASE_OPTIONS)
- DTOs/Models: Konventionen in `src/models`
- Controller/Repository/Service-Konventionen
- Tests, Linting, CI
- Gefundene Probleme und konkrete Empfehlungen

Checkliste (wird in dieser Datei abgearbeitet)


# requirements.md — Projektanalyse: material-tracing-server

Datum: 2026-04-17
Analyst: automatisierte Repository-Analyse

1) Projekt-Metadaten
- Projektname (package.json): material-tracing-server
- Version (package.json): 0.0.1
- Node Engine (package.json.engines): >=18.19.0
- ESM: package.json enthält "type": "module" → ESM-Module

Wichtige NPM-Scripts (Auswahl)
- build: nest build
- start: nest start
- start:dev: nest start --watch | pino-pretty
- start:prod: node dist/main
- migration:run / migration:generate / migration:create → TypeORM CLI konfiguriert

Abhängigkeiten (Kurz)
- NestJS: @nestjs/* v11
- ORM: typeorm v0.3.20, @nestjs/typeorm
- DB-Client: pg
- Validation/DTO: class-validator, class-transformer, joi, zod
- Logging: pino, pino-pretty
- Sonstiges: reflect-metadata, rxjs, jose, nanoid

Dev-Dependencies (Kurz)
- TypeScript 5.6, ts-node, jest/ts-jest, eslint, prettier

2) Build & Docker
- `Dockerfile` verwendet Node 24 (image: node:24.14.1-trixie-slim). Build in multi-stage: deps, builder, final.
- Produktion: Kopiert `dist` und `node_modules` ins finale Image und startet `node ./dist/main.js` auf PORT 8080.
- Empfehlung: image-Tag ist aktuell; bei Security/Size-Optimierung prüfen (distroless/extra slim) und rebuild-frequency beachten.

3) Architektur-Überblick
- NestJS Anwendung; Einstiegspunkte: `src/main.ts`, `src/app.module.ts`.
- Es existiert ein Framework-Modul `FsarchModule` (global), das dynamisch Auth, UAC und Database integrieren kann via `FsarchModule.register({ ... })`.
- In `src/main.ts` wird `FsArchAppBuilder` verwendet, dort wird `FsarchModule.register({ database: DATABASE_OPTIONS, auth: {} })` gesetzt.

4) Persistenz (TypeORM) — Fundamente
- DB-Integration: `src/fsarch/database/database.module.ts` → TypeOrmModule.forRootAsync
  - Erwartete Optionen: { migrations: Array<Function>, entities: Array<Function|EntitySchema> }
  - Default-Optionen: migrationsRun: true, synchronize: false, logging: ['query','error']
  - Verhalten: migrationsRun=true führt Migrationen beim Start automatisch aus. In diesem Projekt ist das erwünscht und darf auch in Produktion ausgeführt werden (siehe Abschnitt "Entscheidungen").

- Wo werden Entities & Migrationen registriert? → `src/database/index.ts` exportiert `DATABASE_OPTIONS` mit `entities` und `migrations` arrays.
  - `src/main.ts` liest `DATABASE_OPTIONS` und übergibt es an `FsArchAppBuilder.setDatabase(DATABASE_OPTIONS)`.
  - `FsArchAppBuilder` baut dann ein dynamisches App-Modul und ruft `FsarchModule.register({ database: this.databaseOptions })` auf.

5) Entities
- Alle DB-Entities liegen in `src/database/entities/`:
  - manufacturer.entity.ts
  - material.entity.ts
  - material_short_code.entity.ts
  - material_type.entity.ts
  - part.entity.ts
  - part_children.entity.ts
  - part_material.entity.ts
  - part_short_code.entity.ts
  - part_type.entity.ts
  - short_code.entity.ts
  - short_code_type.entity.ts

- Beobachtungen / potentielle Probleme bei Entities
  - `material.entity.ts` nutzt `@PrimaryGeneratedColumn(...){ primaryKeyConstraintName: 'pk__material_type' }` — der Constraintname verweist auf `material_type` und scheint ein Copy/Paste-Fehler. Empf.: prüfen und ggf. korrigieren zu `pk__material`.

6) Migrationen
- Migrationen in `src/database/migrations/` (Beispiele):
  - 1733690865449-base-tables.ts (Klasse: BaseTables1720373216667)
  - 1748372988976-part-amount.ts (Klasse: PartAmount1748372988976)
  - 1749376805136-checkout-time.ts (Klasse: CheckoutTime1749376805136)
  - 1753046680101-add-hint-fields.ts (Klasse: AddHintFields1753046680101)
  - 1766219951021-add-archive-time.ts (Klasse: AddArchiveTime1766219951021)

- Registrierung: Alle oben genannten Migration-Klassen sind in `src/database/index.ts` importiert und der `migrations`-Liste hinzugefügt.

 - Auffälligkeiten/Risiken
  - In `1733690865449-base-tables.ts` ist die `down()`-Methode inkonsistent: sie löscht Tabellen, die in der `up()`-Methode nicht erstellt wurden (z. B. `list_attribute`, `attribute`, `catalog` etc.). Das ist gefährlich (Downgrade nicht reversibel / inkonsistente Down-Logik). Empf.: Migrationen prüfen und korrigieren.
  - Migrationen werden beim Start automatisch ausgeführt (migrationsRun: true). Das ist aktuell beabsichtigt und darf auch in Produktions-Umgebungen ausgeführt werden. Empfehlung: dennoch Backup/Monitoring und Rollback-Strategie sicherstellen.

7) Registrierung von Entities / Migrationen — Konvention
- Wichtig: Neue Entities und Migrationen müssen in `DATABASE_OPTIONS` (aktuell in `src/database/index.ts`) eingetragen werden, damit TypeORM sie beim Start verwendet.
- Projekt-internes Guidance-File (`.github/copilot-instructions.md`) erwähnt „When adding a database migration file, also register it in the app.module.ts file under the database.migrations array inside FsarchModule.register(). Database models are defined in the src/database/entities directory and registered in the database.entities array inside FsarchModule.register()." — in diesem Repo ist die praktische Implementierung: `src/database/index.ts` exportiert `DATABASE_OPTIONS`, welches in `main.ts` an FsarchModule übergeben wird. Bitte bestätigen: bevorzugter Ort für Registrierung ist `src/database/index.ts` oder direkte Eintragung in `AppModule`/`FsarchModule.register()`?

8) Models / DTOs
- DTOs und Model-Klassen liegen in `src/models/` und folgen dem Muster:
  - Create/Update DTOs (z. B. MaterialCreateDto, MaterialUpdateDto)
  - Read-DTOs mit `FromDbo()` statischen Methoden, die Entities in DTOs umwandeln (z. B. `MaterialDto.FromDbo(material: Material)`)
- Konventionen gefunden: DTOs kontrollieren, welche Felder an die API zurückgegeben werden (good). Modelle nutzen `@ApiProperty` für Swagger-Dokumentation.

9) Controller / Repositories / Services (Architektur)
- Controller im Repo sind plural benannt und liegen unter `src/controllers/<resource>/` (z. B. `manufacturers`, `materials`, `parts`), enthalten `*Controller`-Klassen.
- Repositories/Services sind unter `src/repositories/<resource>/` (module + service) organisiert; `RepositoriesModule` importiert alle repository-Module.
- Konventionen:
  - Controller-Module und Controller-Klassen → Plural
  - Service-Module und Service-Klassen → Singular
  - Controllers rufen Services auf; direkte DB-Queries in Controllern nicht erwünscht

10) Tests & Linting
- Jest ist konfiguriert (in package.json). Es existieren spec-Dateien in `src/controllers`.
- ESLint + Prettier sind vorhanden (devDependencies + scripts).
- CI (z. B. GitHub Actions) wurde im Repo nicht gefunden (keine `.github/workflows`), Empfehlung: CI einrichten, das Lint, Build, Tests und Migration-Validierung ausführt.

11) Sonstiges
- TypeORM CLI scripts sind in package.json vorhanden (typeorm cli via ts-node/esm loader). Es gibt scripts zum Generieren/Erstellen/Lauf von Migrationen.

12) Gefundene kritische Issues / Risiken (Priorisiert)
1. Migration `down()`-Methoden inkonsistent (BaseTables-Migration löscht andere Tabellen) — Kritisch: kann Downgrade/Restore verhindern.
2. `material.entity.ts` PrimaryKey constraint name falsch (`pk__material_type`) — Hoch: kann zu Verwirrung oder DB-Constraint-Konflikten führen.
3. automatic migrationsRun: true in DatabaseModule — Hoch: riskant in Prod; Migrationen sollten kontrolliert werden.
4. Keine CI-Workflows vorhanden — Mittel: Kein automatischer Test-/Lint-/Migration-Check.

13) Empfehlungen / Nächste Schritte (konkret)
- Sofortige Code-Checks
  - Review und Korrektur der PrimaryKey-Constraint-Namen in Entities (z. B. `material.entity.ts`).
  - Überprüfe und korrigiere `down()`-Methoden in Migrationen; jede Migration sollte `down()` so implementieren, dass sie exakt das macht, was `up()` erzeugt.
 - Prozess & Automatisierung
  - `migrationsRun: true` ist in diesem Projekt akzeptiert und darf in Production ausgeführt werden; dennoch empfehlen sich Backup/Monitoring- und Rollback-Prozesse.
  - CI hinzufügen: build -> lint -> test -> typecheck -> migration dry-run (typeORM oder SQL preview).
  - Add a pre-merge checklist that verifies newly added migrations/entities are registered in `src/database/index.ts` (or consistent registration spot).
- Konventionen dokumentieren
  - Ergänze README oder CONTRIBUTING: Wo neue Entities/Migrations/DTOs einzutragen sind (aktuell: `src/database/index.ts` für DATABASE_OPTIONS, `src/models` für DTOs, `src/repositories` für Services)

14) Entscheidungen / Antworten auf vorherige Fragen
1. Offizieller Registrierungsort für neue Entities & Migrationen: `src/database/index.ts` (wird verwendet und ist die offizielle Stelle).
2. `migrationsRun` darf auch in Production ausgeführt werden (Projekt-Entscheidung).
3. Automatische Prüfungen / Pre-commit Hooks: Nein, sollen nicht eingeführt werden.
4. Datumsformat in DTOs: Ja — alle client-visible timestamps sollen als ISO-Strings ausgegeben werden.
5. PRs mit automatischen Fixes: Nein — keine automatischen PRs erstellen; nur Empfehlungen/Issues.

15) Anhänge: Fundstellen wichtiger Dateien
- package.json (root)
- Dockerfile (root)
- src/main.ts (Aufruf FsArchAppBuilder und DATABASE_OPTIONS)
- src/database/index.ts (EXPORT DATABASE_OPTIONS mit entities + migrations)
- src/fsarch/database/database.module.ts (TypeORM-Konfiguration: migrationsRun true)
- src/database/entities/* (Entities)
- src/database/migrations/* (Migration-Dateien)
- src/models/* (DTOs)

Wenn ihr möchtet, kann ich auf Basis der Empfehlungen:
- a) Ein PR mit Code-Fixes (kleine, sichere Änderungen) vorbereiten (z. B. korrigieren offensichtliche Typos in constraint names),
- b) Ein CI-Workflow-Vorschlag (GitHub Actions) erstellen, der lint/test/build/migration-check ausführt, oder
- c) Detaillierte Anleitung (Checkliste) erzeugen, wie Entwickler neue Entities/Migrations/DTOs hinzufügen und registrieren sollen.

Bitte beantwortet die Offenen Fragen (Abschnitt 14) oder sagt, welche der drei Folgeaktionen (a/b/c) ich durchführen soll — dann setze ich die Änderungen um oder generiere die entsprechenden PRs/Workflows.

