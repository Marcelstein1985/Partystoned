# WohnPlanbar Feed-Import

Dieser Ordner definiert die Normalisierung externer Händlerfeeds. Er ist bewusst vom öffentlichen Finder getrennt.

## Ablauf

1. Partnerfeed als CSV, XML, JSON oder API-Antwort einlesen.
2. Quelldaten in Zeilen/Objekte umwandeln.
3. `feed-normalizer.js` normalisiert Feldnamen, Preise und Verfügbarkeit.
4. Produktzuordnung in dieser Reihenfolge:
   - EAN/GTIN
   - bereits bekannte Händler-SKU
   - Marke + Modell
5. Treffer werden zu zentralen Angeboten für `data/offers.js`.
6. Nicht zugeordnete Produkte landen in `unmatched` und werden nicht automatisch veröffentlicht.
7. Ungültige Treffer ohne Preis oder Deeplink landen in `invalid`.

## Sicherheitsregel

Passwörter, API-Schlüssel, Awin-Zugangsdaten oder andere Secrets niemals in JavaScript-Dateien des öffentlichen Repositories speichern.

## Erwartete Normalform

Ein gültiges Angebot enthält mindestens:

- productId
- merchantId
- price
- currency
- deeplink
- live: true

Optional: Verfügbarkeit, Bild, Aktualisierungszeit, Feed-Quelle und Matching-Methode.

## Nächster Schritt bei einem echten Feed

Sobald ein Feed vorliegt, werden dessen tatsächliche Spalten einmalig auf das Schema gemappt. Danach kann derselbe Importweg für Aktualisierungen wiederverwendet werden.
