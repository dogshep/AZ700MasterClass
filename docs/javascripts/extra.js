document.addEventListener('DOMContentLoaded', () => {
  const searchBox = document.querySelector('.md-search__input');
  if (searchBox) {
    searchBox.setAttribute('placeholder', 'Search lessons, labs, and tips');
  }

  const noteToggles = document.querySelectorAll('.collapsible-note');
  noteToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
    });
  });

  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.setAttribute('data-index', index + 1);
  });

  updateProgress();
  initializeFlashcards();
  initializeQuizzes();
});

function updateProgress() {
  const visits = Number(localStorage.getItem('az700-visits') || 0) + 1;
  localStorage.setItem('az700-visits', String(visits));
  const percent = Math.min(100, Math.round(visits * 5));
  localStorage.setItem('az700-progress', String(percent));

  const milestone = document.querySelector('[data-progress]');
  if (milestone) {
    milestone.textContent = `${percent}% complete`;
  }
}

function initializeFlashcards() {
  const container = document.getElementById('flashcard-viewer');
  if (!container || typeof FLASHCARDS === 'undefined') {
    return;
  }

  const toolbar = container.previousElementSibling;
  const bookmarks = new Set(JSON.parse(localStorage.getItem('az700-bookmarks') || '[]'));
  let cards = [...FLASHCARDS];
  let index = 0;
  let showAnswer = false;
  let difficulty = 'all';

  function getVisibleCards() {
    return cards.filter((card) => difficulty === 'all' || card.difficulty === difficulty);
  }

  function render() {
    const visible = getVisibleCards();
    if (!visible.length) {
      container.innerHTML = '<p class="empty-state">No cards match the selected difficulty.</p>';
      return;
    }

    if (index >= visible.length) {
      index = 0;
    }

    const card = visible[index];
    const bookmarked = bookmarks.has(card.id);
    container.innerHTML = `
      <div class="flashcard-card" data-card-id="${card.id}">
        <div class="flashcard-meta">
          <span>${card.category}</span>
          <span>${card.difficulty}</span>
        </div>
        <div class="flashcard-body">
          <h3>${showAnswer ? card.definition : card.term}</h3>
          <p>${showAnswer ? 'Tap to return to the prompt.' : 'Tap to reveal the explanation.'}</p>
        </div>
        <div class="flashcard-actions">
          <button type="button" class="secondary" data-action="prev">Previous</button>
          <button type="button" class="secondary" data-action="bookmark">${bookmarked ? '★ Saved' : '☆ Save'}</button>
          <button type="button" class="secondary" data-action="next">Next</button>
        </div>
      </div>
    `;
  }

  function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    index = 0;
    showAnswer = false;
    render();
  }

  function setDifficulty(value) {
    difficulty = value;
    index = 0;
    showAnswer = false;
    render();
  }

  container.addEventListener('click', (event) => {
    const action = event.target.getAttribute('data-action');
    if (action === 'next') {
      index += 1;
      showAnswer = false;
      render();
      return;
    }
    if (action === 'prev') {
      index = Math.max(0, index - 1);
      showAnswer = false;
      render();
      return;
    }
    if (action === 'bookmark') {
      const visible = getVisibleCards();
      const card = visible[index];
      if (!card) {
        return;
      }
      if (bookmarks.has(card.id)) {
        bookmarks.delete(card.id);
      } else {
        bookmarks.add(card.id);
      }
      localStorage.setItem('az700-bookmarks', JSON.stringify([...bookmarks]));
      render();
      return;
    }

    const cardElement = event.target.closest('.flashcard-card');
    if (cardElement) {
      showAnswer = !showAnswer;
      render();
    }
  });

  if (toolbar) {
    toolbar.querySelector('#shuffle-cards')?.addEventListener('click', shuffleCards);
    toolbar.querySelector('#bookmark-toggle')?.addEventListener('click', () => {
      const visible = getVisibleCards();
      const card = visible[index];
      if (card) {
        if (bookmarks.has(card.id)) {
          bookmarks.delete(card.id);
        } else {
          bookmarks.add(card.id);
        }
        localStorage.setItem('az700-bookmarks', JSON.stringify([...bookmarks]));
        render();
      }
    });
    toolbar.querySelector('#difficulty-filter')?.addEventListener('change', (event) => {
      setDifficulty(event.target.value);
    });
    toolbar.querySelector('#random-card')?.addEventListener('click', () => {
      const visible = getVisibleCards();
      index = Math.floor(Math.random() * visible.length);
      showAnswer = false;
      render();
    });
  }

  render();
}

