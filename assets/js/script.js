let questions = [];
let current = 0;
let score = 0;

const decodeHTML = (html) => {
  return $("<textarea>").html(html).text();
};

function resetQuiz() {
  questions = [];
  current = 0;
  score = 0;
  $("#next-btn").prop("disabled", true);
  $("#progress-bar").css("width", "0%");
  $("#result").addClass("hidden");
  $("#quiz-box").removeClass("hidden");
}

function fetchQuestions(count, category) {
  const API_URL = `https://opentdb.com/api.php?amount=${count}&category=${category}&type=multiple`;

  $.getJSON(API_URL)
    .done((data) => {
      questions = data.results.map((q) => {
        const options = [...q.incorrect_answers];
        const correctIndex = Math.floor(Math.random() * (options.length + 1));
        options.splice(correctIndex, 0, q.correct_answer);
        return {
          question: decodeHTML(q.question),
          options: options.map(decodeHTML),
          answer: decodeHTML(q.correct_answer),
        };
      });

      loadQuestion();
    })
    .fail(() => {
      alert("Failed to load questions. Please try again.");
      $("#start-screen").removeClass("hidden");
      $("#quiz-box").addClass("hidden");
    });
}

function loadQuestion() {
  const q = questions[current];
  $("#question").html(`Q${current + 1}: ${q.question}`);
  $("#options").empty();
  $("#next-btn").prop("disabled", true);

  q.options.forEach((option) => {
    const $btn = $("<button>")
      .text(option)
      .addClass("option w-full bg-gray-100 text-left p-3 border rounded hover:bg-gray-200 transition")
      .on("click", function () {
        selectAnswer($(this), option);
      });

    $("#options").append($btn);
  });

  updateProgress();
}

function selectAnswer($button, selected) {
  const correct = questions[current].answer;
  const $allButtons = $("#options button");

  $allButtons.each(function () {
    $(this).prop("disabled", true).removeClass("hover:bg-gray-200");
    if ($(this).text() === correct) {
      $(this).addClass("bg-green-200 border-green-500");
    } else if ($(this).text() === selected) {
      $(this).addClass("bg-red-200 border-red-500");
    }
  });

  if (selected === correct) score++;
  $("#next-btn").prop("disabled", false);
}

function updateProgress() {
  const progress = (current / questions.length) * 100;
  $("#progress-bar").css("width", `${progress}%`);
}

function showResult() {
  $("#quiz-box").addClass("hidden");
  $("#result").removeClass("hidden");
  const percentage = Math.round((score / questions.length) * 100);
  let message =
    percentage >= 80
      ? "Excellent!"
      : percentage >= 50
      ? "Good job!"
      : "Keep practicing!";
  $("#score").html(
    `You scored <strong>${score} out of ${questions.length}</strong> (${percentage}%)<br>${message}`
  );
}

// Event listeners
$("#start-btn").on("click", function () {
  const count = parseInt($("#question-count").val());
  const category = parseInt($("#category").val());
  resetQuiz();
  $("#start-screen").addClass("hidden");
  $("#quiz-box").removeClass("hidden");
  fetchQuestions(count, category);
});

$("#next-btn").on("click", function () {
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});


// live dashboard result


    function loadDashboardData() {
      const results = JSON.parse(localStorage.getItem("quizResults")) || [];

      if (results.length === 0) {
        document.getElementById("total-quizzes").textContent = "0";
        document.getElementById("avg-score").textContent = "0%";
        document.getElementById("best-subject").textContent = "N/A";
        document.getElementById("subject-performance").innerHTML = `<p class="text-gray-500 col-span-full">No quiz data available.</p>`;
        return;
      }

      const totalQuizzes = results.length;
      const avgScore = (results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes).toFixed(1);

      const subjectScores = {};
      results.forEach(r => {
        if (!subjectScores[r.subject]) subjectScores[r.subject] = [];
        subjectScores[r.subject].push(r.percentage);
      });

      let bestSubject = "N/A", bestAvg = 0;
      for (const [subject, scores] of Object.entries(subjectScores)) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        if (avg > bestAvg) {
          bestAvg = avg;
          bestSubject = subject;
        }
      }

      document.getElementById("total-quizzes").textContent = totalQuizzes;
      document.getElementById("avg-score").textContent = `${avgScore}%`;
      document.getElementById("best-subject").textContent = bestSubject;

      const container = document.getElementById("subject-performance");
      container.innerHTML = "";
      for (const [subject, scores] of Object.entries(subjectScores)) {
        const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
        const barColor = avg >= 80 ? "bg-green-500" : avg >= 50 ? "bg-yellow-400" : "bg-red-400";
        container.innerHTML += `
          <div class="bg-white rounded-lg shadow p-5">
            <p class="font-semibold text-gray-700 mb-2">${subject}</p>
            <div class="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
              <div class="${barColor} h-3 rounded-full" style="width: ${avg}%;"></div>
            </div>
            <p class="text-sm text-gray-500">${avg}% average score</p>
          </div>
        `;
      }
    }

    loadDashboardData();

  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menu-btn');
  const overlay = document.getElementById('overlay');

  function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'pointer-events-auto');
  }

  function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay.classList.remove('opacity-100', 'pointer-events-auto');
  }

  menuBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('-translate-x-full')) {
      openSidebar();
    } else {
      closeSidebar();
    }
  });

  overlay.addEventListener('click', closeSidebar);

  // Optional: Close sidebar on window resize if width >= 768px (md breakpoint)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.add('opacity-0', 'pointer-events-none');
      overlay.classList.remove('opacity-100', 'pointer-events-auto');
    } else {
      sidebar.classList.add('-translate-x-full');
    }
  });


