let startTime = 0; 
let trials = [];
let trial = 1;
let lives = 3;
let gameRunning = false;
let session = 0;

const livesCount = document.getElementById("livesCount");
const target = document.getElementById("target");
const ghosts = document.querySelectorAll(".ghost");
const info = document.getElementById("info");
const game = document.getElementById("game");

// ---------- RANDOM MOVE ----------
function randomMove(el) {
  const gameRect = game.getBoundingClientRect();

  const x = Math.random() * (gameRect.width - el.offsetWidth);
  const y = Math.random() * (gameRect.height - el.offsetHeight);

  el.style.left = x + "px";
  el.style.top = y + "px";
}

// ---------- GHOST ANIMATION ----------
function animateGhosts() {
  ghosts.forEach(g => {
    setInterval(() => {
      if (gameRunning) {
        randomMove(g);
      }
    }, 800 + Math.random() * 1000);
  });
}

// ---------- TARGET MOVE ----------
function moveTarget() {
  setInterval(() => {
    if (gameRunning) {
      randomMove(target);
    }
  }, 2000);
}

// ---------- START GAME ----------
function startGame() {
  lives = 3;
  updateLives();

  session++; // new session
  trial = trials.length + 1; // continue counting

  gameRunning = true;
  startTime = performance.now();

  info.innerText = `Session ${session} Started! Click 🎯`;
}

// ---------- TARGET CLICK ----------
target.addEventListener("click", (e) => {
  e.stopPropagation();

  if (!gameRunning || lives === 0) return;

  const mt = (performance.now() - startTime).toFixed(1);

  trials.push({
    session,
    trial: trial++,
    MT: mt
  });

  info.innerText = `⏱ ${mt} ms`;

  startTime = performance.now();
});

//-----------add touch screen------
target.addEventListener("touchstart", (e) => {
  e.preventDefault();
  target.click();
});

ghosts.forEach(g => {
  g.addEventListener("touchstart", (e) => {
    e.preventDefault();
    g.click();
  });
});

ghosts.forEach(g => {
  g.addEventListener("touchstart", (e) => {
    e.preventDefault();
    g.click();
  });
});

// ---------- LIVES ----------
function updateLives() {
  livesCount.innerText = lives;
  // hearts:
  // livesCount.innerText = "❤️".repeat(lives);
}

function loseLife() {
  if (!gameRunning || lives <= 0) return;

  lives--;
  updateLives();

  if (lives === 0) {
    info.innerText = "💀 Game Over!";
    gameRunning = false;
    startTime = 0;
  }
}

// ---------- GHOST CLICK ----------
ghosts.forEach(g => {
  g.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!gameRunning) return;
    loseLife();
  });
});

// ---------- MISS CLICK ----------
game.addEventListener("click", (e) => {
  if (!gameRunning) return;

  if (e.target.id !== "target") {
    loseLife();
  }
});

// ---------- CSV ----------
function downloadCSV() {
  let csv = "session,trial,MT\n";

  trials.forEach(t => {
    csv += `${t.session},${t.trial},${t.MT}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "game_data.csv";
  a.click();
}

// ---------- LOAD ----------
window.onload = () => {
  updateLives();
  info.innerText = "Press Start to begin";

  animateGhosts();
  moveTarget();
};