function initializeQuizzes() {
  const quizShells = document.querySelectorAll('.quiz-shell');
  if (!quizShells.length || typeof EXAMS === 'undefined') {
    return;
  }

  quizShells.forEach((shell) => {
    const examId = shell.getAttribute('data-exam');
    const exam = EXAMS.find((entry) => entry.exam === examId);
    if (!exam) {
      return;
    }

    const questions = exam.questions.map((entry) => ({ ...entry }));
    let current = 0;
    let score = 0;
    let startTime = Date.now();
    let randomize = false;
    let answered = [];
    let timerId = null;

    function getQuestionSet() {
      return randomize ? [...questions].sort(() => Math.random() - 0.5) : questions;
    }

    function render() {
      const activeQuestions = getQuestionSet();
      const question = activeQuestions[current];
      if (!question) {
        finish();
        return;
      }

      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 1800 - elapsed);
      shell.innerHTML = `
        <div class="quiz-panel">
          <div class="quiz-meta">
            <strong>${examId.toUpperCase()}</strong>
            <span>${current + 1}/${activeQuestions.length}</span>
            <span>${remaining}s remaining</span>
          </div>
          <h3>${question.prompt}</h3>
          <div class="quiz-options">
            ${question.options.map((option, index) => `<button class="quiz-option" data-index="${index}">${option}</button>`).join('')}
          </div>
          <div class="quiz-actions">
            <button type="button" class="secondary" data-action="restart">Restart</button>
            <button type="button" class="secondary" data-action="random">${randomize ? 'Random on' : 'Random off'}</button>
            <button type="button" class="secondary" data-action="review">Review incorrect</button>
          </div>
        </div>
      `;

      const optionButtons = shell.querySelectorAll('.quiz-option');
      optionButtons.forEach((button) => {
        button.addEventListener('click', () => {
          handleAnswer(parseInt(button.getAttribute('data-index'), 10), activeQuestions);
        });
      });
    }

    function handleAnswer(selectedIndex, activeQuestions) {
      const question = activeQuestions[current];
      if (!question) {
        return;
      }
      const correct = selectedIndex === question.correct;
      if (correct) {
        score += 1;
      }
      answered.push({ ...question, selectedIndex, correct });
      current += 1;
      if (current >= activeQuestions.length) {
        finish();
      } else {
        render();
      }
    }

    function finish() {
      clearInterval(timerId);
      const incorrect = answered.filter((entry) => !entry.correct);
      const weakDomains = incorrect.reduce((accumulator, entry) => {
        accumulator[entry.domain] = (accumulator[entry.domain] || 0) + 1;
        return accumulator;
      }, {});
      const recommendation = Object.entries(weakDomains).sort((left, right) => right[1] - left[1])[0];

      shell.innerHTML = `
        <div class="quiz-panel">
          <h3>Practice complete</h3>
          <p>Score: ${score}/${answered.length}</p>
          <p>Incorrect answers: ${incorrect.length}</p>
          <p>Weakest domain: ${recommendation ? recommendation[0] : 'Review the full deck'}</p>
          <div class="quiz-actions">
            <button type="button" class="secondary" data-action="restart">Restart</button>
            <button type="button" class="secondary" data-action="review">Review incorrect</button>
          </div>
          <div class="quiz-review">
            ${incorrect.length ? incorrect.map((entry) => `<div class="review-item"><strong>${entry.prompt}</strong><p>${entry.explanation}</p></div>`).join('') : '<p>Excellent work. Every answer was correct.</p>'}
          </div>
        </div>
      `;

      shell.querySelector('[data-action="restart"]')?.addEventListener('click', start);
      shell.querySelector('[data-action="review"]')?.addEventListener('click', () => {
        shell.innerHTML = `
          <div class="quiz-panel">
            <h3>Incorrect answers</h3>
            <div class="quiz-review">
              ${incorrect.length ? incorrect.map((entry) => `<div class="review-item"><strong>${entry.prompt}</strong><p>${entry.explanation}</p></div>`).join('') : '<p>No incorrect answers to review.</p>'}
            </div>
          </div>
        `;
      });
    }

    function start() {
      current = 0;
      score = 0;
      answered = [];
      startTime = Date.now();
      clearInterval(timerId);
      timerId = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        if (elapsed >= 1800) {
          finish();
        }
      }, 1000);
      render();
    }

    shell.addEventListener('click', (event) => {
      const action = event.target.getAttribute('data-action');
      if (action === 'restart') {
        start();
      } else if (action === 'random') {
        randomize = !randomize;
        start();
      } else if (action === 'review') {
        const incorrect = answered.filter((entry) => !entry.correct);
        shell.innerHTML = `
          <div class="quiz-panel">
            <h3>Incorrect answers</h3>
            <div class="quiz-review">
              ${incorrect.length ? incorrect.map((entry) => `<div class="review-item"><strong>${entry.prompt}</strong><p>${entry.explanation}</p></div>`).join('') : '<p>No incorrect answers to review.</p>'}
            </div>
          </div>
        `;
      }
    });

    start();
  });
}
