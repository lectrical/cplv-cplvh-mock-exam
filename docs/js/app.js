import { getQuestionBank } from "../questions/index.js";

let track = "cplv";
let mode = "mock30";
let activeQuestions = [];
let currentIndex = 0;
let score = 0;
let catStats = {};

// Tab Switching
const tabStudy = document.getElementById("tab-study");
const tabExam = document.getElementById("tab-exam");
const panelStudy = document.getElementById("panel-study");
const panelExam = document.getElementById("panel-exam");

tabStudy.addEventListener("click", () => {
  tabStudy.classList.add("active");
  tabExam.classList.remove("active");
  panelStudy.classList.remove("hidden");
  panelExam.classList.add("hidden");
});

tabExam.addEventListener("click", () => {
  tabExam.classList.add("active");
  tabStudy.classList.remove("active");
  panelExam.classList.remove("hidden");
  panelStudy.classList.add("hidden");
});

// Track & Mode Controls
document.getElementById("btn-cplv").addEventListener("click", () => setTrack("cplv"));
document.getElementById("btn-cplvh").addEventListener("click", () => setTrack("cplvh"));
document.getElementById("btn-mock30").addEventListener("click", () => setMode("mock30"));
document.getElementById("btn-full75").addEventListener("click", () => setMode("full75"));
document.getElementById("restart-btn").addEventListener("click", startQuiz);
document.getElementById("retry-btn").addEventListener("click", startQuiz);
document.getElementById("next-btn").addEventListener("click", nextQuestion);

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function setTrack(newTrack) {
  track = newTrack;
  const isHealth = track === "cplvh";
  document.getElementById("btn-cplv").className = `toggle-btn ${!isHealth ? "active" : ""}`;
  document.getElementById("btn-cplvh").className = `toggle-btn ${isHealth ? "active-health" : ""}`;
  startQuiz();
}

function setMode(newMode) {
  mode = newMode;
  document.getElementById("btn-mock30").classList.toggle("active", mode === "mock30");
  document.getElementById("btn-full75").classList.toggle("active", mode === "full75");
  startQuiz();
}

function startQuiz() {
  const bank = getQuestionBank(track);
  const shuffled = shuffle(bank);
  activeQuestions = mode === "mock30" ? shuffled.slice(0, 30) : shuffled;
  currentIndex = 0;
  score = 0;
  catStats = {};
  document.getElementById("quiz-card").classList.remove("hidden");
  document.getElementById("result-card").classList.add("hidden");
  renderQuestion();
}

function renderQuestion() {
  const item = activeQuestions[currentIndex];
  document.getElementById("q-counter").textContent = `Question ${currentIndex + 1} of ${activeQuestions.length}`;
  document.getElementById("q-category").textContent = item.c;
  document.getElementById("q-score").textContent = `Score: ${score}`;
  document.getElementById("progress-fill").style.width = `${(currentIndex / activeQuestions.length) * 100}%`;
  document.getElementById("question-text").textContent = item.q;

  const expEl = document.getElementById("explanation");
  expEl.classList.remove("show");
  expEl.textContent = "";
  document.getElementById("next-btn").classList.add("hidden");

  const optsEl = document.getElementById("options");
  optsEl.innerHTML = "";
  item.o.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = optText;
    btn.addEventListener("click", () => selectAnswer(idx));
    optsEl.appendChild(btn);
  });
}

function selectAnswer(selectedIdx) {
  const item = activeQuestions[currentIndex];
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach((b, idx) => {
    b.disabled = true;
    if (idx === item.a) b.classList.add("correct");
    else if (idx === selectedIdx) b.classList.add("wrong");
  });

  if (!catStats[item.c]) catStats[item.c] = { correct: 0, total: 0 };
  catStats[item.c].total++;
  if (selectedIdx === item.a) {
    score++;
    catStats[item.c].correct++;
  }

  document.getElementById("q-score").textContent = `Score: ${score}`;
  const expEl = document.getElementById("explanation");
  expEl.textContent = item.e;
  expEl.classList.add("show");

  const nextBtn = document.getElementById("next-btn");
  nextBtn.textContent = currentIndex === activeQuestions.length - 1 ? "View Results" : "Next Question →";
  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < activeQuestions.length) renderQuestion();
  else showResults();
}

function showResults() {
  document.getElementById("quiz-card").classList.add("hidden");
  document.getElementById("result-card").classList.remove("hidden");

  const pct = Math.round((score / activeQuestions.length) * 100);
  const passed = pct >= 70;
  const trackLabel = track === "cplvh" ? "CPLVH (HTM 06-02)" : "CPLV";
  const badge = document.getElementById("pass-badge");
  badge.textContent = passed ? "PASS (70%+)" : "BELOW PASS MARK (<70%)";
  badge.className = `pass-pill ${passed ? "pass" : "fail"}`;

  document.getElementById("final-score").textContent = `${score} / ${activeQuestions.length} (${pct}%)`;
  document.getElementById("final-sub").textContent = passed
    ? `Great work — you met the City & Guilds Assured ${trackLabel} pass threshold.`
    : `Review the categories below and try another shuffled ${trackLabel} sitting.`;

  const breakdown = document.getElementById("cat-breakdown");
  breakdown.innerHTML = "";
  Object.entries(catStats).forEach(([cat, st]) => {
    const div = document.createElement("div");
    div.className = "cat-box";
    const cPct = Math.round((st.correct / st.total) * 100);
    div.innerHTML = `<strong>${cat}</strong>${st.correct} / ${st.total} (${cPct}%)`;
    breakdown.appendChild(div);
  });
}

startQuiz();
