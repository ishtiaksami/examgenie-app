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

const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
  overlay.classList.toggle("hidden");
});

overlay.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
  overlay.classList.add("hidden");
});

