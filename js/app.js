const startBtn = document.getElementById("startQuizBtn");


const quizSteps = [
  {
    question: "What's your skin type?",
    name: "skinType",
    options: ["Dry", "Oily", "Combination", "Sensitive"]
  },
  {
    question: "Main skin concern?",
    name: "concern",
    options: ["Acne", "Hydration", "Anti-Aging", "Brightening"]
  },
  {
    question: "Budget?",
    name: "budget",
    options: ["Low", "Medium", "Premium"]
  },
  {
    question: "Routine Goal?",
    name: "goal",
    options: ["Healthy Skin", "Glow", "Repair", "Anti-Aging"]
  }
];

let currentStep = 0;
const answers = {skinType: "", concern: "", budget: "", goal: ""};

const quizContainer = document.getElementById("quizContainer");

const progressBar = document.querySelector(".progress-bar");

function renderQuizStep() {
  const step = quizSteps[currentStep];
  quizContainer.innerHTML = `
    <div class="quiz-card">
      <h2>${step.question}</h2>
        <div class="options">
            ${step.options.map(option => `
            <button
                class="option-btn"
                data-value="${option}"
            >
                ${option}
            </button>
            `).join("")}
        </div>
        <div class="quiz-actions">
        ${
          currentStep > 0
            ? `<button id="prevBtn">
                Previous
               </button>`
            : ""
        }
        <button id="nextBtn">
          ${
            currentStep === quizSteps.length - 1
              ? "Finish"
              : "Next"
          }
        </button>
        </div>
    </div>
  `;
  updateProgress();
  attachEvents();
}

function updateProgress() {
  const progress = ((currentStep + 1) / quizSteps.length) * 100;
  progressBar.style.width = `${progress}%`;
}
let selectedValue = "";

function attachEvents() {
  const optionBtns = document.querySelectorAll(".option-btn");

  optionBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      optionBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedValue = btn.dataset.value;
    });
  });

  document.getElementById("nextBtn").addEventListener("click", nextStep);

  const prevBtn = document.getElementById("prevBtn");
  if(prevBtn){
    prevBtn.addEventListener(
      "click",
      previousStep
    );
  }
}

function nextStep() {
  if(!selectedValue){
    alert("Please select an option.");
    return;
  }

  const currentField = quizSteps[currentStep].name;

  answers[currentField] = selectedValue;
  selectedValue = "";

  if(currentStep < quizSteps.length - 1){
    currentStep++;
    renderQuizStep();
  }
  else finishQuiz();

}

function previousStep(){
  currentStep--;
  renderQuizStep();
}

function generateAnalysis() {

  let score = 75;
  const morningRoutine = ["Gentle Cleanser", "Moisturizer", "SPF 50"];
  const nightRoutine = ["Cleanser", "Night Cream"];

  if (answers.skinType === "Dry" && answers.concern === "Hydration"){
    score = 82;
    morningRoutine.splice(1, 0, "Hyaluronic Acid Serum");
    nightRoutine.push("Barrier Repair Cream");
  }

  if (answers.concern === "Anti-Aging"){
    score += 5;
    nightRoutine.push("Retinol Serum");
  }

  return {score, morningRoutine, nightRoutine};
}

function finishQuiz(){
  console.log(answers);
  document.querySelector(".quiz").classList.add("hidden");
  document.querySelector(".dashboard").classList.remove("hidden");

  renderDashboard();

  document.querySelector(".dashboard").scrollIntoView({behavior:"smooth"});
}

startBtn.addEventListener("click", () => {
  document.querySelector(".quiz").classList.remove("hidden");
  renderQuizStep();
  document.querySelector(".quiz").scrollIntoView({behavior:"smooth"});
});

function renderDashboard() {

  const result =
    generateAnalysis();

  const dashboard =
    document.getElementById(
      "dashboardContent"
    );

  dashboard.innerHTML = `
    <div class="stats-card">
      <h2>Skin Score</h2>
      <span class="score">${result.score}%</span>
    </div>

    <div class="routine-grid">
      <div class="routine-card">
        <h3>Morning Routine</h3>
        <ul>
          ${result.morningRoutine.map(item => `<li>✓ ${item}</li>`).join("")}
        </ul>
      </div>

      <div class="routine-card">
        <h3>Night Routine</h3>
        <ul>
        ${result.nightRoutine.map(item => `<li>✓ ${item}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

