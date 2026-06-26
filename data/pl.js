window.TRAINING_DATA = window.TRAINING_DATA || {};
window.TRAINING_DATA.pl = {
  ui: {
    appName: 'Szkolenie Citronex', location: 'Siechnice', mobileReady: 'Wersja mobilna', heroTitle: 'Wybierz jezyk i rozpocznij szkolenie', heroText: 'Po zakonczeniu pokaz ekran potwierdzenia koordynatorowi.', startBtn: 'Rozpocznij szkolenie', resetBtn: 'Wyczysc zapis', phoneHint: 'Najlepiej otworzyc link w przegladarce telefonu.', progressTitle: 'Postep szkolenia', quizLabel: 'Test kontrolny', quizTitle: 'Odpowiedz na pytania', finishBtn: 'Zakoncz szkolenie', doneTitle: 'Szkolenie ukonczone', nameLabel: 'Imie i nazwisko', namePlaceholder: 'Imie i nazwisko', dateLabel: 'Data', langLabel: 'Jezyk', placeLabel: 'Lokalizacja', copyBtn: 'Kopiuj potwierdzenie', showCoordinator: 'Pokaz ten ekran koordynatorowi.', footerText: 'System informacyjno-uczacy Citronex Siechnice', answerAll: 'Odpowiedz na wszystkie pytania.', tryAgain: 'Popraw odpowiedzi i sproboj ponownie.', copied: 'Potwierdzenie skopiowane.', noName: 'brak danych', confirmHeader: 'SZKOLENIE UKONCZONE'
  },
  sections: [
    { title: 'Przyjazd i rozpoczecie pracy', items: ['Przyjdz punktualnie zgodnie z informacja od koordynatora.', 'Przed rozpoczeciem pracy czekaj w wyznaczonym miejscu.', 'Nie wchodz samodzielnie na szklarnie bez zgody brygadzisty albo koordynatora.'], notice: 'Jesli sie spoznisz, od razu poinformuj koordynatora.' },
    { title: 'Biuro i wejscia na szklarnie', items: window.getCitronexLocationItems('pl'), notice: 'Wazne: przed pierwszym dniem pracy sprawdz swoj etap i wlasciwe wejscie.' },
    { title: 'Bezpieczenstwo', items: ['Uzywaj wydanej odziezy roboczej i stosuj sie do polecen brygadzisty.', 'Nie dotykaj maszyn, narzedzi ani instalacji, jezeli nie masz zgody.', 'Kazdy wypadek, zle samopoczucie lub problem zglaszaj od razu.'] },
    { title: 'Organizacja pracy', items: ['Pracuj na miejscu, do ktorego zostales przydzielony.', 'Nie zmieniaj etapu, grupy ani stanowiska samodzielnie.', 'Problemy z praca, hotelem albo dokumentami zglaszaj koordynatorowi.'] },
    { title: 'Zasady na hotelu', items: ['Dbaj o porzadek w pokoju, kuchni i czesciach wspolnych.', 'Szanuj innych mieszkancow i nie niszcz wyposazenia.', 'Problemy techniczne zglaszaj koordynatorowi.'] }
  ],
  quiz: [
    { question: 'Co zrobic, jesli spoznisz sie do pracy?', options: ['Nic, przyjsc pozniej', 'Od razu poinformowac koordynatora', 'Poprosic kolege, zeby nic nie mowil'], correct: 1 },
    { question: 'Co trzeba sprawdzic przed pierwszym dniem pracy?', options: ['Swoj etap i wlasciwe wejscie', 'Tylko godzine wyplaty', 'Nic nie trzeba sprawdzac'], correct: 0 },
    { question: 'Czy mozna samodzielnie zmienic etap lub miejsce pracy?', options: ['Tak', 'Nie, tylko po zgodzie brygadzisty albo koordynatora', 'Tak, jezeli jest wolne miejsce'], correct: 1 },
    { question: 'Komu zglaszac problem z dokumentami, hotelem albo praca?', options: ['Koordynatorowi', 'Dowolnej osobie', 'Nie trzeba zglaszac'], correct: 0 },
    { question: 'Co zrobic po ukonczeniu szkolenia?', options: ['Zamknac telefon', 'Pokazac ekran potwierdzenia koordynatorowi', 'Usunac strone'], correct: 1 }
  ]
};
