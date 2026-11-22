let url = new URLSearchParams(window.location.search);
let quiz_id = Number(url.get('id')) || 1;
let quiz_obj;
let current_question = 0;
let userAnswer = [];
let timerStop;
let countDown = 0;

const $ = (element) => {
    return document.getElementById(element);
}

const quizDetails = () => {

    let idFounder = quiz.find((item) => item.id === quiz_id);

    if (idFounder) {
        quiz_obj = idFounder;
    }
    else {
        window.location.href = 'index.html';
        return;
    }


    $('cover-img').src = quiz_obj.image;
    $('quiz_category').textContent = quiz_obj.title;
    $('quiz-desc').textContent = quiz_obj.description;
    $('total-que').textContent = quiz_obj.questions.length;
    $('total-time').textContent = quiz_obj.time;

}

quizDetails();

const showQuestion = () => {
    current_question = 0;
    userAnswer = [];
    countDown = quiz_obj.time
    $('questioncard').classList.remove("d-none")
    $('showdetail').classList = `d-none`
    $('score-section').classList.add("d-none")
    questionLoader();

    for (let i = 0; i < quiz_obj.questions.length; i++) {
        userAnswer.push(null)
    }
    // console.log(userAnswer);

    timer()
}


let abcd = ["A", "B", "C", "D"]

const storeOpt = (i) => {
    userAnswer[current_question] = quiz_obj.questions[current_question].options[i];
    // console.log(userAnswer);

    options()

}

const options = () => {

    $('opt-btn').innerHTML = "";
    for (let i = 0; i < quiz_obj.questions[current_question].options.length; i++) {
        let button = document.createElement('button');
        button.classList = (userAnswer[current_question] == quiz_obj.questions[current_question].options[i])
            ? `border border-primary mb-4 py-3 btn btn-primary text-black w-100 rounded-3 text-start p-2`
            : `border bg-transparent mb-4 py-3 text-primary border-primary w-100 btn-primary rounded-3 text-start p-2`
        button.textContent = `${abcd[i]}. ${quiz_obj.questions[current_question].options[i]}`;
        $('opt-btn').append(button)
        button.addEventListener("click", () => {
            storeOpt(i);
        })
    }

}

const questionLoader = () => {
    $('img').src = quiz_obj.questions[current_question].image;
    $('que-len').textContent = quiz_obj.questions.length;
    $('current-que').textContent = current_question + 1;
    $('progress-bar').style.width = `${((current_question + 1) / quiz_obj.questions.length) * 100}%`;
    $('multiple-ques').textContent = quiz_obj.questions[current_question].question;
    $('next').textContent = (current_question < quiz_obj.questions.length - 1)
        ? `Next`
        : `Finish`
    options();
}

// questionLoader();



const nextQuestion = () => {
    if (current_question < quiz_obj.questions.length - 1) {
        current_question++;
        questionLoader()
    } else {
        finish()
    }

}

const previousQuestion = () => {
    if (current_question > 0) {
        current_question--;
        questionLoader()
    }
}

const attemptSkip = () => {
    let attempt = 0;
    let skip = 0;
    for (let i = 0; i < userAnswer.length; i++) {
        if (userAnswer[i] != null) {
            attempt++
        } else {
            skip++
        }
    }


    return { attempt, skip }
}

const answerChecker = () => {
    let correct = 0;
    let wrong = 0;

    for (let i = 0; i < userAnswer.length; i++) {
        if (userAnswer[i] == quiz_obj.questions[i]['true-ans']) {
            correct++;
        } else {
            wrong++;
        }
    }

    return { correct, wrong }

}

const finish = () => {
    clearInterval(timerStop)
    $('score-section').classList.remove("d-none")
    $('questioncard').classList.add("d-none")
    $('actual-attempt').textContent = attemptSkip().attempt;
    $('total-attempt').textContent = quiz_obj.questions.length;
    $('skip').textContent = attemptSkip().skip;
    $('correct').textContent = answerChecker().correct;
    $('wrong').textContent = answerChecker().wrong;

}

const timer = () => {
    timerStop = setInterval(() => {
        if (countDown === 0) {
            finish();
        }
        $('timer').textContent = countDown--;
    }, 1000);
}


// event

$('start_quiz').addEventListener("click", showQuestion)
$('next').addEventListener('click', nextQuestion)
$('previous').addEventListener('click', previousQuestion)
$('try-again').addEventListener('click', () => {
    questionLoader()
    showQuestion()
})
$('back-to-home').addEventListener("click", () => {
    window.location.href = 'index.html'
})