const startBtn = document.getElementById("startQuizBtn");

startBtn.addEventListener("click", () => {

  document
    .querySelector(".quiz")
    .scrollIntoView({
      behavior: "smooth"
    });

});