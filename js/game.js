const question = document.getElementById("question");
const choices = document.querySelectorAll(".choice");
const scoreText = document.getElementById("score");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const title = document.getElementById("title");
const timeText = document.getElementById("timeText");


let score = 0
let questionCounter = 0
let currentQuestion = {}
let questionBase = []
let availableQuestions = []
let acceptingAnswers = false
let maxTime = 10;
let counter; 

const fetchData = async () => {
    try {
        const res = await fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
        const data = await res.json() 
        startGame(data)
    } catch (error) {
        console.log(error) 
    }
}
fetchData()

const CorrectBonus = 10;
const MaxQuestions = 10;

const startGame = (data) => {
    questionCounter = 0;
    score = 0;
    questionBase = data.results.map( loadedQuestion => {
        const formattedQuestion = { 
            question: loadedQuestion.question
        };
        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
        answerChoices.splice(formattedQuestion.answer -1, 0, loadedQuestion.correct_answer);

        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index+1)] = choice; 
        })  

        return formattedQuestion; 
    })
    availableQuestions = [...questionBase];
    
    getNewQuestion()
    title.classList.remove("hidden");
    game.classList.remove("hidden");
    loader.classList.add("hidden");
}

const getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter > MaxQuestions) {
        localStorage.setItem("mostRecentScore", score); 
        return window.location.assign("end.html");
    }
    questionCounter++;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionIndex]

    question.innerHTML = currentQuestion.question 

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });
    availableQuestions.splice(questionIndex, 1)
 
    acceptingAnswers = true
    startTimer(maxTime)
}

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return; 
        acceptingAnswers = false;
        clearInterval(counter)
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"]; 

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        if (classToApply === "correct") {
            incrementScore(CorrectBonus) 
        }
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => { 
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion()
        }, 1000);
    })
})
const incrementScore = num => {
    score += num; 
    scoreText.innerText = score;
}
const startTimer = (time) => { 
    counter = setInterval(timer, 1000); 
    function timer () {
        timeText.textContent = time;  
        time--; 
        if(time < 9){ 
            let addZero = timeText.textContent; 
            timeText.textContent = "0" + addZero;
        }
        if(time < 0) { 
            clearInterval(counter); 
            timeText.textContent = "00";
            getNewQuestion()
        }
    }
}



