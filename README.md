# SYSTEM INFORMACYJNO-UCZACY CITRONEX

Mobilny system szkoleniowy dla pracownikow Citronex Siechnice.

Pracownik dostaje jeden link, wybiera jezyk, przechodzi szkolenie, odpowiada na krotki test i pokazuje koordynatorowi ekran potwierdzenia.

## Link glowny

https://oleksandrkiris.github.io/citronex-siechnice-szkolenie/

## Publikacja

Projekt dziala jako statyczna strona na GitHub Pages.
Publikacja jest wykonywana przez GitHub Actions z galezi `main`.

Workflow:

`.github/workflows/pages.yml`

## Struktura plikow

```text
index.html              - glowna strona dla pracownika
style.css               - wyglad strony i wersja mobilna
app.js                  - logika szkolenia, testu, localStorage i kopiowania
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
- szkolenie podzielone na czytelne karty
- test kontrolny na koncu
- ekran: `Szkolenie ukonczone`
- pole na imie i nazwisko
- automatyczna data ukonczenia
- przycisk `Kopiuj potwierdzenie`
- zapis lokalny w telefonie przez `localStorage`
- brak backendu i brak wysylania danych na zewnatrz

## Aktualizacja tresci

1. Edytuj odpowiedni plik w folderze `data`, np. `data/ua.js`.
2. Przed wieksza zmiana zrob kopie aktualnej wersji w folderze `wersje`, np. `wersje/2026-07-01.html`.
3. Wgraj zmiany do galezi `main`.
4. Poczekaj na zakonczenie GitHub Actions.
5. Otworz link glowny na telefonie i sprawdz:
   - czy strona sie otwiera,
   - czy dziala wybor jezyka,
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
