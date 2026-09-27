# WohnPlanbar Produktdaten

Diese Schicht trennt Produkte von Händlerangeboten.

## Produkt
Ein Produkt existiert nur einmal und erhält eine interne ID. Matching erfolgt bevorzugt über EAN/GTIN, danach Marke + Modell.

## Angebot
Mehrere Angebote können unter einem Produkt liegen. Ein Angebot kann Partner, Preis, Währung, Verfügbarkeit, Deeplink und Aktualisierungszeit enthalten.

## Partner
Partnerprogramme werden erst nach Freigabe aktiviert. Zugangsdaten oder Passwörter gehören nicht in dieses Repository.

## Feed-Import
Awin-, CSV-, XML- oder API-Daten werden später in dieses interne Schema normalisiert. Die Finder sollen auf Produktmerkmale zugreifen und nicht direkt von einem einzelnen Händlerfeed abhängen.
