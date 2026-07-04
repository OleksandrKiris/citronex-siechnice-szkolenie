# SYSTEM INFORMACYJNO-UCZACY CITRONEX

Mobilny system szkoleniowy dla pracownikow Citronex Siechnice.

Pracownik dostaje jeden link, otwiera go w przegladarce telefonu, wybiera jezyk i przechodzi instrukcje krok po kroku.

## Link dla pracownikow

https://oleksandrkiris.github.io/citronex-siechnice-szkolenie/

## Najwazniejsze

- Jeden link startowy: `index.html`.
- System jest podzielony na lekkie moduly: `mapa.html`, `magazyn.html`, `szklarnia.html`, `reader.html`, `lekarz.html`, `kontakty.html`, `grupy.html`, `miasto.html`, `zakazy.html`, `test.html`.
- Produkcyjne pliki aplikacji to: `assets/js/training-data.js`, `assets/js/training-app.js`, `assets/css/training.css`.
- Stare kopie plikow JS zostaja tylko jako zapas historyczny. Nie edytowac ich jako produkcji.
- Jezyk wybiera sie tylko na gorze strony.
- Jezyki: PL / EN / UA / RU / AZ / ES / FIL / ID / NE.
- System jest przygotowany pod telefony.
- Nie ma wpisywania imienia i nazwiska.
- Nie ma gotowych prosb o pomoc do kopiowania.
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
