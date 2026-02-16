
(function () {
  // ----- QUIZ DATA (extendable) -----
  const questions = [
    {
      question: "1. What is the full form of HTML?",
      options: ["Hypertext Markup Language", "Hyertext Markup Language", "Hypertext Mrkup Language", "Hypertext Markup Languages"],
      correct: 0,
      category: "HTML"
    },
    {
      question: "2. Which tag is used for the largest heading?",
      options: ["&lt;h1&gt;", "&lt;heading&gt;", "&lt;h6&gt;", "&lt;head&gt;"],
      correct: 0,
      category: "HTML"
    },
    {
      question: "3. What does CSS stand for?",
      options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"],
      correct: 0,
      category: "CSS"
    },
    {
      question: "4. Which property is used to change text color in CSS?",
      options: ["color", "text-color", "font-color", "background-color"],
      correct: 0,
      category: "CSS"
    },
    {
      question: "5. JavaScript is a _______ language.",
      options: ["scripting", "compiled", "markup", "styling"],
      correct: 0,
      category: "JavaScript"
    }
  ];

  // ----- STATE (saved in localStorage) -----
  let currentIndex = 0;
  // answers: array of selected option indices (null = not answered)
  let userAnswers = new Array(questions.length).fill(null);
  // stats
  let totalAttempts = 0;      // number of answered questions (any answer)
  let correctCount = 0;       // number of correct answers

  // load from localStorage if exists
  function loadState() {
    const saved = localStorage.getItem('quizmaster_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.userAnswers && data.userAnswers.length === questions.length) {
          userAnswers = data.userAnswers;
        }
        if (data.totalAttempts !== undefined) totalAttempts = data.totalAttempts;
        if (data.correctCount !== undefined) correctCount = data.correctCount;
        // currentIndex could be saved optionally, but we start at 0
      } catch (e) { }
    }
    // ensure arrays length
    if (userAnswers.length !== questions.length) userAnswers = new Array(questions.length).fill(null);
    recalcStatsFromAnswers(); // recalc correctCount based on answers (in case of mismatch)
  }

  // recalc correct count from userAnswers
  function recalcStatsFromAnswers() {
    correctCount = 0;
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] !== null && userAnswers[i] === questions[i].correct) {
        correctCount++;
      }
    }
    // totalAttempts = number of non-null answers
    totalAttempts = userAnswers.filter(a => a !== null).length;
  }

  // save to localStorage
  function saveState() {
    const data = {
      userAnswers: userAnswers,
      totalAttempts: totalAttempts,
      correctCount: correctCount
    };
    localStorage.setItem('quizmaster_progress', JSON.stringify(data));
  }

  // reset all progress
  function resetProgress() {
    if (confirm('Reset all your answers and stats?')) {
      userAnswers = new Array(questions.length).fill(null);
      totalAttempts = 0;
      correctCount = 0;
      saveState();
      renderQuestion();
      updateStatsAndProgress();
    }
  }

  // ----- DOM elements -----
  const questionEl = document.getElementById('questionText');
  const categoryEl = document.getElementById('categoryTag');
  const answersContainer = document.getElementById('answersContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const resetBtn = document.getElementById('resetBtn');
  const attemptSpan = document.getElementById('attemptCount');
  const correctSpan = document.getElementById('correctCount');
  const scoreSpan = document.getElementById('scorePercent');
  const progressFill = document.getElementById('progressFill');
  const counterSpan = document.getElementById('questionCounter');

  // modal elements
  const modal = document.getElementById('resultModal');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const modalClose = document.getElementById('modalCloseBtn');

  // theme
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const body = document.body;

  // init theme
  const savedTheme = localStorage.getItem('quizmaster_theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.className = 'fas fa-sun';
  } else {
    themeIcon.className = 'fas fa-moon';
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('quizmaster_theme', isDark ? 'dark' : 'light');
  });

  // ----- render question based on currentIndex -----
  function renderQuestion() {
    const q = questions[currentIndex];
    questionEl.innerHTML = q.question;
    categoryEl.textContent = q.category;

    // build answer buttons
    let htmlStr = '';
    q.options.forEach((opt, idx) => {
      const isSelected = (userAnswers[currentIndex] === idx);
      let additionalClass = '';
      if (isSelected) {
        additionalClass = (idx === q.correct) ? 'correct-option' : 'wrong-option';
      }
      htmlStr += `
            <button class="answer-btn ${additionalClass}" data-opt-index="${idx}">
              <i class="fas fa-${idx === 0 ? 'a' : idx === 1 ? 'b' : idx === 2 ? 'c' : 'd'}"></i>
              <span>${opt}</span>
            </button>
          `;
    });
    answersContainer.innerHTML = htmlStr;

    // attach listeners
    document.querySelectorAll('.answer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const chosenIdx = parseInt(btn.dataset.optIndex, 10);
        handleAnswer(chosenIdx);
      });
    });

    // update counter
    counterSpan.textContent = `${currentIndex + 1}/${questions.length}`;
    // update progress fill based on answered count
    const answeredCount = userAnswers.filter(a => a !== null).length;
    const percent = (answeredCount / questions.length) * 100;
    progressFill.style.width = percent + '%';
  }

  // ----- answer handler (shows modal, saves) -----
  function handleAnswer(chosenIdx) {
    // if already answered, do nothing (optional: you can allow change, but we'll allow update)
    const q = questions[currentIndex];
    const isCorrect = (chosenIdx === q.correct);

    // update userAnswers
    const previousAnswer = userAnswers[currentIndex];
    userAnswers[currentIndex] = chosenIdx;

    // recalc stats (simple but robust)
    recalcStatsFromAnswers();
    saveState();

    // show modal
    if (isCorrect) {
      modalIcon.innerHTML = '✅';
      modalTitle.textContent = 'Correct!';
      modalMessage.textContent = 'Well done, keep going!';
    } else {
      modalIcon.innerHTML = '❌';
      modalTitle.textContent = 'Wrong';
      modalMessage.textContent = `The correct answer is: ${q.options[q.correct]}`;
    }
    modal.style.display = 'flex';

    // re-render question to show correct/wrong style
    renderQuestion();
    updateStatsAndProgress();
  }

  // close modal
  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // update stats numbers
  function updateStatsAndProgress() {
    attemptSpan.textContent = totalAttempts;
    correctSpan.textContent = correctCount;
    const percent = totalAttempts ? Math.round((correctCount / totalAttempts) * 100) : 0;
    scoreSpan.textContent = percent + '%';

    const answeredCount = userAnswers.filter(a => a !== null).length;
    progressFill.style.width = (answeredCount / questions.length) * 100 + '%';
  }

  // navigation
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });
  nextBtn.addEventListener('click', () => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    }
  });

  resetBtn.addEventListener('click', resetProgress);

  // initial load
  loadState();
  renderQuestion();
  updateStatsAndProgress();

  // keyboard shortcuts (optional)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
})();
