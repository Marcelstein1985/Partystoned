# WohnPlanbar – verbindliche Änderungs- und QA-Regeln

Stand: 2026-09-27

## Ziel
Designänderungen dürfen bestehende Funktionen, Scoring-Logik, mobile Nutzbarkeit oder sichtbare Inhalte nicht unbeabsichtigt beschädigen.

## 1. Keine Direktänderung am freigegebenen Stand
- Der zuletzt funktionierende Commit bleibt unverändert als Rollback-Punkt.
- Neue Änderungen zuerst als eigener Preview-Commit bzw. eigener Preview-Dateistand.
- Erst nach bestandener Prüfung wird der Preview-Link weitergegeben.
- Für RawGitHack immer eine immutable Commit-URL verwenden, niemals nur den Branch-Link als Abnahme-Link.

## 2. Logik und Design strikt trennen
- Änderungen an Farben, Bildern, Typografie, Animationen oder Layout dürfen die Finder-Scoring-Funktion nicht verändern.
- Baseline der aktuellen Scoring-Funktion: `fnv1a-84782dc5`.
- Produktanzahl Baseline: 30.
- Änderungen an Scoring oder Produktdaten nur nach ausdrücklicher fachlicher Änderung, nicht als Nebeneffekt eines Redesigns.

## 3. Keine neuen CSS-Schichten als Dauerlösung
- Nicht immer neue Override-Blöcke unter alte Styles hängen.
- Bei V5 werden die Styles konsolidiert: eine Regel pro Komponente und Breakpoint.
- Keine widersprüchlichen Definitionen für dieselbe Kernkomponente.
- Mobile Styles werden bewusst definiert und nicht nur vom Desktop abgeleitet.

## 4. Mobile First
Pflichttests vor jeder Freigabe:
- 390 x 844 px
- 430 x 932 px
- Desktop 1440 x 900 px
- Kein horizontaler Scroll.
- Kein abgeschnittener Text.
- Keine überlappenden Sticky-/Fixed-Elemente.
- iPhone Safe Area berücksichtigen: `env(safe-area-inset-top)` / bottom.
- Startseite muss bei Seitenaufruf oben beginnen; Scroll-Restoration darf nicht zu einer alten Position springen.

## 5. Progressive Enhancement für Animationen
- Wichtige Inhalte sind standardmäßig sichtbar.
- Animationen dürfen Inhalte nie als Grundzustand mit `opacity:0` verstecken.
- Verstecken nur unter einer expliziten `.js`-Klasse, nachdem JavaScript erfolgreich gestartet ist.
- `IntersectionObserver` nur mit Feature-Check; Fallback zeigt Inhalte sofort.
- `prefers-reduced-motion` muss respektiert werden.

## 6. Header-Regeln
- Mobile Header kompakt, maximal eine Zeile.
- Keine zweizeilige Tagline im mobilen Sticky-Header.
- Header darf Hero-Text, Hero-Bild oder schwebende Karten nicht überdecken.
- Sticky nur, wenn er nachweislich auf iPhone nicht stört; sonst statisch.

## 7. Hero-Regeln
- Auf Mobil zuerst: Headline + Nutzen + Haupt-CTA. Bild erst danach.
- Haupt-CTA muss im ersten sinnvollen Sichtbereich erreichbar sein.
- Hero-Bild darf nicht den eigentlichen Nutzen verdrängen.
- Mobile Bildhöhe begrenzen und `object-position` bewusst setzen.
- Maximal eine schwebende Info-Karte auf Mobil.
- Kein sichtbarer Fotocredit mitten im Hauptmotiv; Credits in Footer/Impressumsnähe oder eigene lizenzierte Assets.

