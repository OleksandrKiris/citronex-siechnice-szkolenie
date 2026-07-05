# SYSTEM INFORMACYJNO-UCZACY CITRONEX

Mobilny system szkoleniowy dla pracownikow Citronex Siechnice.

Pracownik dostaje jeden link, otwiera go w przegladarce telefonu, wybiera jezyk i przechodzi instrukcje krok po kroku.

## Link dla pracownikow

https://oleksandrkiris.github.io/citronex-siechnice-szkolenie/

## Najwazniejsze

- Jeden link startowy: `index.html`.
- System jest podzielony na lekkie moduly: `mapa.html`, `magazyn.html`, `tablet.html`, `szklarnia.html`, `reader.html`, `lekarz.html`, `kontakty.html`, `grupy.html`, `miasto.html`, `mowa.html`, `slownik.html`, `zakazy.html`, `test.html`.
- Produkcyjne pliki aplikacji to: `assets/js/training-data.js`, `assets/js/training-app.js`, `assets/css/training.css`.
- Stare kopie plikow JS zostaja tylko jako zapas historyczny. Nie edytowac ich jako produkcji.
- Jezyk wybiera sie tylko na gorze strony.
- Gorny pasek ma tylko szybkie przyciski: Start, mapa, kontakt i lekarz.
- Jezyki: PL / EN / UA / RU / AZ / ES / FIL / ID / NE.
- System jest przygotowany pod telefony.
- Nie ma wpisywania imienia i nazwiska.
- Jest modul `Powiedz po polsku`: pracownik wybiera zdanie w swoim jezyku, a telefon mowi je po polsku.
- Mapy i wejscia sa na poczatku szkolenia.
- Magazyn / sortownia nie ma readerow.
- Reader, rzed, przerwa, wozek i restart sa opisane wedlug instrukcji.
- Jest instrukcja dodania linku do ekranu telefonu.

## Publikacja

Publiczna strona dziala z GitHub Pages:

https://oleksandrkiris.github.io/citronex-siechnice-szkolenie/

Aktualna produkcja zaczyna sie w `index.html`, a tresc jest podzielona na osobne pliki modulow.
Archiwum wersji jest w folderze `wersje`.

## Szybki test po zmianie

- Strona otwiera sie na telefonie.
- Nie ma poziomego przewijania.
- Przyciski jezykow dzialaja.
- Mapy otwieraja sie poprawnie.
- Reader nie pokazuje sie jako procedura magazynu.
- Test dziala.
- Zdjecia sa widoczne.

## Audyt techniczny

Po wiekszej zmianie uruchom:

```bash
node tools/audit-project.js
```

Skrypt sprawdza brakujace tlumaczenia, brakujace zdjecia i czy strony HTML uzywaja produkcyjnych plikow JS.

## Audyt linkow map

Pelna lista linkow map:

```bash
node tools/audit-map-links.js
```

Tylko problemy i ostrzezenia:

```bash
node tools/audit-map-links.js --only-problems
```

`Errors` trzeba poprawic od razu. `Warnings` oznacza link typu wyszukiwanie po nazwie/adresie - dziala, ale najlepiej zamienic go na staly link `maps.app.goo.gl` albo konkretne miejsce w Google Maps.

Krytyczne linki sa zapisane w:

```text
data/critical-links.json
```

Audyt sprawdza, czy te adresy nadal wystepuja w aktywnych danych szkolenia.

## Audyt przyciskow i linkow

```bash
node tools/audit-buttons.js
```

Skrypt sprawdza, czy kafelki maja swoje pliki HTML, czy linki nie sa puste, czy nie prowadza do `#`, czy pliki CSS/JS/manifest istnieja i czy numery telefonu maja poprawna dlugosc.
