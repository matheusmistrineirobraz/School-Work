// ==================== BACKGROUND INTERATIVO COM PARTÍCULAS ====================

const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Interação com o mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 2;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 2;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 2;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 2;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = 'rgba(255, 255, 255, 0.5)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(255, 159, 10,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

init();
animate();

// ==================== ANIMAÇÕES DE SCROLL ====================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .flip-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== MINIGAME 1: DECIFRE O CÓDIGO ====================

let draggedElement = null;
let game1Completed = false;

const draggables = document.querySelectorAll('.draggable');
const dropZones = document.querySelectorAll('.drop-zone');

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', function(e) {
        if (!this.classList.contains('used')) {
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        } else {
            e.preventDefault();
        }
    });

    draggable.addEventListener('dragend', function() {
        this.classList.remove('dragging');
    });
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });

    zone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');

        if (draggedElement && !this.classList.contains('filled')) {
            const correctValue = this.getAttribute('data-correct');
            const droppedValue = draggedElement.getAttribute('data-value');

            this.textContent = draggedElement.textContent;
            this.classList.add('filled');
            draggedElement.classList.add('used');

            // Atualizar preview do botão
            updatePreview();

            // Verificar se o jogo foi completado
            checkGame1Completion();
        }
    });
});

function updatePreview() {
    const previewButton = document.getElementById('previewButton');
    const drop1 = document.getElementById('drop1');
    const drop2 = document.getElementById('drop2');
    const drop3 = document.getElementById('drop3');

    if (drop1.classList.contains('filled')) {
        previewButton.style.backgroundColor = '#3378ad';
    }
    if (drop2.classList.contains('filled')) {
        previewButton.style.color = 'white';
    }
    if (drop3.classList.contains('filled')) {
        previewButton.style.padding = '10px 20px';
    }
}

function checkGame1Completion() {
    const allDropZones = document.querySelectorAll('.drop-zone');
    let allFilled = true;
    let allCorrect = true;

    allDropZones.forEach(zone => {
        if (!zone.classList.contains('filled')) {
            allFilled = false;
        } else {
            const correctValue = zone.getAttribute('data-correct');
            const currentText = zone.textContent;
            
            // Verificar se está correto
            if (correctValue === 'blue' && !currentText.includes('#3378ad')) {
                allCorrect = false;
            }
            if (correctValue === 'white' && !currentText.includes('white')) {
                allCorrect = false;
            }
            if (correctValue === '10px' && !currentText.includes('10px 20px')) {
                allCorrect = false;
            }
        }
    });

    const feedback = document.getElementById('game1-feedback');
    
    if (allFilled) {
        if (allCorrect) {
            feedback.textContent = '🎉 Parabéns! Você decifrou o código corretamente!';
            feedback.className = 'game-feedback success';
            game1Completed = true;
        } else {
            feedback.textContent = '❌ Quase lá! Algumas opções estão incorretas. Tente novamente!';
            feedback.className = 'game-feedback error';
        }
    }
}

// ==================== MINIGAME 2: QUIZ TECH ====================

const quizData = [
    {
        question: 'O que significa a sigla "HTML"?',
        options: [
            'HyperText Markup Language',
            'High Tech Modern Language',
            'Home Tool Markup Language',
            'Hyperlink and Text Markup Language'
        ],
        correct: 0
    },
    {
        question: 'Qual linguagem é usada para estilizar páginas web?',
        options: [
            'JavaScript',
            'Python',
            'CSS',
            'Java'
        ],
        correct: 2
    },
    {
        question: 'Qual empresa desenvolveu o sistema operacional Android?',
        options: [
            'Apple',
            'Microsoft',
            'Google',
            'Samsung'
        ],
        correct: 2
    },
    {
        question: 'O que é um "bug" em programação?',
        options: [
            'Um tipo de vírus',
            'Um erro no código',
            'Uma ferramenta de desenvolvimento',
            'Um comando especial'
        ],
        correct: 1
    },
    {
        question: 'Qual destas NÃO é uma linguagem de programação?',
        options: [
            'Python',
            'JavaScript',
            'Photoshop',
            'C++'
        ],
        correct: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;
let quizAnswered = false;

function loadQuestion() {
    const questionData = quizData[currentQuestionIndex];
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const currentQuestionSpan = document.getElementById('current-question');
    const feedback = document.getElementById('quiz-feedback');

    questionText.textContent = questionData.question;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    optionsContainer.innerHTML = '';
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
    quizAnswered = false;

    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(index, button));
        optionsContainer.appendChild(button);
    });

    document.getElementById('next-question').style.display = 'none';
}

function selectAnswer(selectedIndex, button) {
    if (quizAnswered) return;

    quizAnswered = true;
    const questionData = quizData[currentQuestionIndex];
    const feedback = document.getElementById('quiz-feedback');
    const allButtons = document.querySelectorAll('.option-button');

    allButtons.forEach(btn => btn.disabled = true);

    if (selectedIndex === questionData.correct) {
        button.classList.add('correct');
        feedback.textContent = '✅ Correto! Muito bem!';
        feedback.className = 'quiz-feedback correct';
        score++;
        document.getElementById('score').textContent = score;
    } else {
        button.classList.add('incorrect');
        allButtons[questionData.correct].classList.add('correct');
        feedback.textContent = '❌ Incorreto! A resposta correta está destacada em verde.';
        feedback.className = 'quiz-feedback incorrect';
    }

    if (currentQuestionIndex < quizData.length - 1) {
        document.getElementById('next-question').style.display = 'block';
    } else {
        setTimeout(showResults, 2000);
    }
}

document.getElementById('next-question').addEventListener('click', function() {
    currentQuestionIndex++;
    loadQuestion();
});

function showResults() {
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    document.getElementById('max-score').textContent = quizData.length;

    const resultMessage = document.getElementById('result-message');
    const percentage = (score / quizData.length) * 100;

    if (percentage === 100) {
        resultMessage.textContent = '🏆 Perfeito! Você é um expert em tecnologia!';
    } else if (percentage >= 80) {
        resultMessage.textContent = '🌟 Excelente! Você tem muito conhecimento sobre tech!';
    } else if (percentage >= 60) {
        resultMessage.textContent = '👍 Bom trabalho! Continue estudando!';
    } else if (percentage >= 40) {
        resultMessage.textContent = '📚 Você está no caminho certo! Pratique mais!';
    } else {
        resultMessage.textContent = '💪 Não desanime! O curso técnico vai te ajudar muito!';
    }
}

document.getElementById('restart-quiz').addEventListener('click', function() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('quiz-content').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';
    loadQuestion();
});

// Inicializar o quiz
document.getElementById('total-questions').textContent = quizData.length;
loadQuestion();

// ==================== SMOOTH SCROLL PARA NAVEGAÇÃO ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== NAVBAR SCROLL EFFECT ====================

let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }
    
    lastScroll = currentScroll;
});

// ==================== BOTÕES DE AÇÃO ====================

document.querySelectorAll('.cta-button-large, .cta-button-secondary').forEach(button => {
    button.addEventListener('click', function() {
        alert('🎉 Obrigado pelo interesse! Em breve você receberá mais informações sobre o curso.');
    });
});

console.log('🚀 Site carregado com sucesso! Explore e divirta-se com os minigames!');

