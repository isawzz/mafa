// Array to store the user's responses
var userResponses = [];

// Functions to display the questionnaire
function displayQuestionnaire(keys,num) {
  if (nundef(keys)) keys=['preferences','expectations','needs'];
  var questionnaireContainer = document.getElementById("questionnaire");

  console.log('DiQuestions', DiQuestions)
  let i = 0;
  for (const k in DiQuestions) {
    //console.log('__',k,keys,leys.includes)
    if (!keys.includes(k)) continue;
    for (const q of DiQuestions[k]) {
      var question = document.createElement("div");
      question.className = "question";
      question.innerHTML = "<h3>Question " + (i + 1) + ": " + q + "</h3>";

      var answer = document.createElement("input");
      answer.className = "answer-input";
      answer.setAttribute("type", "text");
      answer.setAttribute("data-question-index", i);

      question.appendChild(answer);
      questionnaireContainer.appendChild(question);
      i+=1;
    }
  }
}

// Function to submit the questionnaire and store responses
function submitQuestionnaire() {
  var answerInputs = document.querySelectorAll("input[data-question-index]");
  for (var i = 0; i < answerInputs.length; i++) {
    var response = answerInputs[i].value;
    userResponses.push(response);
  }

  displayResults();
}

// Function to display user's responses
function displayResults() {
  var resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  for (var i = 0; i < userResponses.length; i++) {
    var question = document.createElement("h3");
    question.textContent = "Question " + (i + 1) + ": " + DiQuestions[i];
    resultsContainer.appendChild(question);

    var answer = document.createElement("p");
    answer.textContent = "Answer: " + userResponses[i];
    resultsContainer.appendChild(answer);
  }
}