## 8. Bilder
- Jedes Bild: sinnvolles `alt`.
- Breite/Höhe oder `aspect-ratio` reservieren, um Layout Shift zu verhindern.
- Hero-Bild priorisiert laden; nachfolgende Bilder `loading="lazy"`.
- Externe Hotlinks nur im Prototyp. Produktion: Assets selbst hosten/CDN.
- Bildauswahl muss Motiv klar zeigen; keine unscharfen oder unverständlichen Crops.

## 9. Finder-Funktion
Vor Freigabe müssen diese Wege funktionieren:
1. Landingpage → „Finder starten“
2. Frage 1 → 8 mit Vor/Zurück
3. Validierung bei fehlender Auswahl
4. Maximal zwei Prioritäten
5. Ergebnis berechnen
6. Ergebnis → Finder neu starten
7. Ergebnis → Startseite
8. Startseite → Finder erneut

## 10. Pflicht-DOM
Diese IDs dürfen nicht fehlen oder doppelt vorkommen:
- landing
- finder
- results
- quiz
- next
- back
- homeBtn
- resultHome
- restart
- bar
- resultList
- stepError
- priorityError

## 11. JavaScript-Prüfung
- JavaScript muss syntaktisch parsebar sein.
- Keine wörtlichen versehentlichen `\n`-Sequenzen als Code.
- Keine Referenz auf nicht vorhandene IDs.
- Ein optionaler Animationseffekt darf nie den gesamten App-Start abbrechen.
- Scroll-Start und Ansichtswechsel werden zentral gesteuert.

## 12. Accessibility-Basis
- Sichtbarer `:focus-visible`-Zustand für Buttons/Links/Inputs.
- Jede Frage semantisch als Gruppe (fieldset/legend oder gleichwertig).
- Fehlermeldungen mit `aria-live`.
- Touch-Ziele mindestens ca. 44 px hoch.
- Kontrast nicht nur optisch, sondern technisch ausreichend prüfen.
- Keine Aussage „barrierefrei“, solange kein vollständiger Test erfolgt ist.

## 13. Design-Konsistenz
- Maximal eine Display-Schriftfamilie und eine UI-Schriftfamilie.
- Einheitliche Radien, Schatten und Spacing-Stufen.
- Keine zufälligen neuen Farben außerhalb der Tokens.
- CTA-Hierarchie: genau ein primärer CTA pro Abschnitt.
- Karten nur, wenn sie Information gruppieren; keine Karten nur zur Dekoration.

## 14. Release-Check vor jedem Link
Ein Preview-Link wird erst geteilt, wenn:
- QA-Skript ohne Fehler läuft.
- Mobile Startansicht geprüft wurde.
- Finder-Flow vollständig geprüft wurde.
- Keine neuen Console-/Syntaxfehler vorhanden sind.
- Scoring-Hash unverändert ist, sofern keine Logikänderung beauftragt wurde.
- Neuer immutable Commit-Link erzeugt wurde.

## Aktueller Baseline-Stand
- 30 Produkte
- Scoring-Hash: `fnv1a-84782dc5`
- Letzter V4-Commit vor Korrekturen: `1b6cd9525c7a90cf08fd5c5a8ce5db442b7492da`

## Bekannte V4-Probleme, die V5 beheben muss
- Mobile Header zu groß und überlagert visuell das Hero.
- Keine iOS Safe-Area-Regeln.
- Browser kann alte Scrollposition wiederherstellen; Start nicht garantiert oben.
- Hero-Bild auf Mobil zu dominant/ungünstig gecroppt.
- Floating Cards konkurrieren mit Header und Bild.
- Trust-Karten auf Mobil zu lang und erzeugen unnötigen Scrollweg.
- `.reveal` versteckt Inhalte standardmäßig; bei JS-Problem verschwinden Bereiche.
- `IntersectionObserver` ohne Fallback-Guard.
- Fotocredits stören im Hero.
- Externe Unsplash-Hotlinks sind für Produktion ungeeignet.
- CSS ist durch mehrere Override-Schichten unnötig fragil.
- Fokus-Stile und erweiterte Screenreader-Semantik fehlen.
