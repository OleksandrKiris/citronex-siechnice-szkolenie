window.TRAINING_DATA = window.TRAINING_DATA || {};
window.TRAINING_DATA.en = {
  ui: {
    appName: 'Citronex Training', location: 'Siechnice', mobileReady: 'Mobile version', heroTitle: 'Choose a language and start the training', heroText: 'After finishing, show the confirmation screen to the coordinator.', startBtn: 'Start training', resetBtn: 'Clear saved data', phoneHint: 'It is best to open the link in your phone browser.', progressTitle: 'Training progress', quizLabel: 'Control test', quizTitle: 'Answer the questions', finishBtn: 'Finish training', doneTitle: 'Training completed', nameLabel: 'Full name', namePlaceholder: 'Full name', dateLabel: 'Date', langLabel: 'Language', placeLabel: 'Location', copyBtn: 'Copy confirmation', showCoordinator: 'Show this screen to the coordinator.', footerText: 'Citronex Siechnice information and training system', answerAll: 'Answer all questions.', tryAgain: 'Correct the answers and try again.', copied: 'Confirmation copied.', noName: 'no data', confirmHeader: 'TRAINING COMPLETED'
  },
  sections: [
    { title: 'Arrival and work start', items: ['Come on time according to the coordinator’s information.', 'Before work starts, wait in the assigned place.', 'Do not enter the greenhouse on your own without approval from the team leader or coordinator.'], notice: 'If you are late, inform the coordinator immediately.' },
    { title: 'Office and greenhouse entrances', items: window.getCitronexLocationItems('en'), notice: 'Important: before the first working day, check your stage and the correct entrance.' },
    { title: 'Safety', items: ['Use the provided work clothes and follow the team leader’s instructions.', 'Do not touch machines, tools or installations without permission.', 'Report any accident, bad condition or problem immediately.'] },
    { title: 'Work organization', items: ['Work in the place where you were assigned.', 'Do not change stage, group or workplace on your own.', 'Report problems with work, hotel or documents to the coordinator.'] },
    { title: 'Hotel rules', items: ['Keep order in the room, kitchen and common areas.', 'Respect other residents and do not damage equipment.', 'Report technical problems to the coordinator.'] }
  ],
  quiz: [
    { question: 'What should you do if you are late for work?', options: ['Nothing, come later', 'Inform the coordinator immediately', 'Ask a colleague not to say anything'], correct: 1 },
    { question: 'What should you check before the first working day?', options: ['Your stage and the correct entrance', 'Only the payment time', 'Nothing needs to be checked'], correct: 0 },
    { question: 'Can you change your stage or workplace on your own?', options: ['Yes', 'No, only after approval from the team leader or coordinator', 'Yes, if there is a free place'], correct: 1 },
    { question: 'Who should you report problems with documents, hotel or work to?', options: ['The coordinator', 'Any person', 'No need to report'], correct: 0 },
    { question: 'What should you do after completing the training?', options: ['Close the phone', 'Show the confirmation screen to the coordinator', 'Delete the page'], correct: 1 }
  ]
};
