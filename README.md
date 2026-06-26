# SYSTEM INFORMACYJNO-UCZACY CITRONEX

Mobilny system szkoleniowy dla pracownikow Citronex Siechnice.

Pracownik dostaje jeden link, wybiera jezyk, przechodzi szkolenie, odpowiada na krotki test i pokazuje koordynatorowi ekran potwierdzenia.

## Link glowny

https://oleksandrkiris.github.io/citronex-siechnice-szkolenie/

## Publikacja

Projekt dziala jako statyczna strona na GitHub Pages.
Publikacja powinna byc ustawiona w GitHub jako:

Settings -> Pages -> Deploy from a branch -> `main` -> `/root` -> Save

Workflow `.github/workflows/pages.yml` zostal wylaczony dla pushy, bo poprzedni tryb `actions/deploy-pages` powodowal serie bledow `Failed to deploy to github-pages`.

## Struktura plikow

```text
index.html              - glowna strona dla pracownika
style.css               - wyglad strony i wersja mobilna
stage-location.css      - wyglad modulu wyboru etapu
app.js                  - logika szkolenia, testu, localStorage i kopiowania
stage-location.js       - logika wyboru etapu i map
data/locations.js       - linki do biura i wejsc E1-E6
data/pl.js              - tresci po polsku
data/ua.js              - tresci po ukrainsku
data/ru.js              - tresci po rosyjsku
data/en.js              - tresci po angielsku
data/az.js              - tresci po azersku
wersje/                 - archiwum poprzednich wersji
.nojekyll               - plik techniczny dla GitHub Pages
JAK_AKTUALIZOWAC.txt    - instrukcja administratora
```

## Funkcje

- wybor jezyka: PL / UA / RU / EN / AZ
- modul `Moja lokalizacja / Moj etap`
- wybor Office albo Etap 1-6
- przycisk mapy dla wybranego etapu
- szkolenie podzielone na czytelne karty
- test kontrolny na koncu
- ekran: `Szkolenie ukonczone`
- pole na imie i nazwisko
- automatyczna data ukonczenia
- etap na ekranie potwierdzenia
- przycisk `Kopiuj potwierdzenie`
- zapis lokalny w telefonie przez `localStorage`
- brak backendu i brak wysylania danych na zewnatrz

## Aktualizacja tresci

1. Edytuj odpowiedni plik w folderze `data`, np. `data/ua.js`.
2. Przed wieksza zmiana zrob kopie aktualnej wersji w folderze `wersje`, np. `wersje/2026-07-01.html`.
3. Wgraj zmiany do galezi `main`.
4. Sprawdz zakladke Settings -> Pages.
5. Otworz link glowny na telefonie i sprawdz:
   - czy strona sie otwiera,
   - czy dziala wybor jezyka,
   - czy dziala wybor etapu,
   - czy dziala przycisk mapy,
   - czy dziala test,
   - czy dziala kopiowanie potwierdzenia.

## Testowanie lokalne

Mozna otworzyc `index.html` bezposrednio w przegladarce albo uruchomic prosty serwer lokalny:

```bash
python -m http.server 8000
```

Potem wejsc na:

```text
http://localhost:8000
```

## Link dla pracownikow

Wysylamy zawsze:

https://oleksandrkiris.github.io/citronex-siechnice-szkolenie/
