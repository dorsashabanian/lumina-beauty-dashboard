const startBtn = document.getElementById("startQuizBtn");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("themeToggle");
const quizContainer = document.getElementById("quizContainer");
const progressBar = document.querySelector(".progress-bar");
const productsGrid = document.getElementById("productsGrid");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

let currentSearch = "";
let currentFilter = "all";
let selectedValue = "";


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

const products = [
  {
    id: 1,
    name: "Hydra Lily Serum",
    type: "serum",
    skin: "dry",
    description: "Deep hydration serum",

    ingredients: ["Hyaluronic Acid", "Niacinamide", "Ceramides"],

    benefits: ["Hydration", "Barrier Support", "Glow"],

    usage: "Apply morning and evening after cleansing."
  },

  {
    id: 2,
    name: "Pure Foam Cleanser",
    type: "cleanser",
    skin: "oily",
    description: "Gentle daily cleanser",

    ingredients: ["Salicylic Acid", "Green Tea Extract", "Glycerin"],

    benefits: ["Deep Cleansing", "Oil Control", "Pore Care"],

    usage: "Massage onto damp skin and rinse thoroughly."
  },

  {
    id: 3,
    name: "Barrier Repair Cream",
    type: "moisturizer",
    skin: "sensitive",
    description: "Strengthens skin barrier",

    ingredients: ["Ceramides", "Panthenol", "Shea Butter"],

    benefits: ["Barrier Repair", "Soothing", "Long-lasting Moisture"],

    usage:"Apply as the final step of your evening routine."
  },

  {
    id: 4,
    name: "Glow Vitamin C",
    type: "serum",
    skin: "all",
    description: "Brightening treatment",

    ingredients: ["Vitamin C", "Ferulic Acid", "Vitamin E"],

    benefits: ["Brightening", "Even Skin Tone", "Antioxidant Protection"],

    usage: "Apply in the morning before moisturizer and SPF."
  },

  {
    id: 5,
    name: "Velvet Night Cream",
    type: "cream",
    skin: "dry",
    description: "Rich overnight nourishment",

    ingredients: ["Squalane", "Ceramides", "Peptides"],

    benefits: ["Deep Nourishment", "Soft Skin", "Overnight Recovery"],

    usage: "Apply every night as the final skincare step."
  },

  {
    id: 6,
    name: "Balance Toner",
    type: "toner",
    skin: "oily",
    description: "Refreshing balancing toner",

    ingredients: ["Witch Hazel", "Niacinamide", "Aloe Vera"],

    benefits: ["Oil Balance", "Pore Refining", "Refreshes Skin"],

    usage: "Apply with a cotton pad after cleansing."
  },

  {
    id: 7,
    name: "Calm Essence",
    type: "essence",
    skin: "sensitive",
    description: "Lightweight soothing essence",

    ingredients: ["Centella Asiatica", "Panthenol", "Beta-Glucan"],

    benefits: ["Redness Relief", "Hydration", "Skin Comfort"],

    usage: "Pat gently into the skin after toner."
  },

  {
    id: 8,
    name: "Radiance SPF 50",
    type: "sunscreen",
    skin: "all",
    description: "Daily broad-spectrum sun protection",

    ingredients: ["Zinc Oxide", "Vitamin E", "Niacinamide"],

    benefits: ["UV Protection", "Prevents Premature Aging", "Lightweight Finish"],

    usage: "Apply generously every morning and reapply as needed."
  }
];

function renderProducts(items) {
  if(items.length === 0){
  productsGrid.innerHTML = `
    <p class="empty-state">
      No products found.
    </p>
  `;
  return;
}

  productsGrid.innerHTML = items.map(product => {
    const isFavorite = favorites.includes(product.id);
    return `
    <div
      class="product-card"
      data-id="${product.id}"
    >
    <button
      class="favorite-btn"
      data-id="${product.id}"
    >
      ${isFavorite ? "❤️" : "🤍"}
    </button>

    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <span>${product.type}</span>
  </div>
`;
  }).join("");

  attachFavoriteEvents();
  attachProductEvents();
}

function attachProductEvents(){
  const cards = document.querySelectorAll(".product-card");
  cards.forEach(card => {card.addEventListener("click", openProductModal);});
}

