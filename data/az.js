window.TRAINING_DATA = window.TRAINING_DATA || {};
window.TRAINING_DATA.az = {
  ui: {
    appName: 'Citronex Təlimi', location: 'Siechnice', mobileReady: 'Mobil versiya', heroTitle: 'Dili seçin və təlimə başlayın', heroText: 'Bitirdikdən sonra təsdiq ekranını koordinatora göstərin.', startBtn: 'Təlimə başla', resetBtn: 'Yaddaşı təmizlə', phoneHint: 'Linki telefon brauzerində açmaq daha yaxşıdır.', progressTitle: 'Təlimin gedişi', quizLabel: 'Yoxlama testi', quizTitle: 'Suallara cavab verin', finishBtn: 'Təlimi bitir', doneTitle: 'Təlim tamamlandı', nameLabel: 'Ad və soyad', namePlaceholder: 'Ad və soyad', dateLabel: 'Tarix', langLabel: 'Dil', placeLabel: 'Lokasiya', copyBtn: 'Təsdiqi kopyala', showCoordinator: 'Bu ekranı koordinatora göstərin.', footerText: 'Citronex Siechnice məlumat və təlim sistemi', answerAll: 'Bütün suallara cavab verin.', tryAgain: 'Cavabları düzəldin və yenidən cəhd edin.', copied: 'Təsdiq kopyalandı.', noName: 'məlumat yoxdur', confirmHeader: 'TƏLİM TAMAMLANDI'
  },
  sections: [
    { title: 'Gəliş və işə başlama', items: ['Koordinatordan verilən məlumata uyğun vaxtında gəlin.', 'İş başlamazdan əvvəl göstərilən yerdə gözləyin.', 'Briqadir və ya koordinatorun icazəsi olmadan istixanaya tək daxil olmayın.'], notice: 'Gecikirsinizsə, dərhal koordinatora məlumat verin.' },
    { title: 'Ofis və istixana girişləri', items: window.getCitronexLocationItems('az'), notice: 'Vacibdir: ilk iş günündən əvvəl etapınızı və düzgün girişi yoxlayın.' },
    { title: 'Təhlükəsizlik', items: ['Verilən iş geyimindən istifadə edin və briqadirin göstərişlərinə əməl edin.', 'İcazə olmadan maşınlara, alətlərə və qurğulara toxunmayın.', 'Qəza, pis hiss etmə və ya problem olduqda dərhal məlumat verin.'] },
    { title: 'İşin təşkili', items: ['Sizə təyin olunan yerdə işləyin.', 'Etapı, qrupu və ya iş yerini özbaşına dəyişməyin.', 'İş, hotel və ya sənəd problemi barədə koordinatora məlumat verin.'] },
    { title: 'Hotel qaydaları', items: ['Otaqda, mətbəxdə və ümumi yerlərdə təmizliyə riayət edin.', 'Digər sakinlərə hörmət edin və avadanlığı korlamayın.', 'Texniki problemləri koordinatora bildirin.'] }
  ],
  quiz: [
    { question: 'İşə gecikirsinizsə nə etməlisiniz?', options: ['Heç nə, sonra gəlmək', 'Dərhal koordinatora məlumat vermək', 'Dostdan heç nə deməməsini xahiş etmək'], correct: 1 },
    { question: 'İlk iş günündən əvvəl nəyi yoxlamaq lazımdır?', options: ['Etapınızı və düzgün girişi', 'Yalnız maaş vaxtını', 'Heç nə yoxlamaq lazım deyil'], correct: 0 },
    { question: 'Etapı və ya iş yerini özbaşına dəyişmək olar?', options: ['Bəli', 'Xeyr, yalnız briqadir və ya koordinatorun razılığı ilə', 'Bəli, boş yer varsa'], correct: 1 },
    { question: 'Sənəd, hotel və ya iş problemi kimə bildirilməlidir?', options: ['Koordinatora', 'İstənilən adama', 'Bildirmək lazım deyil'], correct: 0 },
    { question: 'Təlimi bitirdikdən sonra nə etmək lazımdır?', options: ['Telefonu bağlamaq', 'Təsdiq ekranını koordinatora göstərmək', 'Səhifəni silmək'], correct: 1 }
  ]
};
