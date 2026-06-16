/* =============================================
   AnnshiVerse — main.js
   Dark Romance · Cinematic · Handcrafted
   ============================================= */

/* ── NAV: scroll shrink + mobile toggle ── */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── PARTICLE CANVAS (hero only) ── */
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H, animId;

  // Dark romance palette: blood red, deep crimson, faint gold dust
  const COLORS = [
    'rgba(139, 26, 26,',       // deep blood
    'rgba(192, 57, 43,',       // crimson
    'rgba(232, 71, 74,',       // rose red
    'rgba(201, 168, 76,',      // gold dust
    'rgba(107, 15, 15,',       // very dark blood
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles(n) {
    particles = [];
    for (let i = 0; i < n; i++) {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      // Smaller particles, mostly gold dust and blood motes
      const isGold = Math.random() < 0.25;
      particles.push({
        x:   Math.random() * W,
        y:   Math.random() * H,
        r:   isGold ? Math.random() * 1.2 + 0.4 : Math.random() * 2.5 + 0.8,
        dx:  (Math.random() - 0.5) * 0.25,
        dy: -(Math.random() * 0.35 + 0.05),
        a:   Math.random() * 0.45 + 0.08,
        da:  (Math.random() - 0.5) * 0.0015,
        col: isGold ? 'rgba(201, 168, 76,' : c,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.a += p.da;
      if (p.a > 0.55) p.da *= -1;
      if (p.a < 0.04) p.da = Math.abs(p.da);
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.a + ')';
      ctx.fill();
    });
    animId = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(() => {
    resize();
    createParticles(Math.floor((W * H) / 16000));
  });
  ro.observe(canvas.parentElement);

  resize();
  createParticles(Math.floor((W * H) / 16000));
  draw();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });
}

const questions = [

{
question: "Complete the line: 'That slap just made you my...'",
options: ["Queen", "Obsession", "Wife", "Destiny"],
correct: 2,
message: "🔥 The line that changed everything."
},

{
question: "What is Anaya's strongest quality?",
options: ["Beauty", "Courage", "Wealth", "Intelligence"],
correct: 1,
message: "🖤 Courage is what made her unforgettable."
},

{
question: "Who does Arjun trust the most?",
options: ["Vikrant", "Anaya", "Both Anaya and Vikrant", "Nobody"],
correct: 2,
message: "⚡ Trust is rare in Arjun's world."
},

{
question: "Anaya's greatest strength is:",
options: ["Shivay", "Arjun", "Arjun Singh Rana", "All of the above"],
correct: 3,
message: "👑 Family became her greatest strength."
},

{
question: "Which emotion best defines Arjun's love for Anaya?",
options: ["Friendship", "Respect", "Obsession", "Sympathy"],
correct: 2,
message: "🔥 Not love. Obsession."
},

{
question: "The bond between Arjun and Anaya is best described as:",
options: ["Love", "Destiny", "Both Love and Destiny", "Coincidence"],
correct: 2,
message: "🖤 Some bonds feel written in fate."
},

{
question: "Who was the biggest enemy in their journey?",
options: ["Kesha Talwar", "Vikrant", "Shivay", "Arjun"],
correct: 0,
message: "⚔️ Every love story has a villain."
},

{
question: "Which word describes Arjun best?",
options: ["Ruthless", "Dominant", "Loyal", "All of the above"],
correct: 3,
message: "😏 Arjun is never just one thing."
}

];

let currentQuestion = 0;
let score = 0;

function startQuiz(){
showQuestion();
}

function showQuestion() {

const q = questions[currentQuestion];

document.getElementById("quizContainer").innerHTML = `

<div class="quiz-box">

<div class="progress">
Question ${currentQuestion+1}/${questions.length}
</div>

<h3 class="quiz-question">
${q.question}
</h3>

${q.options.map((option,index)=>`
<label class="quiz-option">
<input type="radio"
name="answer"
value="${index}">
${option}
</label>
`).join("")}

<br>

<button class="btn" onclick="checkAnswer()">
Submit Answer
</button>

</div>
`;
}

function checkAnswer(){

const selected =
document.querySelector(
'input[name="answer"]:checked'
);

if(!selected){
alert("Choose an answer first 😭");
return;
}

const answer =
parseInt(selected.value);

const q = questions[currentQuestion];

if(answer === q.correct){
score++;
}

document.getElementById("quizContainer").innerHTML = `
<div class="quiz-box">

<div class="quiz-feedback">
${q.message}

<br><br>

<button class="btn" onclick="nextQuestion()">
Next Question →
</button>

</div>

</div>
`;
}

function nextQuestion(){

currentQuestion++;

if(currentQuestion < questions.length){
showQuestion();
}
else{
showResult();
}
}

function showResult(){

let level = "";
let desc = "";

if(score <= 2){
level = "📖 Curious Visitor";
desc = "You know the basics, but the AnnshiVerse still has secrets for you.";
}
else if(score <= 4){
level = "🌹 Reader";
desc = "You've spent time in the story world.";
}
else if(score <= 6){
level = "🖤 Obsessed Reader";
desc = "The characters definitely live rent free in your head.";
}
else if(score <= 7){
level = "👑 Die Hard Fan";
desc = "You belong in the fandom hall of fame.";
}
else{
level = "💀 Certified AnnshiVerse Resident";
desc = "At this point you're basically part of the story.";
}

document.getElementById("quizContainer").innerHTML = `
<div class="quiz-box result-card">

<h2 class="result-title">
${level}
</h2>

<h3>
Score: ${score}/${questions.length}
</h3>

<p>
${desc}
</p>

<br>

<button class="btn" onclick="location.reload()">
Play Again
</button>

</div>
`;
}

window.startQuiz = startQuiz;
window.checkAnswer = checkAnswer;
window.nextQuestion = nextQuestion;