function openProductModal(e){
  const productId = Number(e.currentTarget.dataset.id);

  const product = products.find(item => item.id === productId);

  modalBody.innerHTML = `
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <h3>Ingredients</h3>

    <ul>
      ${product.ingredients.map(item => `<li>${item}</li>`).join("")}
    </ul>

    <h3>Benefits</h3>

    <ul>
      ${product.benefits.map(item => `<li>${item}</li>`).join("")}
    </ul>

    <h3>How To Use</h3>
    <p>${product.usage}</p>
  `;
  modal.classList.remove("hidden");
}

function toggleFavorite(e){
  e.stopPropagation();

  const id = Number(e.target.dataset.id);

  if(favorites.includes(id)){
    favorites = favorites.filter(favId => favId !== id);
    showToast("Removed from Favorites");
  }
  else{
    favorites.push(id);
    showToast("Added to Favorites ❤️");
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateProducts();
  renderFavorites();
}

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

  const recommendedProducts = products.filter(product => {
    return ( product.skin === answers.skinType.toLowerCase() ||
      product.skin === "all");
  });

  return {score, morningRoutine, nightRoutine, recommendedProducts};
}

function finishQuiz(){
  console.log(answers);
  document.querySelector(".quiz").classList.add("hidden");
  document.querySelector(".dashboard").classList.remove("hidden");
  document.querySelector(".dashboard").scrollIntoView({behavior:"smooth"});
  renderDashboard();
}

function renderDashboard() {

  const result = generateAnalysis();

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

    <div class="recommendations">

      <h2>
        Recommended Products
      </h2>

      <div class="recommended-grid">

        ${result.recommendedProducts
          .map(product => `
            <div class="recommended-card">
              <h4>${product.name}</h4>
              <p>${product.description}</p>
            </div>
          `)
          .join("")}

      </div>

    </div>
  `;
  animateScore(result.score);
}

function renderFavorites(){
  const favoritesGrid = document.getElementById("favoritesGrid");
  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  if(favoriteProducts.length === 0){
    favoritesGrid.innerHTML = `<p class="empty-state">No favorite products yet.</p>`;
    return;
  }

  favoritesGrid.innerHTML = favoriteProducts.map(product => `
        <div class="product-card">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>`).join("");
}

function handleSearch(e){
  currentSearch = e.target.value.toLowerCase();
  updateProducts();
}

function handleFilter(e){
  currentFilter = e.target.value;
  updateProducts();
}

function updateProducts() {
  let filtered = [...products];

  if(currentFilter === "favorite"){
    filtered = filtered.filter(product => favorites.includes(product.id));
  }
  else if(currentFilter !== "all"){
        filtered = filtered.filter(product => product.skin === currentFilter || product.skin === "all");
  }

  if(currentSearch){
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(currentSearch) ||
      product.type.toLowerCase().includes(currentSearch) || 
      product.description.toLowerCase().includes(currentSearch)
    );
  }
  renderProducts(filtered);
}

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {toast.classList.remove("show");}, 2500);
}

function toggleTheme(){
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
  showToast(`Theme Updated`);
}

filterSelect.addEventListener("change", handleFilter);

function animateScore(target){
  const scoreElement = document.querySelector(".score");
  let current = 0;
  const interval = setInterval(() => {current++;
      scoreElement.textContent =`${current}%`;
      if(current >= target){
        clearInterval(interval);
      }
    },15);
}


closeModal.addEventListener("click",() => { modal.classList.add("hidden");});

modal.addEventListener("click",(e) => {
    if(e.target === modal){ modal.classList.add("hidden");}
  }
);

function attachFavoriteEvents(){
  const favoriteBtns = document.querySelectorAll(".favorite-btn");
  favoriteBtns.forEach(btn => {btn.addEventListener("click", toggleFavorite);});
}

themeToggle.addEventListener("click", toggleTheme);

const savedTheme = localStorage.getItem("theme");
if(savedTheme === "light"){
  document.body.classList.add("light-theme");
  themeToggle.textContent = "☀️";
}
searchInput.addEventListener("input", handleSearch);

updateProducts();
renderFavorites();

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startQuizBtn");
  startBtn.addEventListener("click", () => {
    document.querySelector(".quiz").classList.remove("hidden");
    renderQuizStep();
    document.querySelector(".quiz").scrollIntoView({ behavior: "smooth" });
  });

});
