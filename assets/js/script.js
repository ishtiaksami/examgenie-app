let questions = [];
let current = 0;
let score = 0;

const startBtn = document.getElementById("start-btn");
const questionCountSelect = document.getElementById("question-count");
const categorySelect = document.getElementById("category");

const startScreen = document.getElementById("start-screen");
const quizBox = document.getElementById("quiz-box");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");

startBtn.addEventListener("click", () => {
  const count = parseInt(questionCountSelect.value);
  const category = parseInt(categorySelect.value);
  resetQuiz();
  startScreen.classList.add("hidden");
  quizBox.classList.remove("hidden");
  fetchQuestions(count, category);
});

nextBtn.addEventListener("click", () => {
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

function resetQuiz() {
  questions = [];
  current = 0;
  score = 0;
  nextBtn.disabled = true;
  progressBar.style.width = '0%';
  resultEl.classList.add("hidden");
  quizBox.classList.remove("hidden");
}

function fetchQuestions(count, category) {
  const API_URL = `https://opentdb.com/api.php?amount=${count}&category=${category}&type=multiple`;

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      questions = data.results.map(q => {
        const options = [...q.incorrect_answers];
        const correctIndex = Math.floor(Math.random() * (options.length + 1));
        options.splice(correctIndex, 0, q.correct_answer);
        return {
          question: decodeHTML(q.question),
          options: options.map(decodeHTML),
          answer: decodeHTML(q.correct_answer)
        };
      });

      loadQuestion();
    })
    .catch(err => {
      alert("Failed to load questions. Please try again.");
      startScreen.classList.remove("hidden");
      quizBox.classList.add("hidden");
    });
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function loadQuestion() {
  const q = questions[current];
  questionEl.innerHTML = `Q${current + 1}: ${q.question}`;
  optionsEl.innerHTML = '';
  nextBtn.disabled = true;

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "option w-full bg-gray-100 text-left p-3 border rounded hover:bg-gray-200 transition";
    btn.onclick = () => selectAnswer(btn, option);
    optionsEl.appendChild(btn);
  });

  updateProgress();
}

function selectAnswer(button, selected) {
  const correct = questions[current].answer;
  const allButtons = optionsEl.querySelectorAll("button");

  allButtons.forEach(btn => {
    btn.disabled = true;
    btn.classList.remove("hover:bg-gray-200");
    if (btn.textContent === correct) {
      btn.classList.add("bg-green-200", "border-green-500");
    } else if (btn.textContent === selected) {
      btn.classList.add("bg-red-200", "border-red-500");
    }
  });

  if (selected === correct) score++;
  nextBtn.disabled = false;
}

function updateProgress() {
  const progress = (current / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function showResult() {
  quizBox.classList.add("hidden");
  resultEl.classList.remove("hidden");
  const percentage = Math.round((score / questions.length) * 100);
  let message =
    percentage >= 80
      ? "Excellent!"
      : percentage >= 50
      ? "Good job!"
      : "Keep practicing!";
  scoreEl.innerHTML = `You scored <strong>${score} out of ${questions.length}</strong> (${percentage}%)<br>${message}`;
}
